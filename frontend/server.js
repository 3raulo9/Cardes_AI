const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_KEY;
const VOICE_ID = 'hFgOzpmS0CMtL2to8sAl';
const CHUNK_SIZE = 1024;

app.post('/gemini', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chatHistory = req.body.history.map(item => ({
        ...item,
        parts: Array.isArray(item.parts) ? item.parts : [item.parts]
    }));

    const chat = model.startChat({
        history: req.body.chatHistory
    });
    const msg = req.body.message;

    try {
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        let text = await response.text();
        
        // Replace "Gemini AI" with "Cardes AI"
        text = text.replace(/Gemini/g, "Cardes AI");

        // Add a tab at the end of each sentence
        text = text.split('\n').map(sentence => sentence + '\t').join('\n');

        res.send(text);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the request');
    }
});

app.post('/text-to-speech', async (req, res) => {
    const text = req.body.text;
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    const headers = {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
    };
    const data = {
        'text': text,
        'model_id': 'eleven_monolingual_v1',
        'voice_settings': {
            'stability': 0.5,
            'similarity_boost': 0.5
        }
    };

    try {
        const response = await axios.post(url, data, { headers, responseType: 'stream' });
        const tempFilePath = path.join(__dirname, 'temp_audio.mp3');
        const writer = fs.createWriteStream(tempFilePath);

        response.data.pipe(writer);
        writer.on('finish', () => {
            res.sendFile(tempFilePath, () => {
                fs.unlinkSync(tempFilePath); // Clean up the temp file after sending
            });
        });
        writer.on('error', (err) => {
            console.error(err);
            res.status(500).send('Error generating the audio');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating the audio');
    }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
