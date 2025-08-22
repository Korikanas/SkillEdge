const mongoose = require('mongoose');
const { handler } = require('@netlify/functions');

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

// Schemas
const questionSchema = new mongoose.Schema({
  examType: String,
  question: String,
  options: [String],
  correctAnswer: String,
  difficulty: { type: String, default: 'medium' }
});

const Question = mongoose.model('Question', questionSchema);

exports.handler = handler(async (event, context) => {
  try {
    await connectDB();
    
    const { examType } = event.queryStringParameters;
    const limit = event.queryStringParameters.limit || 20;
    
    if (!examType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'examType parameter is required' })
      };
    }
    
    const questions = await Question.find({ examType }).limit(parseInt(limit));
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(questions)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
});