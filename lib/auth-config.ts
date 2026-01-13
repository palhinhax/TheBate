/**
 * Configuration for authentication requirements
 * Used to control whether users must be logged in to interact (vote, comment)
 */

/**
 * Check if authentication is required for interactions (voting, commenting)
 * Controlled by NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS environment variable
 * Defaults to false (auth not required) for initial phase
 */
export function requireAuthForInteractions(): boolean {
  const envValue = process.env.NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS;

  // Default to false if not set (allow anonymous interactions)
  if (envValue === undefined || envValue === null || envValue === "") {
    return false;
  }

  return envValue.toLowerCase() === "true";
}

/**
 * Generate an anonymous user identifier from browser fingerprint
 * Used for client-side tracking of anonymous votes/comments
 */
export function generateAnonymousId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  // Check if we already have an ID stored
  const existing = localStorage.getItem("anonymous_user_id");
  if (existing) {
    return existing;
  }

  // Generate new ID using browser fingerprint
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + "x" + screen.height,
  ].join("|");

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const anonymousId = `anon_${Math.abs(hash)}_${Date.now()}`;
  localStorage.setItem("anonymous_user_id", anonymousId);

  return anonymousId;
}

/**
 * Store a vote in localStorage to prevent duplicate voting
 */
export function storeAnonymousVote(topicId: string, vote: string | string[]): void {
  if (typeof window === "undefined") return;

  const key = `vote_${topicId}`;
  localStorage.setItem(key, JSON.stringify(vote));
}

/**
 * Get stored vote from localStorage
 */
export function getAnonymousVote(topicId: string): string | string[] | null {
  if (typeof window === "undefined") return null;

  const key = `vote_${topicId}`;
  const stored = localStorage.getItem(key);

  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Remove a vote from localStorage
 */
export function removeAnonymousVote(topicId: string): void {
  if (typeof window === "undefined") return;

  const key = `vote_${topicId}`;
  localStorage.removeItem(key);
}
