import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import {action, mutation, query} from "./_generated/server"
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

export const search_posts = query({
  args: {
    query: v.string(),
    tags: v.record(v.id("tags"), v.number()),
  },
  handler: async (ctx, { query, tags }) => {
    const weights = tags
    const allPosts = await ctx.db.query("posts").collect();
    // TODO: implement in relation to python ai server code
    const matching = allPosts.filter(post =>
      post.tags.some(tag => weights[tag] !== undefined),
    );

    matching.sort((a, b) => {
      const scoreA = Math.max(...a.tags.map(t => weights[t] ?? 0), 0);
      const scoreB = Math.max(...b.tags.map(t => weights[t] ?? 0), 0);
      return scoreB - scoreA;
    });

    return matching;
  }
});


export const postsByWeightedTagsFromHttp = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    // const res = await fetch("https://your-secondary-server/tags");
    // const tags = (await res.json()) as Record<string, number>;
    // TODO: implement in relation to python ai server code
    const tags = {
      "cars": 1.0,
      "trucks": 0.9,
      "1970s": 0.8,
      "american": 0.7,
      "classic": 0.6,
      "muscle car": 0.5,
      } as Record<string, number>;

    // Call the query from the action
    const posts: Doc<"posts">[] = await ctx.runQuery(api.post.search_posts, { query: args.query, tags })
    return posts;
  },
});
