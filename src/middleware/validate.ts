import type { Context } from 'hono'; // Import the Context type
import { ZodSchema } from 'zod';

// Extend the request object to include the `body` property
declare module 'hono' {
  interface HonoRequest {
    body?: any; // Add `body` property to HonoRequest
  }
}

export const validate = (schema: ZodSchema) => async (ctx: Context, next: () => Promise<void>) => {
  try {
    const body = await ctx.req.json(); // Parse JSON body
    const parsedData = schema.parse(body); // Validate and parse
    ctx.req.body = parsedData; // Attach parsed data to the request
    await next(); // Proceed to the next middleware or handler
  } catch (err) {
    return ctx.json({ err }, 400); // Return validation errors
  }
};
