import { MOCK_LOGIN_RESPONSE } from '../mockData';

const USE_MOCK = true;
const MOCK_DELAY = 600;

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export const authService = {
  async login(email, password) {
    if (USE_MOCK) {
      await delay(MOCK_DELAY);
      if (email && password) {
        return { ...MOCK_LOGIN_RESPONSE };
      }
      throw new Error('Invalid credentials');
    }
    // Real API integration would go here
    // return api.post('/auth/login', { email, password });
  },

  async logout() {
    if (USE_MOCK) {
      await delay(200);
      return true;
    }
  },

  async getSession() {
    if (USE_MOCK) {
      const token = localStorage.getItem('token');
      if (!token) return null;
      await delay(300);
      return MOCK_LOGIN_RESPONSE.user;
    }
  }
};
