import { MOCK_INTERVIEW_QUESTIONS, MOCK_INTERVIEW_RESULTS } from '../mockData';

const USE_MOCK = true;
const MOCK_DELAY = 500;

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export const interviewService = {
  async getQuestions() {
    if (USE_MOCK) {
      await delay(MOCK_DELAY);
      return [...MOCK_INTERVIEW_QUESTIONS];
    }
  },

  async submitAnswer(questionId, transcript) {
    if (USE_MOCK) {
      console.log(`Submitting answer for ${questionId}:`, transcript);
      await delay(400);
      return { success: true };
    }
  },

  async getResults() {
    if (USE_MOCK) {
      await delay(MOCK_DELAY);
      return { ...MOCK_INTERVIEW_RESULTS };
    }
  }
};
