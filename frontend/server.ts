    // // Importing required modules
    // import express from 'express';
    // import cors from 'cors';
    // import axios from 'axios';
    // import fs from 'fs';
    // import path from 'path';
    // import dotenv from 'dotenv';
    // import { GoogleGenerativeAI } from '@google/generative-ai';

    // // Initializing environment variables
    // dotenv.config();

    // const PORT = 8000;
    // const app = express();
    // app.use(cors());
    // app.use(express.json());

    // // Ensuring the environment variable is treated as a string
    // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY!);

    // // Declaring the VOICE_ID variable
    // const VOICE_ID = 'hFgOzpmS0CMtL2to8sAl';  // Ensure this is the correct ID or fetched appropriately

    // app.post("/gemini", async (req: express.Request, res: express.Response) => {
    //     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    //     const chatHistory = req.body.history.map((item: any) => ({
    //         role: item.role,
    //         parts: item.parts.map((part: string) => ({ text: part })),
    //     }));

    //     const chat = model.startChat({
    //         history: chatHistory,
    //     });

    //     const msg = req.body.message;

    //     try {
    //         const result = await chat.sendMessage(msg);
    //         const response = await result.response;
    //         let text = await response.text();

    //         text = text.replace(/Gemini/g, "Cardes AI");
    //         text = text
    //             .split("\n")
    //             .map((sentence) => sentence + "\t")
    //             .join("\n");

    //         res.send(text);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("Error processing the request");
    //     }
    // });

    // app.post('/text-to-speech', async (req: express.Request, res: express.Response) => {
    //     const text = req.body.text;
    //     const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    //     const headers = {
    //         'xi-api-key': process.env.API_KEY!,
    //         'Content-Type': 'application/json',
    //         'Accept': 'audio/mpeg'
    //     };
    //     const data = {
    //         text: text,
    //         model_id: 'eleven_multilingual_v2',
    //         voice_settings: {
    //             stability: 0.5,
    //             similarity_boost: 0.5
    //         },
    //         languages: [
    //             {
    //                 language_id: "fr-FR",
    //                 name: "French Voiceover"
    //             }
    //         ]
    //     };

    //     try {
    //         const response = await axios.post(url, data, { headers, responseType: 'stream' });
    //         const tempFilePath = path.join(__dirname, 'temp_audio.mp3');
    //         const writer = fs.createWriteStream(tempFilePath);

    //         response.data.pipe(writer);
    //         writer.on('finish', () => {
    //             res.sendFile(tempFilePath, () => {
    //                 fs.unlinkSync(tempFilePath); // Clean up the temp file after sending
    //             });
    //         });
    //         writer.on('error', (err) => {
    //             console.error(err);
    //             res.status(500).send('Error generating the audio');
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send('Error generating the audio');
    //     }
    // });

    // app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
