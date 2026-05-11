import React, { createContext, useContext, useState } from 'react';
import { interviewService } from '../api/services/interviewService';

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const data = await interviewService.getQuestions();
      setQuestions(data);
      setCurrentIndex(0);
      setAnswers({});
      setIsComplete(false);
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId, transcript) => {
    await interviewService.submitAnswer(questionId, transcript);
    setAnswers(prev => ({ ...prev, [questionId]: transcript }));
  };

  const nextQuestion = () => {
    // Limit to 5 questions as per user request
    const limit = Math.min(questions.length, 5);
    if (currentIndex < limit - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const value = {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex],
    answers,
    isComplete,
    loading,
    startInterview,
    submitAnswer,
    nextQuestion
  };

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
