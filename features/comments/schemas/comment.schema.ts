import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "O comentário não pode estar vazio")
    .max(3000, "O comentário não pode ter mais de 3000 caracteres"),
  topicId: z.string(),
  parentId: z.string().optional(),
});

export const voteSchema = z.object({
  commentId: z.string(),
  value: z.number().int().min(-1).max(1),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "O comentário não pode estar vazio")
    .max(3000, "O comentário não pode ter mais de 3000 caracteres"),
});

export const moderateCommentSchema = z.object({
  status: z.enum(["ACTIVE", "HIDDEN", "DELETED"]),
});

export type CommentFormData = z.infer<typeof commentSchema>;
export type VoteData = z.infer<typeof voteSchema>;
export type UpdateCommentData = z.infer<typeof updateCommentSchema>;
export type ModerateCommentData = z.infer<typeof moderateCommentSchema>;
