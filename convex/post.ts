import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getPosts = query({
  args: {
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("posts").collect();
  }
});
