import { describe, expect, it } from "vitest"
import {
  articleWorkflowPermissions,
  canTransitionArticle,
  getArticleWorkflowActions,
  getNextArticleStatus,
  isArticleWorkflowAction,
} from "@/lib/article-workflow"

describe("article workflow", () => {
  it("exposes only valid actions for each status", () => {
    expect(getArticleWorkflowActions("draft")).toEqual(["submit"])
    expect(getArticleWorkflowActions("submitted")).toEqual(["approve", "reject"])
    expect(getArticleWorkflowActions("approved")).toEqual(["archive"])
    expect(getArticleWorkflowActions("rejected")).toEqual(["submit", "archive"])
    expect(getArticleWorkflowActions("published")).toEqual(["archive"])
    expect(getArticleWorkflowActions("archived")).toEqual(["restore"])
  })

  it("blocks invalid transitions", () => {
    expect(canTransitionArticle("draft", "submit")).toBe(true)
    expect(canTransitionArticle("draft", "approve")).toBe(false)
    expect(canTransitionArticle("published", "reject")).toBe(false)
    expect(canTransitionArticle("archived", "restore")).toBe(true)
  })

  it("maps workflow actions to next statuses", () => {
    expect(getNextArticleStatus("submit")).toBe("submitted")
    expect(getNextArticleStatus("approve")).toBe("published")
    expect(getNextArticleStatus("reject")).toBe("rejected")
    expect(getNextArticleStatus("archive")).toBe("archived")
    expect(getNextArticleStatus("restore")).toBe("draft")
  })

  it("uses dedicated permissions for each mutation", () => {
    expect(articleWorkflowPermissions).toEqual({
      submit: "article.submit",
      approve: "article.approve",
      reject: "article.reject",
      archive: "article.archive",
      restore: "article.restore",
    })
  })

  it("validates workflow action input", () => {
    expect(isArticleWorkflowAction("submit")).toBe(true)
    expect(isArticleWorkflowAction("publish")).toBe(false)
    expect(isArticleWorkflowAction(null)).toBe(false)
  })
})
