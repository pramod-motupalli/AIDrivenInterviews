// Centralized mock data and API contracts
export const MOCK_USER = {
  id: 'CND-8942',
  name: 'Alex Rivers',
  email: 'alex@company.com',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
};

export const MOCK_LOGIN_RESPONSE = {
  token: 'mock-jwt-token-abc123',
  user: MOCK_USER,
  profile: { isComplete: true }
};

export const MOCK_DASHBOARD_DATA = {
  user: MOCK_USER,
  job: { title: 'Senior UX Designer', company: 'TechCorp Innovations' },
  application: { status: 'System Check Pending', currentStep: 'invitation' },
  interview: {
    date: 'October 24, 2026',
    time: '10:00 AM - 11:30 AM EST',
    location: 'Virtual (Link provided after check)'
  },
  checklist: [
    { task: 'Internet connection test', status: 'pending' },
    { task: 'Camera permission', status: 'pending' },
    { task: 'Microphone check', status: 'pending' }
  ]
};

export const MOCK_INTERVIEW_QUESTIONS = [
  { id: 'q1', text: 'Tell me about yourself and your background.', timeLimit: 120, category: 'Behavioral' },
  { id: 'q2', text: 'Tell me about a time when you had to manage conflicting priorities on a critical project.', timeLimit: 180, category: 'Behavioral' },
  { id: 'q3', text: 'How do you approach user research for a new product feature?', timeLimit: 180, category: 'Technical' },
  { id: 'q4', text: 'Describe a design decision you made that was initially unpopular but proved successful.', timeLimit: 150, category: 'Behavioral' },
  { id: 'q5', text: 'How do you measure the success of a UX design?', timeLimit: 120, category: 'Technical' }
];

export const MOCK_INTERVIEW_RESULTS = {
  summary: {
    communication: 4.8,
    proficiency: 'Advanced',
    strengths: [
      'User-centered design focus',
      'Clear cross-functional communication',
      'Systematic problem solving'
    ]
  },
  nextSteps: [
    'Schedule a 30-minute culture fit interview with the hiring manager.',
    'Review the provided project brief prior to the call.',
    'Submit your references via the portal.'
  ]
};
