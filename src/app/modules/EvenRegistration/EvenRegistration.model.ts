import { Schema, model } from 'mongoose';
import { IEvenRegistration } from './EvenRegistration.interface';
import { EAttendingAs } from './EvenRegistration.interface';

const EvenRegistrationSchema = new Schema<IEvenRegistration>(
     {
          event: { type: Schema.Types.ObjectId, required: true, ref: 'Event' },
          user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
          attendingAs: { type: String, enum: EAttendingAs, required: true },
          noOfAttendees: { type: Number, required: true },
          specialRequest: { type: String, required: true },
          userReportAgainstEventRegistration: { type: String },
          isProfileVisibleToAttendees: { type: Boolean, required: true },
          isAllowedChatAndMatchWithAttendees: { type: Boolean, required: true },
          isDeleted: { type: Boolean, default: false },
          deletedAt: { type: Date },
     },
     { timestamps: true },
);

EvenRegistrationSchema.pre('find', function (next) {
     this.find({ isDeleted: false });
     next();
});

EvenRegistrationSchema.pre('findOne', function (next) {
     this.findOne({ isDeleted: false });
     next();
});

EvenRegistrationSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const EvenRegistration = model<IEvenRegistration>('EvenRegistration', EvenRegistrationSchema);
