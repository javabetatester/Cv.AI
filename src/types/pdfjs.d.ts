declare module 'pdfjs-dist' {
  export interface GlobalWorkerOptions {
    workerSrc: string;
  }

  export const GlobalWorkerOptions: GlobalWorkerOptions;

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }

  export interface TextContent {
    items: Array<{
      str: string;
      dir: string;
      width: number;
      height: number;
      transform: number[];
      fontName: string;
    }>;
  }

  export interface DocumentInitParameters {
    data: ArrayBuffer | Uint8Array;
    url?: string;
    httpHeaders?: Record<string, string>;
    withCredentials?: boolean;
  }

  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  export function getDocument(src: DocumentInitParameters): PDFDocumentLoadingTask;
}