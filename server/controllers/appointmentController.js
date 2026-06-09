import Appointment from '../models/Appointment.js';
import { sendAppointmentNotification } from '../utils/email.js';

export const bookAppointment = async (req, res) => {
  try {
    const { patientName, email, phone, appointmentDate, symptoms, screeningId } = req.body;

    const appointment = await Appointment.create({
      user: req.user?._id,
      patientName,
      email,
      phone,
      appointmentDate,
      symptoms,
      screening: screeningId || undefined,
    });

    const emailResult = await sendAppointmentNotification(appointment);

    res.status(201).json({
      success: true,
      appointment,
      emailNotification: emailResult,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
