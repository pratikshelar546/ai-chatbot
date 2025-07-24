import express from "express"
import fs from "fs";
const app = express();
const port = 5001;
import path from "path";
import PdfParse from "pdf-parse";
import ollama from "ollama"
import { QdrantClient } from "@qdrant/js-client-rest";
import axios from "axios"

const client = new QdrantClient({
    url: "http://localhost:6333"
});

const createCollection = async () => {
    const collecttion = client.createCollection('chatbot', {
        vectors: {
            size: 768,
            distance: "Cosine"
        }
    })
    console.log(collecttion);

}
// console.log(createCollection);
// createCollection();

const readFromPdf = async () => {
    try {
        const pdfData = fs.readFileSync(__dirname + "/doc/learn.pdf");
        const pdfParse = await PdfParse(pdfData);

        const sentences = pdfParse.text.split(/(?<=[.?!])\s+/);
        const chunks: string[] = [];
        let current = '';

        for (const sentence of sentences) {
            if ((current + sentence).length < 500) {
                current += sentence + ' ';
            } else {
                chunks.push(current.trim());
                current = sentence + ' ';
            }
        }

        if (current.length > 0) {
            chunks.push(current.trim());
        }

        console.log(chunks);

        const points = await Promise.all(chunks.map(async (chunk, index) => {
            const embediing = await ollama.embeddings({
                model: "nomic-embed-text",
                prompt: chunk
            })

            return {
                id: index,
                vector: embediing.embedding,
                payload: {
                    text: chunk,
                    source: "learn.pdf"
                }
            }
        }));

        const addData = await client.upsert('chatbot', {
            wait: true,
            points
        })

        console.log(addData, "aded data");

    } catch (error) {
        console.log(error);

    }
}

const questionAnswer = async (question: string) => {
    const embeddedQuestion = await ollama.embeddings({
        model: "nomic-embed-text",
        prompt: question
    });

    const searchReleventText = await client.search('chatbot', {
        vector: embeddedQuestion.embedding,
        limit: 10,
        score_threshold: 0.7
    })

    console.log(searchReleventText);

    const context = searchReleventText
        .map((result) => result.payload?.text || result.payload?.pdf || "")
        .join("\n");

    const finalPrompt = `you have to answer in humanize way Using the following context:\n${context}\n\nAnswer the question:${question}`;
    console.log("prompt is ready");
    console.log("asking to llm");
    // console.log(context);


    const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt: finalPrompt,
        stream: false,
    });
    console.log("repose is there -------------------------------------------");

    console.log("Answer:", response.data.response);
}
// readFromPdf()
questionAnswer("what is react")

app.listen(port, () => {
    console.info("sever is running on ", port)
})