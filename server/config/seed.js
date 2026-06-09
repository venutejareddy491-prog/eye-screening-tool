import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from './db.js';

async function seed() {
  await connectDB();

  const adminEmail = 'admin@dryeye.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created: admin@dryeye.com / admin123');
  } else {
    console.log('Admin already exists');
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
