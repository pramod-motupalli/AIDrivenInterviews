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
      const token = localStorage.getItem('interview_session_token');
      if (!token) throw new Error("No session token found");

      const data = await interviewService.startInterview(token);
      
      // data.questions is an array from the backend, usually containing just the first generated question: [{"text": "...", "index": 0}]
      setQuestions(data.questions || []);
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
    setLoading(true);
    try {
      const interviewId = localStorage.getItem('interview_id');
      const currentQ = questions[currentIndex];
      
      // Save the answer locally
      setAnswers(prev => ({ ...prev, [currentIndex]: transcript }));

      // Send to backend for Groq evaluation and next question generation
      const data = await interviewService.submitAnswer(
        interviewId, 
        currentQ.text, 
        transcript, 
        currentIndex
      );

      if (data.is_complete) {
        // Store interview_id for results page (backend returns it on completion)
        if (data.interview_id) {
          localStorage.setItem('interview_id', data.interview_id);
        }
        setIsComplete(true);
      } else if (data.next_question) {
        // Append the new dynamically generated question to the array
        setQuestions(prev => [
          ...prev, 
          { text: data.next_question, index: data.index }
        ]);
        setCurrentIndex(data.index);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setLoading(false);
    }
  };

  // We no longer strictly need nextQuestion as submitAnswer handles the flow,
  // but we keep it empty to not break existing UI imports
  const nextQuestion = () => {};

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
