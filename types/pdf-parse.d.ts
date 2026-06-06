declare module "pdf-parse" {
  export type PdfPage = {
    getTextContent(options?: {
      normalizeWhitespace?: boolean
      disableCombineTextItems?: boolean
    }): Promise<{
      items: Array<{
        str: string
        transform: number[]
      }>
    }>
    getOperatorList(): Promise<{
      fnArray: number[]
      argsArray: unknown[][]
    }>
    objs: {
      objs?: Record<
        string,
        {
          data?: unknown
          resolved?: boolean
        }
      >
      get(id: string, callback?: (value: unknown) => void): unknown
    }
  }

  type PdfParseOptions = {
    max?: number
    version?: string
    pagerender?: (page: PdfPage) => Promise<string>
  }

  type PdfParseResult = {
    numpages: number
    numrender: number
    info: Record<string, unknown>
    metadata: unknown
    text: string
    version: string
  }

  function pdfParse(data: Buffer | Uint8Array, options?: PdfParseOptions): Promise<PdfParseResult>

  export default pdfParse
}
