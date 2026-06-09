const SYMPTOM_WEIGHTS = {
  irritation: { never: 0, rarely: 1, sometimes: 3, often: 5, daily: 7 },
  burning: { never: 0, rarely: 1, sometimes: 3, often: 5, daily: 7 },
  redness: { never: 0, rarely: 1, sometimes: 2, often: 4, daily: 6 },
  blurredVision: { never: 0, rarely: 1, sometimes: 3, often: 5, daily: 7 },
  lightSensitivity: { never: 0, rarely: 1, sometimes: 2, often: 4, daily: 6 },
};

const LIFESTYLE_WEIGHTS = {
  screenTime: { under2: 0, '2-4': 2, '4-8': 5, '8-12': 8, over12: 10 },
  acExposure: { none: 0, under2: 1, '2-6': 3, '6-10': 5, over10: 7 },
  sleepQuality: { excellent: 0, good: 1, fair: 4, poor: 7, veryPoor: 10 },
  waterIntake: { over8: 0, '6-8': 1, '4-6': 3, '2-4': 6, under2: 8 },
  contactLens: { never: 0, occasionally: 2, daily: 5, extended: 7 },
  outdoorExposure: { low: 0, moderate: 1, high: 3, veryHigh: 5 },
  smoking: { never: 0, former: 2, occasional: 5, daily: 8 },
};

const MAX_SCORE = 100;

export function calculateRiskScore(answers) {
  let score = 0;

  Object.entries(SYMPTOM_WEIGHTS).forEach(([key, map]) => {
    const val = answers[key];
    if (val && map[val] !== undefined) score += map[val];
  });

  Object.entries(LIFESTYLE_WEIGHTS).forEach(([key, map]) => {
    const val = answers[key];
    if (val && map[val] !== undefined) score += map[val];
  });

  let riskCategory = 'Low Risk';
  if (score >= 47) riskCategory = 'High Risk';
  else if (score >= 25) riskCategory = 'Moderate Risk';

  return {
    riskScore: score,
    riskPercentage: 0,
    riskCategory,
  };
}

export function getRecommendations(riskCategory, answers) {
  const base = [
    {
      title: '20-20-20 Rule',
      text: 'Every 20 minutes, look at something 20 feet away for 20 seconds to reduce digital eye strain.',
      icon: 'clock',
    },
    {
      title: 'Screen Breaks',
      text: 'Take a 5-minute break every hour when using screens. Blink consciously during breaks.',
      icon: 'monitor',
    },
    {
      title: 'Hydration',
      text: 'Aim for 6–8 glasses of water daily. Dehydration worsens dry eye symptoms.',
      icon: 'droplet',
    },
  ];

  const moderate = [
    {
      title: 'Sleep Hygiene',
      text: 'Target 7–8 hours of sleep. Keep screens off 1 hour before bed.',
      icon: 'moon',
    },
    {
      title: 'Humidify Your Space',
      text: 'Use a humidifier if AC or heating dries the air. Keep humidity around 40–50%.',
      icon: 'wind',
    },
    {
      title: 'Artificial Tears',
      text: 'Consider preservative-free lubricating eye drops 2–4 times daily as needed.',
      icon: 'eye',
    },
  ];

  const high = [
    {
      title: 'See an Eye Specialist',
      text: 'Schedule a comprehensive eye exam. High symptom burden may need prescription treatment.',
      icon: 'stethoscope',
      urgent: true,
    },
    {
      title: 'Reduce Contact Lens Wear',
      text: 'Limit lens hours and ensure proper cleaning. Consider glasses on high-symptom days.',
      icon: 'glasses',
    },
    {
      title: 'Smoking Cessation',
      text: 'Smoking significantly worsens dry eye. Seek support programs if you smoke.',
      icon: 'alert',
    },
  ];

  let recs = [...base];
  if (riskCategory === 'Moderate Risk' || riskCategory === 'High Risk') recs = [...recs, ...moderate];
  if (riskCategory === 'High Risk') recs = [...recs, ...high];

  if (answers?.screenTime === 'over12' || answers?.screenTime === '8-12') {
    recs.push({
      title: 'Blue Light Awareness',
      text: 'Enable night mode on devices and consider blue-light filtering glasses.',
      icon: 'shield',
    });
  }

  return recs;
}

export function getRiskFactorBreakdown(answers) {
  const factors = [];
  const add = (name, value, weight) => {
    if (value) factors.push({ name, value, weight: weight || 5 });
  };

  add('Eye Irritation', answers.irritation, SYMPTOM_WEIGHTS.irritation[answers.irritation]);
  add('Burning', answers.burning, SYMPTOM_WEIGHTS.burning[answers.burning]);
  add('Redness', answers.redness, SYMPTOM_WEIGHTS.redness[answers.redness]);
  add('Blurred Vision', answers.blurredVision, SYMPTOM_WEIGHTS.blurredVision[answers.blurredVision]);
  add('Light Sensitivity', answers.lightSensitivity, SYMPTOM_WEIGHTS.lightSensitivity[answers.lightSensitivity]);
  add('Screen Time', answers.screenTime, LIFESTYLE_WEIGHTS.screenTime[answers.screenTime]);
  add('AC Exposure', answers.acExposure, LIFESTYLE_WEIGHTS.acExposure[answers.acExposure]);
  add('Sleep Quality', answers.sleepQuality, LIFESTYLE_WEIGHTS.sleepQuality[answers.sleepQuality]);
  add('Water Intake', answers.waterIntake, LIFESTYLE_WEIGHTS.waterIntake[answers.waterIntake]);
  add('Contact Lenses', answers.contactLens, LIFESTYLE_WEIGHTS.contactLens[answers.contactLens]);
  add('Outdoor Exposure', answers.outdoorExposure, LIFESTYLE_WEIGHTS.outdoorExposure[answers.outdoorExposure]);
  add('Smoking', answers.smoking, LIFESTYLE_WEIGHTS.smoking[answers.smoking]);

  return factors.filter((f) => f.weight > 0).sort((a, b) => b.weight - a.weight);
}
