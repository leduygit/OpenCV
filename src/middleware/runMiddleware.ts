import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Runs a middleware function with the Next.js request and response objects.
 *
 * @param req - The Next.js request object.
 * @param res - The Next.js response object.
 * @param fn - The middleware function to run.
 * @returns A promise that resolves if the middleware completes successfully, or rejects if the middleware throws an error.
 */
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        // If the middleware throws an error, reject the promise.
        return reject(result);
      }
      // If the middleware completes successfully, resolve the promise.
      return resolve(result);
    });
  });
}
