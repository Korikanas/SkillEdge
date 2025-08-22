// server.js - Enhanced version
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Environment variables
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skilledge', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schemas
const questionSchema = new mongoose.Schema({
  examType: String,
  question: String,
  options: [String],
  correctAnswer: String,
  difficulty: { type: String, default: 'medium' }
});

const examSchema = new mongoose.Schema({
  examType: String,
  name: String,
  description: String,
  passingScore: { type: Number, default: 70 },
  timeLimit: { type: Number, default: 30 } // in minutes
});

const Question = mongoose.model('Question', questionSchema);
const Exam = mongoose.model('Exam', examSchema);

// API Routes
app.get('/api/exams', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/questions/:examType', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const questions = await Question.find({ examType: req.params.examType })
      .limit(parseInt(limit));
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add result saving endpoint
app.post('/api/results', async (req, res) => {
  try {
    const { studentName, email, examType, score, passed } = req.body;
    // Save to database (you'd need to create a Result model)
    res.json({ success: true, message: 'Result saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});