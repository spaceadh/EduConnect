import React from "react";
import {GoogleGenerativeAI} from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyBgWiIo1jG67broYNEw7Umi5H4XYiYJpx8');

export async function triggerAnswers(message){
    const generationConfig = {
        stopSequences: ["red"],
        maxOutputTokens:300,
        temperature:0.9,
        topP:0.1,
        topK:16,
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' },generationConfig);

    const result = await model.generateContent(message);
    const response = await result.response;
    console.log("Response :",response);
    const text = await response.text();
    return text;

}