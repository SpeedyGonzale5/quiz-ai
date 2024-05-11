// import { PDFLoader } from "langchain/document_loaders/fs/pdf";

// export async function extractTextFromPDF(document: Blob): Promise<string[]> {
//     const pdfLoader = new PDFLoader(document as Blob, { parsedItemSeparator: " " });
//     try {
//         const docs = await pdfLoader.load();
//         const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined);
//         return selectedDocuments.map((doc) => doc.pageContent);
//     } catch (error) {
//         console.error("Failed to extract text from PDF:", error);
//         throw error; // Rethrow after logging
//     }
//   }