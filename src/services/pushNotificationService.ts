import * as webpush from 'web-push';
import { pushSubscriptionModel, PushSubscriptionRecord } from '@/models/pushSubscriptionModel';
import { logger } from '@/lib/logger';

interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
}

function getVapidConfig() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    return null;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return { publicKey, privateKey, subject };
}

function toWebPushSubscription(subscription: PushSubscriptionRecord): webpush.PushSubscription {
  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };
}

export const pushNotificationService = {
  getPublicKey(): string | null {
    return getVapidConfig()?.publicKey ?? null;
  },

  async saveSubscription(userId: number | null, subscription: PushSubscriptionJSON): Promise<void> {
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys.auth) {
      throw new Error('Invalid push subscription');
    }

    await pushSubscriptionModel.upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });
  },

  async removeSubscription(endpoint: string): Promise<void> {
    await pushSubscriptionModel.removeByEndpoint(endpoint);
  },

  async dispatch(payload: PushPayload): Promise<void> {
    if (!getVapidConfig()) {
      logger.warn('Push notification skipped because VAPID keys are not configured', {
        action: 'push_skipped',
      });
      return;
    }

    const subscriptions = await pushSubscriptionModel.findAll();
    await Promise.all(subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          toWebPushSubscription(subscription),
          JSON.stringify(payload),
        );
      } catch (error) {
        const statusCode = error && typeof error === 'object' && 'statusCode' in error
          ? error.statusCode
          : undefined;

        if (statusCode === 404 || statusCode === 410) {
          await pushSubscriptionModel.removeByEndpoint(subscription.endpoint);
        }

        logger.error('Push notification delivery failed', {
          action: 'push_delivery_failed',
          metadata: {
            subscriptionId: subscription.id,
            statusCode,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }));
  },
};
