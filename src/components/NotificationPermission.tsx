"use client";

import { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
function decodeBase64Url(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const decoded = atob(padded);
  const buffer = new ArrayBuffer(decoded.length);
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < decoded.length; index += 1) {
    bytes[index] = decoded.charCodeAt(index);
  }
  return buffer;
}

export function NotificationPermission() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSupported(
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window,
    );
  }, []);

  useEffect(() => {
    if (!supported) return;

    navigator.serviceWorker.register('/sw.js')
      .then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        setEnabled(Boolean(subscription));
      })
      .catch(() => setMessage('Browser notifications are unavailable.'));
  }, [supported]);

  const enableNotifications = async () => {
    setLoading(true);
    setMessage('');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setMessage('Notification permission was not granted.');
        return;
      }

      const response = await fetch('/api/push/public-key');
      if (!response.ok) throw new Error('Push notifications are not configured.');
      const { publicKey } = await response.json() as { publicKey: string };
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeBase64Url(publicKey),
      });

      const subscriptionJson = subscription.toJSON();
      const saveResponse = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: {
            endpoint: subscriptionJson.endpoint,
            keys: {
              p256dh: subscriptionJson.keys?.p256dh,
              auth: subscriptionJson.keys?.auth,
            },
          },
        }),
      });
      if (!saveResponse.ok) throw new Error('Could not save notification preference.');

      setEnabled(true);
      setMessage('Browser notifications enabled.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not enable notifications.');
    } finally {
      setLoading(false);
    }
  };

  if (!supported) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-md border border-white/10 bg-[#151515] px-4 py-3 shadow-xl">
      {enabled ? <Bell className="h-4 w-4 text-green-400" /> : <BellOff className="h-4 w-4 text-gray-400" />}
      <div>
        <p className="text-sm text-white">
          {enabled ? 'Notifications enabled' : 'Get browser notifications'}
        </p>
        {message && <p className="text-xs text-gray-400">{message}</p>}
      </div>
      {!enabled && (
        <button
          type="button"
          onClick={enableNotifications}
          disabled={loading}
          className="rounded bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enable'}
        </button>
      )}
    </div>
  );
}
