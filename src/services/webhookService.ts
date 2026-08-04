// @ts-nocheck
import { webhookModel } from '@/models/webhookModel';
import axios from 'axios';

export const webhookService = {
  async getSubscribers() {
    return webhookModel.findAll();
  },
  
  async subscribe(url, events) {
    return webhookModel.create(url, events);
  },

  async dispatch(event, payload) {
    try {
      const subscribers = await webhookModel.findAll();
      
      for (const sub of subscribers) {
        if (sub.events.includes(event)) {
          // Fire and forget (async, no await)
          axios.post(sub.url, { event, payload }).catch(err => {
            console.error(`Webhook delivery failed for ${sub.url}:`, err.message);
          });
        }
      }
    } catch (error) {
      console.error('Webhook dispatch error:', error);
    }
  }
};
