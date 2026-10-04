import ServiceRequest from '../models/ServiceRequest.js';
import { trackShipment } from './shipmentControllers.js';
import { sendContactEmail } from '../utils/sendEmail.js';

export const createRequest = async (req, res) => {
  try {
    // Whitelist only — fixes P0 "Do not trust client-supplied state"
    const {
      senderName,
      senderPhone,
      senderEmail,
      pickup,
      dropoff,
      receiverName,
      receiverPhone,
      packageType,
      weight,
      note,
    } = req.body;

    if (
      !senderName ||
      !senderPhone ||
      !senderEmail ||
      !pickup ||
      !dropoff ||
      !receiverName ||
      !receiverPhone
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required delivery fields must be filled',
      });
    }

    // Map frontend -> ServiceRequest schema (support both old and new)
    const request = await ServiceRequest.create({
      senderName,
      senderPhone,
      senderEmail,
      pickupAddress: pickup, // frontend `pickup` -> backend `pickupAddress`
      dropoffAddress: dropoff, // frontend `dropoff` -> backend `dropoffAddress`
      receiverName,
      receiverPhone,
      packageType,
      weight: weight ? Number(weight) : undefined,
      note,
      // also keep guest fields for backward compatibility if your schema uses them
      guestName: senderName,
      guestPhone: senderPhone,
      guestEmail: senderEmail,
    });

    res.status(201).json({
      success: true,
      trackingCode: request.trackingCode,
      request,
    });
  } catch (err) {
    console.error('createRequest error:', err);
    if (
      err.name?.startsWith('MongoNetwork') ||
      err.name === 'MongoServerSelectionError'
    )
      return res.status(503).json({
        success: false,
        message:
          'Our delivery service is temporarily unavailable. Please try again shortly.',
      });
    res.status(500).json({
      success: false,
      message: 'Could not create your delivery request. Please try again.',
    });
  }
};

export const trackByCode = (req, res) => {
  req.params.trackingId = req.params.code;
  return trackShipment(req, res);
};

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim())
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and message are required',
      });

    const emailMessage = [
      `Subject: ${subject || 'General support'}`,
      `Company: ${company || 'Not provided'}`,
      `Phone: ${phone}`,
      '',
      message.trim(),
    ].join('\n');
    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: emailMessage,
    });
    if (!result.success)
      return res
        .status(502)
        .json({ success: false, message: 'Contact email could not be sent' });

    res.json({ success: true, message: 'Message sent to the support team' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not send message' });
  }
};
