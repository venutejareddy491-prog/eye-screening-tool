import Screening from '../models/Screening.js';
import { calculateRiskScore, getRecommendations, getRiskFactorBreakdown } from '../utils/riskScoring.js';
import { sendScreeningReport } from '../utils/email.js';

export const submitScreening = async (req, res) => {
  try {
    const answers = req.body.answers || req.body;
    const { riskScore, riskPercentage, riskCategory } = calculateRiskScore(answers);
    const recommendations = getRecommendations(riskCategory, answers);
    const riskFactors = getRiskFactorBreakdown(answers);

    const screening = await Screening.create({
      user: req.user._id,
      symptoms: {
        irritation: answers.irritation,
        burning: answers.burning,
        redness: answers.redness,
        blurredVision: answers.blurredVision,
        lightSensitivity: answers.lightSensitivity,
      },
      screenTime: answers.screenTime,
      acExposure: answers.acExposure,
      sleepHours: answers.sleepHours,
      sleepQuality: answers.sleepQuality,
      waterIntake: answers.waterIntake,
      contactLens: answers.contactLens,
      outdoorExposure: answers.outdoorExposure,
      smoking: answers.smoking,
      answers,
      riskScore,
      riskPercentage,
      riskCategory,
      recommendations,
      riskFactors,
    });

    if (req.body.emailReport) {
      await sendScreeningReport(req.user.email, screening);
    }

    res.status(201).json({ success: true, screening });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getResults = async (req, res) => {
  try {
    const screenings = await Screening.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, screenings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const emailReport = async (req, res) => {
  try {
    const screening = await Screening.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!screening) {
      return res.status(404).json({ success: false, message: 'Screening not found' });
    }
    const result = await sendScreeningReport(req.user.email, screening);
    res.json({ success: true, email: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getScreeningById = async (req, res) => {
  try {
    const screening = await Screening.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!screening) {
      return res.status(404).json({ success: false, message: 'Screening not found' });
    }
    res.json({ success: true, screening });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
