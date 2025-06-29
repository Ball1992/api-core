import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";
import * as crypto from "crypto";

// Allowed file types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// File size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

// Generate secure filename
export const generateSecureFilename = (originalname: string): string => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString("hex");
  const ext = extname(originalname);
  return `${timestamp}-${randomString}${ext}`;
};

// File filter for images
export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        "Only image files (JPEG, PNG, GIF, WebP) are allowed",
      ),
      false,
    );
  }
  callback(null, true);
};

// File filter for documents
export const documentFileFilter = (req: any, file: any, callback: any) => {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        "Only document files (PDF, DOC, DOCX, XLS, XLSX) are allowed",
      ),
      false,
    );
  }
  callback(null, true);
};

// Combined file filter
export const generalFileFilter = (req: any, file: any, callback: any) => {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  if (!allowedTypes.includes(file.mimetype)) {
    return callback(new BadRequestException("File type not allowed"), false);
  }
  callback(null, true);
};

// Storage configuration
export const fileStorage = diskStorage({
  destination: (req, file, callback) => {
    // Separate folders for different file types
    let folder = "./uploads/misc";
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      folder = "./uploads/images";
    } else if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      folder = "./uploads/documents";
    }
    callback(null, folder);
  },
  filename: (req, file, callback) => {
    const filename = generateSecureFilename(file.originalname);
    callback(null, filename);
  },
});

// Multer options for image upload
export const imageUploadOptions = {
  storage: fileStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
};

// Multer options for document upload
export const documentUploadOptions = {
  storage: fileStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
  },
};

// Multer options for general file upload
export const generalUploadOptions = {
  storage: fileStorage,
  fileFilter: generalFileFilter,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
  },
};

// Validate file extension matches MIME type
export const validateFileIntegrity = (
  filename: string,
  mimetype: string,
): boolean => {
  const ext = extname(filename).toLowerCase();
  const mimeToExt: Record<string, string[]> = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  };

  const allowedExts = mimeToExt[mimetype];
  return allowedExts ? allowedExts.includes(ext) : false;
};

// Sanitize filename for display
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace special chars with underscore
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single
    .toLowerCase();
};
