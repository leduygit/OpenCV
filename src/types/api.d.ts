export interface CustomNextApiRequest extends NextApiRequest {
  user?: {
    id: string;
  };
}
