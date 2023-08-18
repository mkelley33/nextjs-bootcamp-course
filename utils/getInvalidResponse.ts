import { NextApiResponse } from 'next';

export default function getInvalidDataResponse(
  res: NextApiResponse,
  errorMessage?: string
) {
  return res.status(400).json({
    errorMessage: errorMessage ?? 'Invalid data provided',
  });
}
