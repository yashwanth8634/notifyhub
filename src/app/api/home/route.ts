import { NextResponse } from 'next/server';
import { getAnnouncements } from '@/actions/announcements';
import { getStats } from '@/actions/stats';
import { logger } from '@/lib/logger';
import { Announcement } from '@/types';

export async function GET() {
  try {
    const announcements = await getAnnouncements({ limit: 12 });
    const stats = await getStats();

    const ticker = announcements.map((a: Announcement) => ({ 
      id: a.id, 
      title: a.title, 
      is_alert: a.is_alert,
      department: a.department,
    }));

    return NextResponse.json({ ticker, stats });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    logger.error('Failed to load home data', {
      action: 'home_api_failed',
      metadata: { error: error.message },
    });
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}