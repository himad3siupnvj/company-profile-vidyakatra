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
            <h2 key={block.id} className="pt-5 text-center text-2xl font-bold leading-tight text-foreground md:text-3xl">
              {block.text}
            </h2>
          )
        }

        if (block.type === "heading") {
          return (
            <h3 key={block.id} className="pt-4 text-center text-xl font-semibold leading-snug text-foreground md:text-2xl">
              {block.text}
            </h3>
          )
        }

        if (block.type === "quote") {
          return (
            <blockquote key={block.id} className="rounded-r-xl border-l-4 border-primary bg-primary/5 py-4 pl-5 pr-4 text-lg font-medium leading-8 text-foreground/90 italic">
              {block.text}
            </blockquote>
          )
        }

        if (block.type === "list") {
          return (
            <ul key={block.id} className="list-disc space-y-2 pl-6 text-foreground/85 marker:text-primary">
              <li>{block.text}</li>
            </ul>
          )
        }

        if (block.type === "image") {
          return (
            <figure key={block.id} className="mx-auto max-w-2xl py-4">
              {block.url ? (
                <img src={block.url} alt={block.alt} className="mx-auto aspect-[16/10] w-full rounded-md border border-border/50 object-cover shadow-[0_14px_44px_rgba(0,0,0,0.2)]" />
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Image URL kosong
                </div>
              )}
              {block.caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{block.caption}</figcaption>}
            </figure>
          )
        }

        return <p key={block.id} className="text-justify text-[1.02rem] leading-8 text-foreground/80 md:text-lg md:leading-9">{block.text}</p>
      })}
    </div>
  )
}
