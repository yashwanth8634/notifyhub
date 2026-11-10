"use server";

import { query } from "@/config/db";
import { logger } from '@/lib/logger';

export async function getStats() {
  try {
    const [announcementStats, eventsCount, departmentsCount] = await Promise.all([
      query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE is_alert = true)::int AS alerts
        FROM announcements
        WHERE deleted_at IS NULL
      `),
      query("SELECT COUNT(*) FROM events WHERE event_date > CURRENT_TIMESTAMP AND deleted_at IS NULL"),
      query("SELECT COUNT(*) FROM departments"),
    ]);

    return {
      totalNotices: announcementStats.rows[0].total,
      urgentAlerts: announcementStats.rows[0].alerts,
      upcomingEvents: parseInt(eventsCount.rows[0].count, 10),
      departments: parseInt(departmentsCount.rows[0].count, 10),
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.error('Failed to fetch stats', {
      action: 'stats_fetch_failed',
      metadata: { error: err.message },
    });
    throw error;
  }
}