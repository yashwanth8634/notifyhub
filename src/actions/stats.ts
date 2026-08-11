"use server";

import { query } from "@/config/db";

export async function getStats() {
  const announcementCount = await query(
    "SELECT COUNT(*) FROM announcements"
  );

  const alertCount = await query(
    "SELECT COUNT(*) FROM announcements WHERE is_alert = true"
  );

  const eventsCount = await query(
    "SELECT COUNT(*) FROM events WHERE event_date > CURRENT_TIMESTAMP"
  );

  const departmentsCount = await query(
    "SELECT COUNT(*) FROM departments"
  );

  return {
    totalNotices: parseInt(
      announcementCount.rows[0].count,
      10
    ),

    urgentAlerts: parseInt(
      alertCount.rows[0].count,
      10
    ),

    upcomingEvents: parseInt(
      eventsCount.rows[0].count,
      10
    ),

    departments: parseInt(
      departmentsCount.rows[0].count,
      10
    ),
  };
}