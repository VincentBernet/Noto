import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		tokenIdentifier: v.string(),
		name: v.optional(v.string()),
		email: v.optional(v.string()),
		pictureUrl: v.optional(v.string()),
	}).index("by_token", ["tokenIdentifier"]),

	conversations: defineTable({
		userId: v.id("users"),
		messages: v.array(
			v.object({
				from: v.union(v.literal("llm"), v.literal("user")),
				date: v.number(),
				message: v.string(),
			})
		),
	}).index("by_user", ["userId"]),
});

