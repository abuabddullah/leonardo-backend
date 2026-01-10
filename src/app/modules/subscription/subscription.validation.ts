import { z } from 'zod';
import { SubscriptionPlatform } from './subscription.constants';

export const createSubscriptionSchema = z.object({
  body: z.object({
    package: z
      .string()
      .min(24, 'Invalid package ID')
      .nonempty('Package ID is required'),
    platform: z.nativeEnum(SubscriptionPlatform),
    purchaseToken: z
      .string()
      .min(20, 'Purchase token too short')
      .max(255, 'Purchase token too long')
      .regex(/^[A-Za-z0-9._-]+$/, 'Invalid purchase token')
      .optional(),
    transactionReceipt: z
      .string()
      .min(100, 'Receipt too short')
      .max(5000, 'Receipt too long')
      .regex(/^[A-Za-z0-9+/=]+$/, 'Invalid receipt format')
      .optional(),
  }),
});

export const SubscriptionValidations = {
  createSubscriptionSchema,
};
