import { mutation, query } from "../_generated/server";

export const store = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Called storeUser without authentication");
		}

		// Check if user already exists
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (existingUser !== null) {
			// Update existing user with latest info from OAuth provider
			if (
				existingUser.name !== identity.name ||
				existingUser.email !== identity.email ||
				existingUser.pictureUrl !== identity.pictureUrl
			) {
				await ctx.db.patch(existingUser._id, {
					name: identity.name,
					email: identity.email,
					pictureUrl: identity.pictureUrl,
				});
			}
			return existingUser._id;
		}

		// Create new user
		const userId = await ctx.db.insert("users", {
			tokenIdentifier: identity.tokenIdentifier,
			name: identity.name,
			email: identity.email,
			pictureUrl: identity.pictureUrl,
		});

		return userId;
	},
});

export const current = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return null;
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		return user;
	},
});

