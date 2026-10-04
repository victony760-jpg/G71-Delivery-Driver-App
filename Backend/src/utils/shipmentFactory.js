export const buildShipmentDocument = ({ input, user, pricing }) => {
  const userId = user._id || user.id;
  const location = 'Warehouse - Lagos';
  const weight = Number(input.weight);

  return {
    client: userId,
    customerName: user.name,
    customerEmail: user.email,
    senderName: user.name,
    receiverName: input.receiverName.trim(),
    receiverPhone: input.receiverPhone?.trim() || '',
    pickupAddress: input.pickupAddress.trim(),
    deliveryAddress: input.deliveryAddress.trim(),
    packageDescription: input.packageDescription?.trim() || '',
    weight: Number.isFinite(weight) && weight > 0 ? weight : 1,
    distanceKm: 0,
    price: pricing.price,
    driverEarning: pricing.driverEarning,
    rate: pricing.rateId,
    status: 'pending',
    currentLocation: location,
    history: [{ status: 'pending', location, updatedBy: userId }],
  };
};
