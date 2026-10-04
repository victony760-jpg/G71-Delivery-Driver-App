import Rate from '../models/rate.js';

export const getActiveRate = async (req, res) => {
  try {
    let rate = await Rate.findOne({ isActive: true }).sort({ updatedAt: -1 });
    if (!rate) {
      rate = await Rate.create({
        baseFee: 1500,
        perKgFee: 300,
        driverShare: 500,
      });
    }
    res.json({ success: true, rate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllRates = async (req, res) => {
  try {
    const rates = await Rate.find().sort('-createdAt');
    res.json({ success: true, rates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateRate = async (req, res) => {
  try {
    const { baseFee, perKgFee, perKmFee, driverShare } = req.body;
    if (
      ![baseFee, perKgFee, perKmFee, driverShare].some(
        (value) => value !== undefined,
      )
    )
      return res
        .status(400)
        .json({ success: false, message: 'Provide at least one rate field' });
    let rate = await Rate.findOne({ isActive: true }).sort({ updatedAt: -1 });
    if (!rate) rate = new Rate();
    if (baseFee !== undefined) rate.baseFee = Number(baseFee);
    if (perKgFee !== undefined) rate.perKgFee = Number(perKgFee);
    if (perKmFee !== undefined) rate.perKmFee = Number(perKmFee);
    if (driverShare !== undefined) rate.driverShare = Number(driverShare);
    rate.isActive = true;
    await rate.save();
    await Rate.updateMany(
      { _id: { $ne: rate._id }, isActive: true },
      { $set: { isActive: false } },
    );
    res.json({ success: true, rate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const calculatePrice = async (weightKg = 1, distanceKm = 0) => {
  let rate = await Rate.findOne({ isActive: true }).sort({ updatedAt: -1 });
  if (!rate)
    rate = { baseFee: 1500, perKgFee: 300, perKmFee: 0, driverShare: 500 };
  const w = Math.max(1, Number(weightKg) || 1);
  const d = Number(distanceKm) || 0;
  const price = rate.baseFee + w * rate.perKgFee + d * (rate.perKmFee || 0);
  return {
    price: Math.round(price),
    driverEarning: rate.driverShare,
    rateId: rate._id || rate.id,
    rate,
  };
};
