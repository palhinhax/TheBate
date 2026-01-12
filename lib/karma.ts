import { prisma } from "./prisma";

/**
 * Karma point values for different actions
 */
export const KARMA_POINTS = {
  CREATE_TOPIC: 10,
  CREATE_COMMENT: 5,
  VOTE_ON_TOPIC: 2,
  RECEIVE_COMMENT_VOTE: 1,
  RECEIVE_TOPIC_VOTE: 2,
} as const;

/**
 * Award karma points to a user
 */
export async function awardKarma(userId: string, points: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      karma: {
        increment: points,
      },
    },
  });
}

/**
 * Check and unlock achievements for a user
 */
export async function checkAchievements(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      topics: true,
      comments: true,
      topicVotes: true,
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  });

  if (!user) return;

  // Get all achievements
  const allAchievements = await prisma.achievement.findMany();

  // Get already unlocked achievement keys
  const unlockedKeys = new Set(user.achievements.map((ua) => ua.achievement.key));

  // Check each achievement
  for (const achievement of allAchievements) {
    // Skip if already unlocked
    if (unlockedKeys.has(achievement.key)) continue;

    let shouldUnlock = false;

    switch (achievement.key) {
      case "first_vote":
        shouldUnlock = user.topicVotes.length >= 1;
        break;
      case "active_voter":
        shouldUnlock = user.topicVotes.length >= 10;
        break;
      case "voting_enthusiast":
        shouldUnlock = user.topicVotes.length >= 50;
        break;
      case "debate_starter":
        shouldUnlock = user.topics.length >= 1;
        break;
      case "topic_creator":
        shouldUnlock = user.topics.length >= 5;
        break;
      case "debate_master":
        shouldUnlock = user.topics.length >= 20;
        break;
      case "first_comment":
        shouldUnlock = user.comments.length >= 1;
        break;
      case "active_commenter":
        shouldUnlock = user.comments.length >= 10;
        break;
      case "discussion_expert":
        shouldUnlock = user.comments.length >= 50;
        break;
      case "discussion_master":
        shouldUnlock = user.comments.length >= 100;
        break;
      case "karma_100":
        shouldUnlock = user.karma >= 100;
        break;
      case "karma_500":
        shouldUnlock = user.karma >= 500;
        break;
      case "karma_1000":
        shouldUnlock = user.karma >= 1000;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: achievement.id,
        },
      });
    }
  }
}
