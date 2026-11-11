import { NextResponse } from 'next/server';
import { getSession } from '@/config/auth';
import { pushNotificationService } from '@/services/pushNotificationService';

export async function POST(request: Request) {
  const session = await getSession();
  const body = await request.json() as { subscription?: PushSubscriptionJSON };
  if (!body.subscription) {
    return NextResponse.json({ error: 'Subscription is required' }, { status: 400 });
  }

  try {
    await pushNotificationService.saveSubscription(session?.id ?? null, body.subscription);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid subscription' },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const body = await request.json() as { endpoint?: string };
  if (!body.endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  await pushNotificationService.removeSubscription(body.endpoint);
  return NextResponse.json({ success: true });
}
