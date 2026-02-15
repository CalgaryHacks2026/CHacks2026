"use client";

import { useState, useEffect, ReactNode } from "react";
import { Doc } from "../../convex/_generated/dataModel";

export const ContentItem = ({
  post,
  openDetailedModalAction,
  isSkeleton = false,
  index = 0,
}: {
  post?: Doc<"posts">;
  openDetailedModalAction?: (p: Doc<"posts">) => void;
  isSkeleton?: boolean;
  index?: number;
}) => {
  if (isSkeleton) {
    // Softer pastel colors for skeleton loading
    const pastelColors = [
      "bg-blue-950",
      "bg-pink-950",
      "bg-emerald-950",
      "bg-amber-950",
      "bg-violet-950",
      "bg-rose-950",
      "bg-cyan-950",
      "bg-lime-950",
    ];
    const colorClass = pastelColors[index % pastelColors.length];

    return (
      <div
        className={`h-full w-full rounded-xl ${colorClass} animate-pulse`}
        style={{
          animationDelay: `${index * 0.1}s`,
        }}
      />
    );
  }

  return (
    <>
      <button
        key={post?._id}
        className="bg-card h-full w-full border hover:shadow-2xl hover:scale-125 transition-all duration-300 ease-out cursor-pointer hover:before:opacity-65 relative hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:w-full hover:before:h-full z-0 hover:z-50 group-hover:saturate-0 group-hover:hover:saturate-100!"
        style={{
          backgroundImage: post?.url ? `url(${post.url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </>
  );
};
