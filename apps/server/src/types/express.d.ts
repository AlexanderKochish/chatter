import { TokenPayload } from '@/features/auth/types/token-payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
