import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/config/env';

const protectedPrefixes = ['/admin', '/principal', '/dean', '/hod', '/faculty'];
const roleMap: Record<string, string[]> = {
  '/admin': ['super_admin'],
  '/principal': ['principal', 'super_admin'],
  '/dean': ['dean', 'super_admin'],
  '/hod': ['hod', 'super_admin'],
  '/faculty': ['faculty', 'super_admin'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedPrefix = protectedPrefixes.find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!matchedPrefix) {
    return NextResponse.next();
  }

  const token = request.cookies.get('notifyhub_token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
    const allowedRoles = roleMap[matchedPrefix] || [];

    if (!payload.role || !allowedRoles.includes(payload.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/principal/:path*', '/dean/:path*', '/hod/:path*', '/faculty/:path*'],
};
