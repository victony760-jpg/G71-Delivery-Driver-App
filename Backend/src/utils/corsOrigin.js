export const createCorsOriginValidator =
  (allowedOrigins) => (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  };
