import { eventModel } from '@/models/eventModel';
import { AuthError } from '@/lib/auth';
import { User, Event, EventFilters } from '@/types';

interface EventCreateData {
  title: string;
  description: string;
  event_date: string;
  location?: string | null;
  category?: string | null;
}

interface EventUpdateData {
  title?: string | null;
  description?: string | null;
  event_date?: string | null;
  location?: string | null;
  category?: string | null;
}

interface AuthUser {
  id: number;
  role: string;
}

export const eventService = {
  async findAll(filters: EventFilters = {}): Promise<Event[]> {
    return eventModel.findAll(filters);
  },

  async create(user: AuthUser, data: EventCreateData): Promise<Event> {
    return eventModel.create({
      ...data,
      user_id: user.id,
    });
  },

  async update(user: AuthUser, id: number, data: EventUpdateData): Promise<Event | null> {
    const existing = await eventModel.findById(id);

    if (!existing) {
      throw new AuthError('NOT_FOUND', 404, 'Event not found');
    }

    const canUpdate = user.role === 'super_admin' || 
                      user.role === 'principal' || 
                      user.role === 'dean' || 
                      existing.user_id === user.id;

    if (!canUpdate) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot update this event');
    }

    return eventModel.update(id, data);
  },

  async delete(user: AuthUser, id: number): Promise<{ success: boolean }> {
    if (user.role !== 'super_admin') {
      throw new AuthError('FORBIDDEN', 403, 'Only Super Admin can delete events');
    }

    const deleted = await eventModel.delete(id);

    if (!deleted) {
      throw new AuthError('NOT_FOUND', 404, 'Event not found');
    }

    return { success: true };
  },
};