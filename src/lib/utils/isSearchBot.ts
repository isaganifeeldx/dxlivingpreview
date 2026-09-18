/**
 * Detect common search / SEO crawlers from a User-Agent string.
 * Used to skip intro video and preload gates so bots see page content immediately.
 */
const SEARCH_BOT_UA =
  /googlebot|google-inspectiontool|bingbot|bingpreview|slurp|duckduckbot|baiduspider|yandex(bot|imageserver)?|facebookexternalhit|facebot|twitterbot|linkedinbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|anthropic-ai|perplexitybot|ia_archiver|screaming frog|chrome-lighthouse|pagespeed/i;

export const isSearchBot = (userAgent: string | null | undefined): boolean => {
  if (!userAgent) return false;
  return SEARCH_BOT_UA.test(userAgent);
};
