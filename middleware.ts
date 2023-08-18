import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

function getUnauthorizedRequest() {
  return new NextResponse(
    JSON.stringify({ errorMessage: 'Unauthorized request' }),
    { status: 401 }
  );
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get('authorization') as string;

  if (!bearerToken) return getUnauthorizedRequest();

  const token = bearerToken.split(' ')[1];
  if (!token) return getUnauthorizedRequest();

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return getUnauthorizedRequest();
  }
}

// Add protected routes to the config's matcher
export const config = {
  matcher: ['/api/auth/me'],
};
