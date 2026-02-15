import {mutation, query} from "./_generated/server"
import {v} from "convex/values"

export const get_posts = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.query("posts").collect();
  }
});

export const create_post = mutation({
  args: {
    _id: v.id("posts"),
    title: v.string(),
    description: v.string(),
    setOfUserTags: v.array(v.id("tags")),
    userId: v.id("users"),
    contentUrl: v.optional(v.string())
  },
  handler: async (ctx, {title, description, setOfUserTags, userId, contentUrl}) => {
    const now = Date.now();
    return await ctx.db.insert("posts", {
      title,
      description,
      creationDate: now,
      updatedDate: now,
      tags: setOfUserTags,
      user: userId,
      contentUrl
    });
  }
});

export const update_post = mutation({
  args: {
    _id: v.id("posts"),
    title: v.string(),
    description: v.string(),
    setOfUserTags: v.array(v.id("tags")),
    userId: v.id("users"),
    content_url: v.optional(v.string())
  },
  handler: async (ctx, {_id, title, description, setOfUserTags, content_url}) => {
    const existing = await ctx.db.get(_id);
    
    if (!existing) throw new Error("Post not found");

    await ctx.db.patch(_id, {
      ...(title !== undefined ? {title} : {}),
      ...(description !== undefined ? {description} : {}),
      ...(setOfUserTags !== undefined ? {tags: setOfUserTags} : {}),
      ...(content_url !== undefined ? {content_url} : {}),
      updatedDate: Date.now(),
    });
    return _id;
  }
}); 
