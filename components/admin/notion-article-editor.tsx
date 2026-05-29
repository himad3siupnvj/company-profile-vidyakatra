"use client"

import { useMemo, useState } from "react"
import { Eye, Heading1, Heading2, ImagePlus, List, Pilcrow, Plus, Quote, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type ArticleBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level: 1 | 2; text: string }
  | { id: string; type: "quote"; text: string }
  | { id: string; type: "list"; text: string }
  | { id: string; type: "image"; url: string; alt: string; caption: string }

export type ArticleDocument = {
  type: "doc"
  content: ArticleBlock[]
}

const commands = [
  { type: "paragraph", label: "Text", description: "Paragraf biasa", icon: Pilcrow },
  { type: "heading-1", label: "Heading 1", description: "Judul section besar", icon: Heading1 },
  { type: "heading-2", label: "Heading 2", description: "Subjudul", icon: Heading2 },
  { type: "quote", label: "Quote", description: "Kutipan atau highlight", icon: Quote },
  { type: "list", label: "List", description: "Bullet point", icon: List },
  { type: "image", label: "Image", description: "Gambar di tengah artikel", icon: ImagePlus },
]

function createBlock(type: string): ArticleBlock {
  const id = crypto.randomUUID()

  if (type === "heading-1") return { id, type: "heading", level: 1, text: "" }
  if (type === "heading-2") return { id, type: "heading", level: 2, text: "" }
  if (type === "quote") return { id, type: "quote", text: "" }
  if (type === "list") return { id, type: "list", text: "" }
  if (type === "image") return { id, type: "image", url: "", alt: "", caption: "" }

  return { id, type: "paragraph", text: "" }
}

const initialBlocks: ArticleBlock[] = [
  { id: "intro", type: "paragraph", text: "" },
]

type NotionArticleEditorProps = {
  value: ArticleDocument
  onChange: (value: ArticleDocument) => void
}

export function createEmptyArticleDocument(): ArticleDocument {
  return { type: "doc", content: initialBlocks }
}

export function NotionArticleEditor({ value, onChange }: NotionArticleEditorProps) {
  const [slashBlockId, setSlashBlockId] = useState<string | null>(null)
  const [mode, setMode] = useState<"edit" | "preview">("edit")

  const blocks = value.content.length ? value.content : initialBlocks

  const updateBlocks = (nextBlocks: ArticleBlock[]) => {
    onChange({ type: "doc", content: nextBlocks })
  }

  const updateBlock = (id: string, patch: Partial<ArticleBlock>) => {
    updateBlocks(blocks.map((block) => (block.id === id ? ({ ...block, ...patch } as ArticleBlock) : block)))
  }

  const addBlockAfter = (id: string, type = "paragraph") => {
    const index = blocks.findIndex((block) => block.id === id)
    const nextBlocks = [...blocks]
    nextBlocks.splice(index + 1, 0, createBlock(type))
    updateBlocks(nextBlocks)
  }

  const replaceBlock = (id: string, type: string) => {
    updateBlocks(blocks.map((block) => (block.id === id ? createBlock(type) : block)))
    setSlashBlockId(null)
  }

  const renderedPreview = useMemo(() => blocks.filter((block) => block.type !== "paragraph" || block.text.trim()), [blocks])

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Type className="h-4 w-4" />
          <span>Article body</span>
        </div>
        <div className="flex rounded-md bg-muted p-0.5">
          <Button
            type="button"
            size="sm"
            variant={mode === "edit" ? "secondary" : "ghost"}
            className="h-7 gap-1.5 px-2 text-xs"
            onClick={() => setMode("edit")}
          >
            <Type className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "preview" ? "secondary" : "ghost"}
            className="h-7 gap-1.5 px-2 text-xs"
            onClick={() => setMode("preview")}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
        </div>
      </div>

      {mode === "edit" ? (
        <div className="min-h-[420px] px-8 py-8">
          <div className="mx-auto max-w-3xl space-y-1">
          {blocks.map((block) => (
            <div key={block.id} className="group relative rounded-md px-2 py-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -left-9 top-1 hidden h-7 w-7 text-muted-foreground group-hover:flex"
                onClick={() => addBlockAfter(block.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>

              {block.type === "image" ? (
                <div className="my-4 space-y-2 rounded-lg border border-dashed bg-muted/20 p-4">
                  <Input
                    value={block.url}
                    onChange={(event) => updateBlock(block.id, { url: event.target.value })}
                    placeholder="Paste image URL dari storage..."
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      value={block.alt}
                      onChange={(event) => updateBlock(block.id, { alt: event.target.value })}
                      placeholder="Alt text"
                    />
                    <Input
                      value={block.caption}
                      onChange={(event) => updateBlock(block.id, { caption: event.target.value })}
                      placeholder="Caption"
                    />
                  </div>
                </div>
              ) : (
                <Textarea
                  value={block.text}
                  onChange={(event) => {
                    updateBlock(block.id, { text: event.target.value } as Partial<ArticleBlock>)
                    setSlashBlockId(event.target.value.trim() === "/" ? block.id : null)
                  }}
                  placeholder={blocks.length === 1 && !block.text ? "Ketik / untuk command..." : ""}
                  rows={block.type === "heading" ? 1 : 2}
                  className={cn(
                    "min-h-0 resize-none overflow-hidden border-0 bg-transparent px-0 py-1 shadow-none focus-visible:ring-0",
                    block.type === "paragraph" && "text-base leading-7",
                    block.type === "heading" && block.level === 1 && "text-3xl font-bold leading-tight",
                    block.type === "heading" && block.level === 2 && "text-2xl font-semibold leading-tight",
                    block.type === "quote" && "border-l-2 border-primary pl-3 italic",
                    block.type === "list" && "pl-5",
                  )}
                />
              )}

              {slashBlockId === block.id && (
                <div className="absolute left-2 top-full z-20 w-72 rounded-lg border bg-popover p-1 shadow-xl">
                  {commands.map((command) => (
                    <button
                      key={command.type}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => replaceBlock(block.id, command.type)}
                    >
                      <command.icon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <span className="block font-medium">{command.label}</span>
                        <span className="text-xs text-muted-foreground">{command.description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
            <button
              type="button"
              className="mt-2 flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground opacity-0 transition-opacity hover:bg-muted/40 hover:text-foreground group-hover:opacity-100"
              onClick={() => updateBlocks([...blocks, createBlock("paragraph")])}
            >
              <Plus className="h-4 w-4" />
              Add block
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-[420px] px-8 py-8">
          <article className="prose prose-invert mx-auto max-w-3xl">
          {renderedPreview.length ? (
            renderedPreview.map((block) => {
              if (block.type === "heading" && block.level === 1) return <h1 key={block.id}>{block.text}</h1>
              if (block.type === "heading") return <h2 key={block.id}>{block.text}</h2>
              if (block.type === "quote") return <blockquote key={block.id}>{block.text}</blockquote>
              if (block.type === "list") return <li key={block.id}>{block.text}</li>
              if (block.type === "image") {
                return (
                  <figure key={block.id}>
                    {block.url ? <img src={block.url} alt={block.alt} className="rounded-lg" /> : <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Image URL kosong</div>}
                    {block.caption && <figcaption>{block.caption}</figcaption>}
                  </figure>
                )
              }

              return <p key={block.id}>{block.text}</p>
            })
          ) : (
            <p className="text-muted-foreground">Preview artikel akan muncul di sini.</p>
          )}
        </article>
        </div>
      )}
    </div>
  )
}
