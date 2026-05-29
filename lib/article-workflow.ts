export const articleStatuses = ["draft", "submitted", "approved", "rejected", "published", "archived"] as const

export type ArticleStatus = (typeof articleStatuses)[number]

export const articleWorkflowActions = ["submit", "approve", "reject", "archive", "restore"] as const

export type ArticleWorkflowAction = (typeof articleWorkflowActions)[number]

export const articleWorkflowPermissions: Record<ArticleWorkflowAction, "article.submit" | "article.approve" | "article.reject" | "article.archive" | "article.restore"> = {
  submit: "article.submit",
  approve: "article.approve",
  reject: "article.reject",
  archive: "article.archive",
  restore: "article.restore",
}

const allowedActions: Record<ArticleStatus, readonly ArticleWorkflowAction[]> = {
  draft: ["submit"],
  submitted: ["approve", "reject"],
  approved: ["archive"],
  rejected: ["submit", "archive"],
  published: ["archive"],
  archived: ["restore"],
}

export function getArticleWorkflowActions(status: ArticleStatus) {
  return allowedActions[status] ?? []
}

export function canTransitionArticle(status: ArticleStatus, action: ArticleWorkflowAction) {
  return getArticleWorkflowActions(status).includes(action)
}

export function getNextArticleStatus(action: ArticleWorkflowAction): ArticleStatus {
  if (action === "submit") return "submitted"
  if (action === "approve") return "published"
  if (action === "reject") return "rejected"
  if (action === "archive") return "archived"

  return "draft"
}

export function isArticleWorkflowAction(value: unknown): value is ArticleWorkflowAction {
  return typeof value === "string" && articleWorkflowActions.includes(value as ArticleWorkflowAction)
}
