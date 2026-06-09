export const FREQUENCY_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: 'rarely', label: 'Rarely' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'often', label: 'Often' },
  { value: 'daily', label: 'Daily' },
];

export const QUESTIONNAIRE_STEPS = [
  {
    id: 'symptoms',
    title: 'Symptom Assessment',
    subtitle: 'How often do you experience these symptoms?',
    questions: [
      { key: 'irritation', label: 'Eye irritation or grittiness', options: FREQUENCY_OPTIONS },
      { key: 'burning', label: 'Burning sensation in eyes', options: FREQUENCY_OPTIONS },
      { key: 'redness', label: 'Eye redness', options: FREQUENCY_OPTIONS },
      { key: 'blurredVision', label: 'Blurred vision', options: FREQUENCY_OPTIONS },
      { key: 'lightSensitivity', label: 'Sensitivity to light', options: FREQUENCY_OPTIONS },
    ],
  },
  {
    id: 'digital',
    title: 'Digital & Environment',
    subtitle: 'Your screen time and environmental exposure',
    questions: [
      {
        key: 'screenTime',
        label: 'Daily screen time (hours)',
        options: [
          { value: 'under2', label: 'Under 2 hours' },
          { value: '2-4', label: '2–4 hours' },
          { value: '4-8', label: '4–8 hours' },
          { value: '8-12', label: '8–12 hours' },
          { value: 'over12', label: 'Over 12 hours' },
        ],
      },
      {
        key: 'acExposure',
        label: 'AC / climate-controlled exposure daily',
        options: [
          { value: 'none', label: 'None' },
          { value: 'under2', label: 'Under 2 hours' },
          { value: '2-6', label: '2–6 hours' },
          { value: '6-10', label: '6–10 hours' },
          { value: 'over10', label: 'Over 10 hours' },
        ],
      },
      {
        key: 'outdoorExposure',
        label: 'Outdoor sun/wind exposure',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'high', label: 'High' },
          { value: 'veryHigh', label: 'Very high' },
        ],
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Habits',
    subtitle: 'Sleep, hydration, and habits affecting eye health',
    questions: [
      {
        key: 'sleepQuality',
        label: 'Sleep quality',
        options: [
          { value: 'excellent', label: 'Excellent' },
          { value: 'good', label: 'Good' },
          { value: 'fair', label: 'Fair' },
          { value: 'poor', label: 'Poor' },
          { value: 'veryPoor', label: 'Very poor' },
        ],
      },
      {
        key: 'sleepHours',
        label: 'Average sleep hours',
        options: [
          { value: 'over8', label: '8+ hours' },
          { value: '7-8', label: '7–8 hours' },
          { value: '6-7', label: '6–7 hours' },
          { value: 'under6', label: 'Under 6 hours' },
        ],
      },
      {
        key: 'waterIntake',
        label: 'Daily water intake (glasses)',
        options: [
          { value: 'over8', label: '8+ glasses' },
          { value: '6-8', label: '6–8 glasses' },
          { value: '4-6', label: '4–6 glasses' },
          { value: '2-4', label: '2–4 glasses' },
          { value: 'under2', label: 'Under 2 glasses' },
        ],
      },
      {
        key: 'contactLens',
        label: 'Contact lens usage',
        options: [
          { value: 'never', label: 'Never' },
          { value: 'occasionally', label: 'Occasionally' },
          { value: 'daily', label: 'Daily' },
          { value: 'extended', label: 'Extended wear' },
        ],
      },
      {
        key: 'smoking',
        label: 'Smoking habits',
        options: [
          { value: 'never', label: 'Never' },
          { value: 'former', label: 'Former smoker' },
          { value: 'occasional', label: 'Occasionally' },
          { value: 'daily', label: 'Daily' },
        ],
      },
    ],
  },
];

export const INITIAL_ANSWERS = {
  irritation: '',
  burning: '',
  redness: '',
  blurredVision: '',
  lightSensitivity: '',
  screenTime: '',
  acExposure: '',
  outdoorExposure: '',
  sleepQuality: '',
  sleepHours: '',
  waterIntake: '',
  contactLens: '',
  smoking: '',
};
