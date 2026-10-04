import dotenv from 'dotenv';
import User from './models/user.js';
import Shipment from './models/shipment.js';
import Rate from './models/rate.js';
import connectDB from './config/db.js';

dotenv.config();

const seed = async () => {
  try {
    const requiredCredentials = [
      'ADMIN_EMAIL',
      'ADMIN_PASSWORD',
    ];
    const missing = requiredCredentials.filter(
      (key) => !process.env[key]?.trim(),
    );
    if (missing.length)
      throw new Error(`Set required seed variables: ${missing.join(', ')}`);
    const placeholders = requiredCredentials.filter((key) => {
      const value = process.env[key].trim().toLowerCase();
      return value.includes('replace-with') || value.endsWith('.example.test');
    });
    if (placeholders.length)
      throw new Error(
        `Replace sample values before seeding: ${placeholders.join(', ')}`,
      );

    await connectDB();
    console.log('DB Connected for seeding');

    const assignmentMigration = await Shipment.collection.updateMany(
      { dispatcher: { $exists: true } },
      [
        {
          $set: {
            assignedBy: { $ifNull: ['$assignedBy', '$dispatcher'] },
          },
        },
        { $unset: 'dispatcher' },
      ],
    );
    if (assignmentMigration.modifiedCount)
      console.log(
        `Migrated ${assignmentMigration.modifiedCount} shipment assignment record(s)`,
      );

    const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const adminPass = process.env.ADMIN_PASSWORD;

    const { modifiedCount } = await User.updateMany(
      { role: 'dispatcher', isActive: { $ne: false } },
      { $set: { isActive: false } },
    );
    if (modifiedCount)
      console.log(`Disabled ${modifiedCount} legacy dispatcher account(s)`);

    // 1. ADMIN
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'G71 Admin',
        email: adminEmail,
        password: adminPass,
        role: 'admin',
        phone: '08000000000',
        city: 'Lagos',
        isActive: true,
        mustChangePassword: false,
      });
      console.log('✅ Admin seeded:', adminEmail);
    } else {
      console.log('ℹ️ Admin exists:', adminEmail);
    }

    // 3. RATES - Required for calculatePrice to work on fresh DB
    const rateCount = await Rate.countDocuments();
    if (rateCount === 0) {
      await Rate.create({
        name: 'Standard Rate',
        baseFee: 3000,
        perKgFee: 300,
        perKmFee: 0,
        driverShare: 500,
        isActive: true,
      });
      console.log('✅ Default rate seeded');
    } else {
      console.log(`ℹ️ Rates exist: ${rateCount}`);
      const activeRate = await Rate.findOne({ isActive: true }).sort({
        updatedAt: -1,
      });
      if (activeRate) {
        await Rate.updateMany(
          { _id: { $ne: activeRate._id }, isActive: true },
          { $set: { isActive: false } },
        );
      } else {
        await Rate.create({
          name: 'Standard Rate',
          baseFee: 3000,
          perKgFee: 300,
          perKmFee: 0,
          driverShare: 500,
          isActive: true,
        });
      }
    }

    console.log('\n=== SEED COMPLETE ===');
    console.log(`Admin: ${adminEmail}`);
    console.log(`Run: npm start and login at /login`);
    process.exit(0);
  } catch (err) {
    console.error('SEED ERROR:', err);
    process.exit(1);
  }
};

seed();
