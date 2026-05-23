import "react"

declare module "react" {
  interface IframeHTMLAttributes<T> {
    src?: string | undefined
  }
}
