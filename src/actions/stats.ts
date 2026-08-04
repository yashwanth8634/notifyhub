"use server";

import { query } from '@/config/db';

export async function getStats() {
  const noticesRes = await query('SELECT COUNT(*) FROM announcements WHERE deleted_at IS NULL');
  const eventsRes = await query('SELECT COUNT(*) FROM events WHERE deleted_at IS NULL AND event_date > CURRENT_TIMESTAMP');
  
  return {
    totalNotices: parseInt(noticesRes.rows[0].count),
    upcomingEvents: parseInt(eventsRes.rows[0].count)
  };
}
