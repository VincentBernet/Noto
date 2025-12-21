import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
	args: {
		message: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}

		// Get the user from the database
		const user = await ctx.db
			.query("users")
			.withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) {
			throw new Error("User not found");
		}

		// Create a new conversation with the initial message
		const conversationId = await ctx.db.insert("conversations", {
			userId: user._id,
			messages: [
				{
					from: "user",
					date: Date.now(),
					message: args.message,
				},
			],
		});

		return conversationId;
	},
});

export const sendMessage = mutation({
	args: {
		conversationId: v.id("conversations"),
		message: v.string(),
		from: v.union(v.literal("llm"), v.literal("user")),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}

		// Get the conversation
		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new Error("Conversation not found");
		}

		// Verify the user owns this conversation
		const user = await ctx.db
			.query("users")
			.withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user || conversation.userId !== user._id) {
			throw new Error("Unauthorized");
		}

		// Add the new message to the conversation
		await ctx.db.patch(args.conversationId, {
			messages: [
				...conversation.messages,
				{
					from: args.from,
					date: Date.now(),
					message: args.message,
				},
			],
		});

		return args.conversationId;
	},
});

