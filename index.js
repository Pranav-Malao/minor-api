const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const balKand = require('./models/balKand.js');
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');


mongoose.connect('mongodb://localhost:27017/minor-project')
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch(err => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.get('/balKand/:id/:subId', async (req, res) => {
  try {
    const info = "1." + req.params.id.toString();
    const subInfo = req.params.subId.toString();
    if (subInfo.length === 2) {
      const slokas = await balKand.findOne({ id: info + "." + subInfo });
      res.json(slokas);
    }
    else if (subInfo.length < 2) {
      return res.status(400).json({ error: 'Invalid subId' });
    }
    else {
      const [a, b] = subInfo.split("-");
      const slokas = await balKand.find({
        id: {
          $gte: `${info}.${a}`,
          $lte: `${info}.${b}`
        }
      }
      );
      res.json(slokas);
    }
  } catch (error) {
    console.error('Error fetching slokas:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/balKand/:id', async (req, res) => {
  try {
    // console.log(req.params.id)
    const info = Number(req.params.id);
    // console.log(info)
    // console.log(typeof (info))
    const slokas = await balKand.find({ sarga: info }).limit(5);
    // console.log(slokas)
    res.json(slokas);
  } catch (error) {
    console.error('Error fetching slokas:', error);
    res.status(500).send('Internal Server Error');
  }
});

const geminiApiKey = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generate = async (prompt) => {
  try {
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error(error);
  }
};

app.get('/api', async (req, res) => {
  try {
    const {prompt} = req.body;
    const result = await generate(prompt);
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await geminiModel.generateContent(prompt);
    console.log(result);
    // res.json({ result.response.text() });
    res.send(result.response.text());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating text' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});