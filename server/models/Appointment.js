import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    appointmentDate: { type: Date, required: true },
    symptoms: { type: String, required: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    screening: { type: mongoose.Schema.Types.ObjectId, ref: 'Screening' },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
