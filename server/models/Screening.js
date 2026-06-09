import mongoose from 'mongoose';

const screeningSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symptoms: {
      irritation: String,
      burning: String,
      redness: String,
      blurredVision: String,
      lightSensitivity: String,
    },
    screenTime: String,
    acExposure: String,
    sleepHours: String,
    sleepQuality: String,
    waterIntake: String,
    contactLens: String,
    outdoorExposure: String,
    smoking: String,
    answers: { type: mongoose.Schema.Types.Mixed },
    riskScore: { type: Number, required: true },
    riskPercentage: { type: Number, default: 0 },
    riskCategory: { type: String, enum: ['Low Risk', 'Moderate Risk', 'High Risk'], required: true },
    recommendations: [{ title: String, text: String, icon: String, urgent: Boolean }],
    riskFactors: [{ name: String, value: String, weight: Number }],
  },
  { timestamps: true }
);

export default mongoose.model('Screening', screeningSchema);
