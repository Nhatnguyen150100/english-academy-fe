import { IStatus } from '../types/promise.types';

export const DEFINE_STATUS: Record<Uppercase<IStatus>, IStatus> = {
  IDLE: 'idle',
  ERROR: 'error',
  SUCCESS: 'success',
  PENDING: 'pending',
};
