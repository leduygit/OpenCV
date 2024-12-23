import type { NextApiRequest, NextApiResponse } from "next";


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
