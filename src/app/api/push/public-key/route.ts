import { NextResponse } from 'next/server';
import { pushNotificationService } from '@/services/pushNotificationService';

export async function GET() {
  const publicKey = pushNotificationService.getPublicKey();

  if (!publicKey) {
    return NextResponse.json(
      { error: 'Browser notifications are not configured' },
      { status: 503 },
    );
  }

  return NextResponse.json({ publicKey });
}
