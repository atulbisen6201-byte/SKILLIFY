declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }
  function pdfParse(dataBuffer: Buffer, options?: any): Promise<PDFData>;
  export = pdfParse;
}

declare module 'mammoth' {
  export interface Result {
    value: string;
    messages: any[];
  }
  export function extractRawText(options: { buffer: Buffer }): Promise<Result>;
}
