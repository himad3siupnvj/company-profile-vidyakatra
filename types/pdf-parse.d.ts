declare module "pdf-parse" {
  type PdfParseResult = {
    numpages: number
    numrender: number
    info: Record<string, unknown>
    metadata: unknown
    text: string
    version: string
  }

  function pdfParse(data: Buffer | Uint8Array): Promise<PdfParseResult>

  export default pdfParse
}
