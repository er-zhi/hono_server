// nano logger to avoid ts compiler errors
// I prefer pino logger, but it wasn't required
export const log = {
  info: (message: string) => console.log(`[INFO]: ${message}`),
  warn: (message: string) => console.warn(`[WARN]: ${message}`),
  error: (message: string, error: any) => console.error(`[ERROR]: ${message}`, error),
  debug: (message: string) => console.error(`[DEBUG]:  ${message}`),
};
