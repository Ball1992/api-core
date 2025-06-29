// Security configuration implementation example

// Rate limiting configuration
export const rateLimitConfig = {
  ttl: 60, // Time window in seconds
  limit: 10, // Max requests per time window
};

// Password validation regex
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Security headers configuration
export const securityHeaders = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
};

// JWT configuration
export const jwtConfig = {
  accessTokenExpiration: "15m",
  refreshTokenExpiration: "7d",
  algorithm: "HS256",
};

// File upload configuration
export const fileUploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  uploadDirectory: "./uploads",
};

// IP whitelist for admin endpoints
export const adminIpWhitelist = [
  "127.0.0.1",
  "::1",
  // Add your admin IPs here
];

// Suspicious activity patterns
export const suspiciousPatterns = {
  sqlInjection:
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
  xss: /(<script|<iframe|javascript:|onerror=|onload=)/i,
  pathTraversal: /(\.\.\/|\.\.\\)/,
  commandInjection: /([;&|`]|\$\()/,
};

// Security event types for logging
export enum SecurityEventType {
  FAILED_LOGIN = "FAILED_LOGIN",
  SUSPICIOUS_REQUEST = "SUSPICIOUS_REQUEST",
  UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INVALID_FILE_UPLOAD = "INVALID_FILE_UPLOAD",
  SQL_INJECTION_ATTEMPT = "SQL_INJECTION_ATTEMPT",
  XSS_ATTEMPT = "XSS_ATTEMPT",
}
