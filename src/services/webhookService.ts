import { webhookModel, WebhookSubscriber } from '@/models/webhookModel';
import axios from 'axios';
import { logger } from '@/lib/logger';

interface WebhookDelivery {
  id: number;
  subscriber_id: number;
  event: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  last_attempt_at?: string;
  next_retry_at?: string;
  error?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 5000, 30000];

function calculateNextRetry(attempt: number): number {
  return RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
}

async function deliverWithRetry(
  subscriber: WebhookSubscriber,
  event: string,
  payload: any,
  attempt = 0
): Promise<void> {
  try {
    await axios.post(subscriber.url, { event, payload }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NotifyHub-Webhook/1.0',
      },
    });
    
    logger.info('Webhook delivered successfully', {
      action: 'webhook_deliver',
      metadata: { subscriberId: subscriber.id, event },
    });
  } catch (error: any) {
    const nextAttempt = attempt + 1;
    
    if (nextAttempt < MAX_RETRIES) {
      const delay = calculateNextRetry(attempt);
      logger.warn('Webhook delivery failed, scheduling retry', {
        action: 'webhook_retry',
        metadata: { 
          subscriberId: subscriber.id, 
          event, 
          attempt: nextAttempt,
          delayMs: delay,
          error: error.message 
        },
      });
      
      setTimeout(() => {
        deliverWithRetry(subscriber, event, payload, nextAttempt).catch(err => {
          logger.error('Webhook retry failed', {
            action: 'webhook_retry_failed',
            metadata: { subscriberId: subscriber.id, event, error: err.message },
          });
        });
      }, delay);
    } else {
      logger.error('Webhook delivery failed permanently', {
        action: 'webhook_failed',
        metadata: { 
          subscriberId: subscriber.id, 
          event, 
          attempts: MAX_RETRIES,
          error: error.message 
        },
      });
    }
  }
}

export const webhookService = {
  async getSubscribers(): Promise<WebhookSubscriber[]> {
    return webhookModel.findAll();
  },
  
  async subscribe(url: string, events: string[]): Promise<WebhookSubscriber> {
    return webhookModel.create({ url, events });
  },

  async dispatch(event: string, payload: any): Promise<void> {
    try {
      const subscribers = await webhookModel.findAll();
      
      for (const sub of subscribers) {
        if (sub.events.includes(event)) {
          deliverWithRetry(sub, event, payload).catch(err => {
            logger.error('Webhook dispatch error', {
              action: 'webhook_dispatch_error',
              metadata: { subscriberId: sub.id, event, error: err.message },
            });
          });
        }
      }
    } catch (error: any) {
      logger.error('Webhook dispatch error', {
        action: 'webhook_dispatch_error',
        metadata: { event, error: error.message },
      });
    }
  },
};