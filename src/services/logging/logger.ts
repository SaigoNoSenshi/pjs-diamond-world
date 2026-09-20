/**
 * Technical logging. Never surfaces to the child. In development it mirrors to the
 * console; otherwise it keeps a small ring buffer that Parent Mode can export.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown> | undefined;
  at: string;
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: unknown, context?: Record<string, unknown>): void;
  recent(): readonly LogEntry[];
}

const RING_SIZE = 200;

export class RingBufferLogger implements Logger {
  private readonly entries: LogEntry[] = [];

  constructor(private readonly mirrorToConsole: boolean) {}

  private push(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = { level, message, context, at: new Date().toISOString() };
    this.entries.push(entry);
    if (this.entries.length > RING_SIZE) this.entries.shift();
    if (this.mirrorToConsole) {
      const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      fn(`[${level}] ${message}`, context ?? '');
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.push('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.push('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.push('warn', message, context);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const detail =
      error instanceof Error ? { name: error.name, message: error.message } : { error };
    this.push('error', message, { ...context, ...detail });
  }

  recent(): readonly LogEntry[] {
    return this.entries;
  }
}

declare const __DEV__: boolean | undefined;

export function createLogger(): Logger {
  return new RingBufferLogger(typeof __DEV__ !== 'undefined' && __DEV__ === true);
}
