import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get_tags = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

export const create_tag = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    return await ctx.db.insert("tags", { name });
  },
});
