// nano logger to avoid ts compiler errors
export const log = {
  info: (message: string) => console.log(`[INFO]: ${message}`),
  warn: (message: string) => console.warn(`[WARN]: ${message}`),
  error: (message: string) => console.error(`[ERROR]: ${message}`),
  debug: (message: string) => console.error(`[DEBUG]:  ${message}`),
};
