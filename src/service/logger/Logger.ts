type Level = 'trace' | 'debug' | 'info' | 'warn' | 'error';
const hierachy: Array<Level> = ['trace', 'debug', 'info', 'warn', 'error'];

const defaultLogLevel =
  process.env.NODE_ENV === 'development' ? 'trace' : 'warn';
const logLevel = process.env.REACT_APP_LOG_LEVEL ?? defaultLogLevel;
const logPriority = hierachy.indexOf(logLevel as Level);

function enabledLogLevel(level: string): boolean {
  const priority = hierachy.indexOf(level as Level);

  if (priority === -1) {
    throw new Error(`level must be one of [${hierachy}]`);
  }

  return priority >= logPriority;
}
export class Logger {
  private name;

  constructor(name: string) {
    this.name = name;
  }

  private logMessage(level: Level, ...params: Array<unknown>): void {
    if (enabledLogLevel(level)) {
      console[level](`[name=${this.name}]`, ...params);
    }
  }

  trace(...params: Array<unknown>): void {
    this.logMessage('trace', ...params);
  }

  debug(...params: Array<unknown>): void {
    this.logMessage('debug', ...params);
  }

  info(...params: Array<unknown>): void {
    this.logMessage('info', ...params);
  }

  warn(...params: Array<unknown>): void {
    this.logMessage('warn', ...params);
  }

  error(...params: Array<unknown>): void {
    this.logMessage('error', ...params);
  }
}
