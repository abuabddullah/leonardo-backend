import { Schema, model } from 'mongoose';
import { ERecordType, EReferenceModule, IHistoryTracker } from './HistoryTracker.interface';

const HistoryTrackerSchema = new Schema<IHistoryTracker>(
     {
          createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          recordType: { type: String, enum: Object.values(ERecordType), required: true },
          referenceModule: { type: String, enum: Object.values(EReferenceModule), required: true },
          referenceId: { type: Schema.Types.ObjectId, required: true, refPath: 'referenceModule' },
          isDeleted: { type: Boolean, default: false },
          deletedAt: { type: Date },
     },
     { timestamps: true },
);

HistoryTrackerSchema.pre('find', function (next) {
     this.find({ isDeleted: false });
     next();
});

HistoryTrackerSchema.pre('findOne', function (next) {
     this.findOne({ isDeleted: false });
     next();
});

HistoryTrackerSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const HistoryTracker = model<IHistoryTracker>('HistoryTracker', HistoryTrackerSchema);
