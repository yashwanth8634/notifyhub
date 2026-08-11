// @ts-nocheck

import { eventModel } from "@/models/eventModel";

export const eventService = {
  async findAll(filters = {}) {
    return eventModel.findAll(filters);
  },

  async create(user, data) {
    return eventModel.create({
      ...data,
      user_id: user.id,
    });
  },

  async update(user, id, data) {
    const existing = await eventModel.findById(id);

    if (!existing) {
      throw {
        status: 404,
        message: "Event not found",
        code: "NOT_FOUND",
      };
    }

    if (
      user.role !== "super_admin" &&
      user.role !== "principal" &&
      user.role !== "dean" &&
      existing.user_id !== user.id
    ) {
      throw {
        status: 403,
        message: "You cannot update this event",
        code: "FORBIDDEN",
      };
    }

    return eventModel.update(id, data);
  },

  async delete(user, id) {
    if (user.role !== "super_admin") {
      throw {
        status: 403,
        message: "Only Super Admin can delete events",
        code: "FORBIDDEN",
      };
    }

    const deleted = await eventModel.delete(id);

    if (!deleted) {
      throw {
        status: 404,
        message: "Event not found",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
    };
  },
};