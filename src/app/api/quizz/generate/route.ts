// import { NextRequest, NextResponse } from "next/server";

// import { ChatOpenAI } from "@langchain/openai";
// import { HumanMessage } from "@langchain/core/messages";

// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { JsonOutputFunctionsParser } from "langchain/output_parsers";

// import saveQuizz from "./saveToDb";
// import { extractTextFromPDF } from "./extractTextFromPdf";
// import { generateQuiz } from "./generateQuiz";
// import { processInBackground } from "../processInBackground";

//original file

// export async function POST(req: NextRequest) {
//   const body = await req.formData();
//   const document = body.get("pdf");

//   try {
//     const pdfLoader = new PDFLoader(document as Blob, {
//       parsedItemSeparator: " ",
//     });
//     const docs = await pdfLoader.load();

//     const selectedDocuments = docs.filter(
//       (doc) => doc.pageContent !== undefined
//     );
//     const texts = selectedDocuments.map((doc) => doc.pageContent);

//     const prompt =
//       "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quizz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

//     if (!process.env.OPENAI_API_KEY) {
//       return NextResponse.json(
//         { error: "OpenAI API key not provided" },
//         { status: 500 }
//       );
//     }

//     const model = new ChatOpenAI({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       modelName: "gpt-4-1106-preview",
//     });

//     const parser = new JsonOutputFunctionsParser();
//     const extractionFunctionSchema = {
//       name: "extractor",
//       description: "Extracts fields from the output",
//       parameters: {
//         type: "object",
//         properties: {
//           quizz: {
//             type: "object",
//             properties: {
//               name: { type: "string" },
//               description: { type: "string" },
//               questions: {
//                 type: "array",
//                 items: {
//                   type: "object",
//                   properties: {
//                     questionText: { type: "string" },
//                     answers: {
//                       type: "array",
//                       items: {
//                         type: "object",
//                         properties: {
//                           answerText: { type: "string" },
//                           isCorrect: { type: "boolean" },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     };

//     const runnable = model
//       .bind({
//         functions: [extractionFunctionSchema],
//         function_call: { name: "extractor" },
//       })
//       .pipe(parser);

//     const message = new HumanMessage({
//       content: [
//         {
//           type: "text",
//           text: prompt + "\n" + texts.join("\n"),
//         },
//       ],
//     });

//     const startTime = Date.now();
//     const result: any = await runnable.invoke([message]);
//     console.log(result)
//     const endTime = Date.now();
//     console.log(`Operation took ${endTime - startTime} milliseconds`);

//     const { quizzId } = await saveQuizz(result.quizz);

//     return NextResponse.json({ quizzId }, { status: 200 });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   const body = await req.formData();
//   const document = body.get("pdf");

//   try {
//     const texts = await extractTextFromPDF(document as Blob);
//     const result = await generateQuiz(texts);

//     console.log(result);

//     const { quizzId } = await saveQuizz(result.quizz);
//     return NextResponse.json({ quizzId }, { status: 200 });
//   } catch (e: any) {
//     console.error("Error processing request:", e);
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }


//Only sends a fileID, mos recent addition
// export async function POST(req: NextRequest) {
//   const body = await req.formData();
//   const document = body.get("pdf");

//   // Generate a unique job ID
//   const jobId = generateUniqueId();
//   if (document instanceof Blob) {
//     // Start the processing in the background
//     processInBackground(document, jobId);
//   } else {
//     console.error("Invalid document type: Expected a Blob.");
//     return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
//   }

//   // Immediately return the job ID to the client
//   return NextResponse.json({ jobId }, { status: 202 });
// }

// function generateUniqueId() {
//   return Math.random().toString(36).substring(2, 15);
// }

//from github

import { NextRequest, NextResponse } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

import saveQuizz from "./saveToDb";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const document = body.get("pdf");

  try {
    const pdfLoader = new PDFLoader(document as Blob, {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();

    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined
    );
    const texts = selectedDocuments.map((doc) => doc.pageContent);

    const prompt =
      "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quizz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not provided" },
        { status: 500 }
      );
    }

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4-1106-preview",
    });

    const parser = new JsonOutputFunctionsParser();
    const extractionFunctionSchema = {
      name: "extractor",
      description: "Extracts fields from the output",
      parameters: {
        type: "object",
        properties: {
          quizz: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    questionText: { type: "string" },
                    answers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          answerText: { type: "string" },
                          isCorrect: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: prompt + "\n" + texts.join("\n"),
        },
      ],
    });

    const result: any = await runnable.invoke([message]);
    console.log(result);

    const { quizzId } = await saveQuizz(result.quizz);

    return NextResponse.json({ quizzId }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}