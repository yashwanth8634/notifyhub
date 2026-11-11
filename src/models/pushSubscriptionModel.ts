import { query } from '@/config/db';

export interface PushSubscriptionRecord {
  id: number;
  user_id: number | null;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

interface PushSubscriptionData {
  user_id: number | null;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export const pushSubscriptionModel = {
  async upsert(data: PushSubscriptionData): Promise<PushSubscriptionRecord> {
    const result = await query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE
       SET user_id = EXCLUDED.user_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth
       RETURNING *`,
      [data.user_id, data.endpoint, data.p256dh, data.auth],
    );
    return result.rows[0] as PushSubscriptionRecord;
  },

  async findAll(): Promise<PushSubscriptionRecord[]> {
    const result = await query('SELECT * FROM push_subscriptions');
    return result.rows as PushSubscriptionRecord[];
  },

  async removeByEndpoint(endpoint: string): Promise<void> {
    await query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
  },
};
