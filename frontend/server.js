const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Ensure history has the correct format
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
        const text = await response.text(); // Ensure we await the text
        res.send(text);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the request');
    }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
