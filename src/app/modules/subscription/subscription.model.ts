import { Schema, model } from 'mongoose';
import { ISubscription, SubscriptionModel } from './subscription.interface';
import {
  SubscriptionPlatform,
  SubscriptionStatus,
} from './subscription.constants';

const subscriptionSchema = new Schema<ISubscription, SubscriptionModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: Object.values(SubscriptionPlatform),
      required: true,
    },
    price: { type: Number, required: true },

    googleProductId: { type: String },
    appleProductId: { type: String },

    purchaseToken: { type: String },
    orderId: { type: String },
    transactionId: { type: String },
    originalTransactionId: { type: String },

    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
    },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date },
    canceledAt: { type: Date },
    renewalCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Subscription = model<ISubscription, SubscriptionModel>(
  'Subscription',
  subscriptionSchema
);
