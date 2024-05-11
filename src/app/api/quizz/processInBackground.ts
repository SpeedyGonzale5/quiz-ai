import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {generateQuiz} from "./generate/generateQuiz";
import saveQuizz from "./generate/saveToDb";
import {NextResponse} from "next/server";


export async function processInBackground(document: Blob, jobId: string) {
  try {
    const pdfLoader = new PDFLoader(document as Blob, {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();
    const selectedDocuments = docs.filter(doc => doc.pageContent !== undefined);
    const texts = selectedDocuments.map(doc => doc.pageContent);

    // Assume the rest of the processing and quiz generation happens here
    const quiz = await generateQuiz(texts);

    // Store the result with the job ID
    await saveQuizz(jobId, quiz);
  } catch (e: any) {
       return NextResponse.json({ error: e.message }, { status: 500 });
      }
}

// import { PDFLoader } from "langchain/document_loaders/fs/pdf";

// export async function processInBackground(document: Blob, jobId: string) {
//   try {
//     const pdfLoader = new PDFLoader(document as Blob, {
//       parsedItemSeparator: " ",
//     });
//     const docs = await pdfLoader.load();
//     const selectedDocuments = docs.filter(doc => doc.pageContent !== undefined);
//     const texts = selectedDocuments.map(doc => doc.pageContent);

//     // Assume the rest of the processing and quiz generation happens here
//     const quiz = await generateQuiz(texts);

//     // Store the result with the job ID
//     await storeResult(jobId, quiz);
//   } catch (error) {
//     console.error('Error processing document:', error);
//     await storeError(jobId, error.message);
//   }
// }

// function generateQuiz(texts: string[]) {
//   throw new Error("Function not implemented.");
// }


// function storeResult(jobId: string, quiz: any) {
//   throw new Error("Function not implemented.");
// }


// function storeError(jobId: string, message: any) {
//   throw new Error("Function not implemented.");
// }

