import multer from 'multer';

const documentFields = [
  { name: 'nin', maxCount: 1 },
  { name: 'driverLicense', maxCount: 1 },
  { name: 'guarantorLetter', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
];

const allowedTypes = new Map([
  ['application/pdf', new Set(['.pdf'])],
  ['image/jpeg', new Set(['.jpg', '.jpeg'])],
  ['image/png', new Set(['.png'])],
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: documentFields.length,
    fields: 6,
    fieldSize: 1024,
  },
  fileFilter: (req, file, callback) => {
    const extension = file.originalname
      .slice(file.originalname.lastIndexOf('.'))
      .toLowerCase();
    const extensions = allowedTypes.get(file.mimetype);
    if (!extensions?.has(extension))
      return callback(new Error('Documents must be PDF, JPG, or PNG files'));
    callback(null, true);
  },
}).fields(documentFields);

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 8, fieldSize: 1024 },
  fileFilter: (req, file, callback) => {
    const extension = file.originalname
      .slice(file.originalname.lastIndexOf('.'))
      .toLowerCase();
    const extensions = allowedTypes.get(file.mimetype);
    if (!extensions?.has(extension) || file.mimetype === 'application/pdf')
      return callback(new Error('Profile image must be a JPG or PNG file'));
    callback(null, true);
  },
}).single('avatar');

export const parseDriverApplicationUpload = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      const message =
        error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
          ? 'Each document must be 5 MB or smaller'
          : error.message || 'Could not process uploaded documents';
      return res.status(400).json({ success: false, message });
    }

    for (const file of Object.values(req.files || {}).flat()) {
      const isValid =
        (file.mimetype === 'application/pdf' &&
          file.buffer.subarray(0, 5).toString() === '%PDF-') ||
        (file.mimetype === 'image/jpeg' &&
          file.buffer[0] === 0xff &&
          file.buffer[1] === 0xd8 &&
          file.buffer[2] === 0xff) ||
        (file.mimetype === 'image/png' &&
          file.buffer
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));

      if (!isValid)
        return res.status(400).json({
          success: false,
          message: 'Uploaded file content is invalid',
        });
    }
    return next();
  });
};

export const parseDriverAvatarUpload = (req, res, next) => {
  avatarUpload(req, res, (error) => {
    if (error) {
      const message =
        error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
          ? 'Profile image must be 5 MB or smaller'
          : error.message || 'Could not process profile image';
      return res.status(400).json({ success: false, message });
    }

    const file = req.file;
    if (file) {
      const isValid =
        (file.mimetype === 'image/jpeg' &&
          file.buffer[0] === 0xff &&
          file.buffer[1] === 0xd8 &&
          file.buffer[2] === 0xff) ||
        (file.mimetype === 'image/png' &&
          file.buffer
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
      if (!isValid)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Uploaded profile image is invalid',
          });
    }

    return next();
  });
};
