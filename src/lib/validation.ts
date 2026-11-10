import { z } from 'zod';
import { ROLES } from '@/lib/auth';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  password: z.string(),
  role: z.enum(ROLES),
  department_id: z.preprocess(
    (value) => value === '' || value === undefined ? undefined : value,
    z.coerce.number().int().positive('Department is required'),
  ),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  role: z.enum(ROLES).optional(),
  department_id: z.coerce.number().int().positive('Department is required'),
  is_active: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string(),
});

export const announcementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  category: z.string().max(100).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  is_alert: z.boolean().optional().default(false),
});

const eventDateSchema = z.string().refine(
  (value) => value.trim() !== '' && !Number.isNaN(new Date(value).getTime()),
  'Invalid date format',
).transform((value) => new Date(value).toISOString());

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  event_date: eventDateSchema,
  location: z.string().max(255).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
});

export const querySchema = z.object({
  name: z.string().max(255).optional().nullable(),
  roll_no: z.string().max(100).optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(255),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const respondToQuerySchema = z.object({
  response: z.string().min(1, 'Response is required').max(5000),
  status: z.enum(['in_progress', 'resolved']).optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});

export const webhookSubscribeSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event required'),
});

export const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const announcementFiltersSchema = paginationSchema.extend({
  is_alert: z.coerce.boolean().optional(),
  department: z.string().max(100).optional(),
});

export const eventFiltersSchema = paginationSchema.extend({
  category: z.string().max(100).optional(),
});

export const queryFiltersSchema = paginationSchema.extend({
  status: z.enum(['open', 'in_progress', 'resolved']).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type QueryInput = z.infer<typeof querySchema>;
export type RespondToQueryInput = z.infer<typeof respondToQuerySchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type WebhookSubscribeInput = z.infer<typeof webhookSubscribeSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type AnnouncementFiltersInput = z.infer<typeof announcementFiltersSchema>;
export type EventFiltersInput = z.infer<typeof eventFiltersSchema>;
export type QueryFiltersInput = z.infer<typeof queryFiltersSchema>;