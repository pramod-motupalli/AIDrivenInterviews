import api from '../client';

export const interviewService = {
  async startInterview(token) {
    // Calls the backend to generate the first question
    const response = await api.post('/v1/interviews/start-interview/', { token });
    return response.data;
  },

  async submitAnswer(interviewId, questionText, answerText, questionIndex, token) {
    // Sends the candidate's answer and receives the next dynamically generated question
    const response = await api.post('/v1/interviews/submit-answer/', {
      interview_id: interviewId,
      question_text: questionText,
      answer_text: answerText,
      question_index: questionIndex,
      token: token
    });
    return response.data;
  },

  async getResults(interviewId, token) {
    const params = {};
    if (interviewId) {
      params.interview_id = interviewId;
    }
    if (token) {
      params.token = token;
    }
    const response = await api.get('/v1/interviews/get-results/', { params });
    return response.data;
  }
};
