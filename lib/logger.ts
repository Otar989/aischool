import pino from 'pino';

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

export const logger = pino({
  level,
  redact: {
    paths: ['email', '*.email', 'token', '*.token', 'password', '*.password', 'authorization', '*.authorization'],
    censor: '[REDACTED]'
  }
});

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return '[REDACTED]';
  return `${user[0]}***@${domain}`;
}

export function sanitize<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  const clone: any = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj as any)) {
    if (/email|token|password/i.test(key)) {
      clone[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      clone[key] = sanitize(value);
    } else {
      clone[key] = value;
    }
  }
  return clone as T;
}
