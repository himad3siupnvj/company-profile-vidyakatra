import type { ArticleDocument } from "@/lib/article-content"

type ArticleDocumentRendererProps = {
  document: ArticleDocument
}

export function ArticleDocumentRenderer({ document }: ArticleDocumentRendererProps) {
  return (
    <div className="space-y-6">
      {document.content.map((block) => {
        if (block.type === "heading" && block.level === 1) {
          return (
            <h2 key={block.id} className="pt-4 text-2xl font-bold leading-tight text-foreground">
              {block.text}
            </h2>
          )
        }

        if (block.type === "heading") {
          return (
            <h3 key={block.id} className="pt-3 text-xl font-semibold leading-tight text-foreground">
              {block.text}
            </h3>
          )
        }

        if (block.type === "quote") {
          return (
            <blockquote key={block.id} className="border-l-4 border-primary pl-5 text-foreground/90 italic">
              {block.text}
            </blockquote>
          )
        }

        if (block.type === "list") {
          return (
            <ul key={block.id} className="list-disc pl-6">
              <li>{block.text}</li>
            </ul>
          )
        }

        if (block.type === "image") {
          return (
            <figure key={block.id} className="py-2">
              {block.url ? (
                <img src={block.url} alt={block.alt} className="aspect-[16/10] w-full rounded-xl object-cover" />
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Image URL kosong
                </div>
              )}
              {block.caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{block.caption}</figcaption>}
            </figure>
          )
        }

        return <p key={block.id}>{block.text}</p>
      })}
    </div>
  )
}
