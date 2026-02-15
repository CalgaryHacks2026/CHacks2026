import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generate_upload_url = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create_post = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    setOfUserTags: v.array(v.id("tags")),
    storageId: v.id("_storage"),
    year: v.number(), // ✅ add

  },
  handler: async (ctx, { title, description, setOfUserTags, storageId, year }) => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("Not authorized");
    }

    return await ctx.db.insert("posts", {
      title,
      description,
      creationDate: now,
      updatedDate: now,
      tags: setOfUserTags,
      user: user._id,
      storageId,
      year
    });
  },
});

export const update_post = mutation({
  args: {
    _id: v.id("posts"),
    title: v.string(),
    description: v.string(),
    setOfUserTags: v.array(v.id("tags")),
    userId: v.id("users"),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (
    ctx,
    { _id, title, description, setOfUserTags, storageId },
  ) => {
    const existing = await ctx.db.get(_id);

    if (!existing) throw new Error("Post not found");

    await ctx.db.patch(_id, {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(setOfUserTags !== undefined ? { tags: setOfUserTags } : {}),
      ...(storageId !== undefined ? { storageId } : {}),
      updatedDate: Date.now(),
    });
    return _id;
  },
});

export const search_posts = mutation({
  args: {
    query: v.string(),
    year: v.number(),
    tags: v.record(v.string(), v.number()),
  },
  handler: async (ctx, { query, year, tags }) => {
    // tags comes in as { tagName: weight, ... }
    // We need to convert tag names to tag IDs
    const tagNames = Object.keys(tags);

    // Look up tag IDs from tag names
    const tagIdToWeight: Record<string, number> = {};
    for (const tagName of tagNames) {
      const tag = await ctx.db
        .query("tags")
        .withIndex("by_name", (q) => q.eq("name", tagName))
        .unique();
      if (tag) {
        tagIdToWeight[tag._id] = tags[tagName];
      }
    }

    const allPosts = await ctx.db.query("posts").collect();

    // Helper function to get year proximity score (0 = exact match, 1 = ±1 year, 2 = ±2 years)
    const getYearProximity = (postYear: number | undefined): number | null => {
      if (postYear === undefined) return null;
      const diff = Math.abs(postYear - year);
      if (diff <= 2) return diff;
      return null; // Outside ±2 year range
    };

    // Filter posts that:
    // 1. Have at least one matching tag
    // 2. Are within ±2 years of the provided year
    const matching = allPosts.filter((post) => {
      const hasMatchingTag = post.tags.some((tagId) => tagIdToWeight[tagId] !== undefined);
      const yearProximity = getYearProximity(post.year);
      return hasMatchingTag && yearProximity !== null;
    });

    // Sort by:
    // 1. Year proximity (exact year first, then ±1, then ±2)
    // 2. Tag weight score (as tiebreaker within same year proximity)
    matching.sort((a, b) => {
      const yearProximityA = getYearProximity(a.year) ?? 3;
      const yearProximityB = getYearProximity(b.year) ?? 3;

      // First, sort by year proximity (lower is better)
      if (yearProximityA !== yearProximityB) {
        return yearProximityA - yearProximityB;
      }

      // Then, sort by tag weight score (higher is better)
      const scoreA = Math.max(...a.tags.map((t) => tagIdToWeight[t] ?? 0), 0);
      const scoreB = Math.max(...b.tags.map((t) => tagIdToWeight[t] ?? 0), 0);
      return scoreB - scoreA;
    });

    return Promise.all(
      matching.map(async (post) => ({
        ...post,
        url: post.storageId ? await ctx.storage.getUrl(post.storageId) : null,
      })),
    );
  },
});


export const get_post_for_user = query({
  args: {},
  handler: async (ctx, args) => {
    const loggedInUser = await ctx.auth.getUserIdentity();
    if (!loggedInUser) {
      throw new Error("Not authorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", loggedInUser.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("Not authorized");
    }

    const posts = await ctx.db.query("posts").collect();
    const userPosts = posts.filter((post) => post.user === user._id);

    // Return posts with URLs
    return Promise.all(
      userPosts.map(async (post) => ({
        ...post,
        url: post.storageId ? await ctx.storage.getUrl(post.storageId) : null,
      })),
    );
  },
});

export const postsByWeightedTagsFromHttp: ReturnType<typeof action> = action({  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
      // const res = await fetch("https://your-secondary-server/tags");
      // const tags = (await res.json()) as Record<string, number>;
      // TODO: implement in relation to python ai server code
      const tags = {
        cars: 1.0,
        trucks: 0.9,
        "1970s": 0.8,
        american: 0.7,
        classic: 0.6,
        "muscle car": 0.5,
      } as Record<string, number>;

      // Call the mutation from the action
      const posts = await ctx.runMutation(api.post.search_posts, {
        query: args.query,
        year: 0,
        tags,
      });
      return posts;
    },
});

// Helper query to get a URL for a specific storage ID
export const get_file_url = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
