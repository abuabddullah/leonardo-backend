import { model, Schema } from 'mongoose';
import { IPackage, PackageModel } from './package.interface';
import { PackageInterval } from './package.constant';

const packageSchema = new Schema<IPackage, PackageModel>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    features: { type: [String], required: true },
    interval: {
      type: String,
      enum: Object.values(PackageInterval),
      default: PackageInterval.MONTH,
    },
    googleProductId: { type: String, default: '' },
    appleProductId: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Package = model<IPackage, PackageModel>('Package', packageSchema);
