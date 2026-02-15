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

export const seed_tags = mutation({
  args: {},
  handler: async (ctx) => {
    const tags = [
      // Historical Events & Eras
      "ww1",
      "ww2",
      "cold war",
      "renaissance",
      "industrial revolution",
      "roman empire",
      "islamic empire",
      "viking age",
      "medieval",
      "ancient greece",
      "civil rights movement",
      "space race",
      "great depression",
      "french revolution",
      "american revolution",
      // Countries & Regions
      "germany",
      "japan",
      "usa",
      "china",
      "russia",
      "egypt",
      "india",
      "brazil",
      "middle east",
      "europe",
      "africa",
      "southeast asia",
      // Technology & Companies
      "ibm",
      "apple",
      "microsoft",
      "nasa",
      "tesla",
      "ford",
      "boeing",
      "sony",
      "kodak",
      "polaroid",
      // Transportation
      "cars",
      "planes",
      "trains",
      "ships",
      "motorcycles",
      "bicycles",
      "rockets",
      // Consumer Brands
      "coca cola",
      "pepsi",
      "mcdonalds",
      "nike",
      "levis",
      "disney",
      // Arts & Culture
      "music",
      "cinema",
      "photography",
      "painting",
      "sculpture",
      "architecture",
      "fashion",
      "literature",
      // People Categories
      "family",
      "friends",
      "celebrities",
      "politicians",
      "athletes",
      "musicians",
      "scientists",
      // Nature & Environment
      "nature",
      "wildlife",
      "ocean",
      "mountains",
      "forests",
      "deserts",
      // Life Events
      "wedding",
      "birthday",
      "graduation",
      "vacation",
      "holiday",
      "celebration",
      // Miscellaneous
      "sports",
      "food",
      "military",
      "education",
      "religion",
      "politics",
      "science",
      "medicine",
    ];

    const existingTags = await ctx.db.query("tags").collect();
    const existingNames = new Set(existingTags.map((t) => t.name));

    const insertedTags = [];
    for (const name of tags) {
      if (!existingNames.has(name)) {
        const id = await ctx.db.insert("tags", { name });
        insertedTags.push({ id, name });
      }
    }

    return { inserted: insertedTags.length, total: tags.length };
  },
});
