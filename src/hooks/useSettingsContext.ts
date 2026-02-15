export function useSettingsContext() {
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === "true";

  return { isDebug };
}
