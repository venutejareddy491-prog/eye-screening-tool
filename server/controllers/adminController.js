import User from '../models/User.js';
import Screening from '../models/Screening.js';
import Appointment from '../models/Appointment.js';

export const getUsers = async (req, res) => {
  try {
    const { search, risk } = req.query;
    const filter = { role: 'user' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    let userData = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      mobileNumber: u.mobileNumber || '',
      createdAt: u.createdAt,
    }));

    if (risk === 'high') {
      const highRiskUserIds = await Screening.distinct('user', { riskCategory: 'High Risk' });
      userData = userData.filter((u) => highRiskUserIds.some((id) => id.toString() === u.id.toString()));
    }

    res.json({ success: true, users: userData, count: userData.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const { riskCategory, limit = 100 } = req.query;
    const filter = {};
    if (riskCategory) filter.riskCategory = riskCategory;

    const screenings = await Screening.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = await Screening.aggregate([
      {
        $group: {
          _id: '$riskCategory',
          count: { $sum: 1 },
          avgScore: { $avg: '$riskScore' },
        },
      },
    ]);

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalScreenings = await Screening.countDocuments();
    const highRiskCount = await Screening.countDocuments({ riskCategory: 'High Risk' });

    res.json({
      success: true,
      screenings,
      appointments,
      analytics: {
        byRisk: stats,
        totalUsers,
        totalScreenings,
        highRiskCount,
        pendingAppointments: await Appointment.countDocuments({ status: 'pending' }),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
