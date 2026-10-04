import express from 'express';
import { sendContactEmail } from '../utils/sendEmail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res
        .status(400)
        .json({ success: false, message: 'All fields required' });
    const emailResult = await sendContactEmail({ name, email, message });
    if (!emailResult.success)
      return res
        .status(502)
        .json({ success: false, message: 'Email could not be sent' });
    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
