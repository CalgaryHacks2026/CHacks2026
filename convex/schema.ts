import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    description: v.string(),
    creationDate: v.number(),
    updatedDate: v.number(),
    tags: v.array(v.id("tags")),
    user: v.id("users"),
    storageId: v.optional(v.id("_storage")),
    year: v.number()
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  tags: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
});
