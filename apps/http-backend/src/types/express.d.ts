// src/types/express.d.ts or src/types/custom.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Or number, depending on your userId type
      // Add other custom properties if needed, e.g.:
      // userRole?: string;
    }
  }
}