import { Schema, model } from 'mongoose';
import { IEvent } from './Event.interface';

const EventSchema = new Schema<IEvent>(
     {
          eventName: { type: String, required: true },
          eventType: { type: String, required: true },
          image: { type: String, required: true },
          images: { type: [String], required: true },
          eventQRImage: { type: String, required: false },
          eventDate: { type: String, required: true },
          eventTime: { type: String, required: true },
          eventDateTime: { type: Date, required: true },
          eventLocation: { type: String, required: true },
          eventDescription: { type: String, required: true },
          ageLimitMax: { type: Number, required: true },
          ageLimitMin: { type: Number, required: true },
          eventBrandColor: { type: String, required: true },
          eventThemeColor: { type: String, required: true },
          eventFontColor: { type: String, required: true },
          isVisibilityPublic: { type: Boolean, required: true },
          isApproved: { type: Boolean, required: true },
          isLockedAfterExpiration: { type: Boolean, required: true },
          eventAttendeeLimit: { type: Number, required: true },
          isDeleted: { type: Boolean, default: false },
          deletedAt: { type: Date },
     },
     { timestamps: true },
);

EventSchema.pre('find', function (next) {
     this.find({ isDeleted: false });
     next();
});

EventSchema.pre('findOne', function (next) {
     this.findOne({ isDeleted: false });
     next();
});

EventSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const Event = model<IEvent>('Event', EventSchema);
