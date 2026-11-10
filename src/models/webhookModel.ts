import { query } from '@/config/db';

export interface WebhookSubscriber {
  id: number;
  url: string;
  events: string[];
  created_at: string;
}

interface WebhookCreateData {
  url: string;
  events: string[];
}

export const webhookModel = {
  async findAll(): Promise<WebhookSubscriber[]> {
    const result = await query('SELECT * FROM webhook_subscribers');
    return result.rows;
  },

  async create(data: WebhookCreateData): Promise<WebhookSubscriber> {
    const { url, events } = data;
    const result = await query(
      'INSERT INTO webhook_subscribers (url, events) VALUES ($1, $2) RETURNING *',
      [url, events]
    );
    return result.rows[0];
  },

  async remove(id: number): Promise<void> {
    await query('DELETE FROM webhook_subscribers WHERE id = $1', [id]);
  },
};