import { NextResponse } from 'next/server';
import { getAnnouncements } from '@/actions/announcements';
import { getStats } from '@/actions/stats';

export async function GET() {
  try {
    const announcements = await getAnnouncements({ limit: 12 });
    const stats = await getStats();

    // Map minimal data for the ticker
    const ticker = announcements.map((a: any) => ({ id: a.id, title: a.title, is_alert: a.is_alert }));

    return NextResponse.json({ ticker, stats });
  } catch (err) {
    console.error('Failed to load home data', err);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
