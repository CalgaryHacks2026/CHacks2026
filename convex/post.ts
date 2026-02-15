import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const get_posts = query({
  args: {
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("posts").collect();
  }
});

export const create_post = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    set_of_user_tags: v.array(v.id("tags")),
    userId: v.id("users"),
  },
  handler: async (ctx, { title, description, set_of_user_tags, userId }) => {
    const now = Date.now();
    return await ctx.db.insert("posts", {
      title,
      description,
      creationDate: now,
      updatedDate: now,
      tags: set_of_user_tags,
      user: userId,
    });
  }
});


