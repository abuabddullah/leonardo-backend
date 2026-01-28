import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IEvent } from './Event.interface';
import { Event } from './Event.model';
import QueryBuilder from '../../builder/QueryBuilder';
import unlinkFile from '../../../shared/unlinkFile';
import mongoose from 'mongoose';
import { EPermissionType } from '../rule/rule.interface';
import { RuleService } from '../rule/rule.service';
import { USER_ROLES } from '../../../enums/user';
import { generateQRCode } from '../../../utils/generateQRCode';
import { EvenRegistration } from '../EvenRegistration/EvenRegistration.model';
import generateOTP from '../../../utils/generateOTP';

const createEvent = async (payload: IEvent, user: { id: string }): Promise<IEvent> => {
     let result;
     try {
          // make the eventDateTime from eventDate and eventTime
          payload.eventDateTime = new Date(`${payload.eventDate} ${payload.eventTime}`);
          // validate its of future
          if (payload.eventDateTime < new Date()) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Event date and time must be in the future.');
          }
          payload.createdBy = new mongoose.Types.ObjectId(user.id);
          payload.eventCode = generateOTP(4);
          result = await Event.create(payload);
          if (!result) {
               throw new AppError(StatusCodes.NOT_FOUND, 'Event not found.');
          }
          // generate qr code
          const qrCode = await generateQRCode(result._id.toString(), result.eventCode.toString());
          result.eventQRImage = qrCode.qrImagePath;
          await result.save();
          return result;
     } catch (error) {
          if (payload.image) {
               unlinkFile(payload.image);
          }
          if (result?.eventQRImage) {
               unlinkFile(result?.eventQRImage);
          }
          if (payload.images && payload.images.length > 0) {
               payload.images.forEach((image) => {
                    unlinkFile(image);
               });
          }
          throw error;
     }
};

const getAllEventsForAdmin = async (query: Record<string, any>): Promise<{ meta: { total: number; page: number; limit: number }; result: IEvent[] }> => {
     const queryBuilder = new QueryBuilder(Event.find(), query);
     const result = await queryBuilder.filter().search(['eventName']).sort().paginate().fields().modelQuery;
     const meta = await queryBuilder.countTotal();
     return { meta, result };
};

const getAllEvents = async (
     query: Record<string, any>,
): Promise<{
     meta: { total: number; page: number; limit: number };
     result: IEvent[];
}> => {
     const queryBuilder = new QueryBuilder(Event.find({ isDeleted: false, isApproved: true, isVisibilityPublic: true }), query);

     let result = await queryBuilder.filter().search(['eventName']).sort().paginate().fields().modelQuery;

     const adminEventLockPermissionRule = await RuleService.getPermissionFromDB(EPermissionType.IS_EXPIRED_EVENTS_AUTO_LOCK);

     if (adminEventLockPermissionRule?.permission) {
          const presentTime = new Date();

          // find expired events
          const expiredEvents = result.filter((event) => event.eventDateTime && new Date(event.eventDateTime) < presentTime);

          // update all expired events in DB
          if (expiredEvents.length > 0) {
               await Event.updateMany(
                    {
                         _id: { $in: expiredEvents.map((event) => event._id) },
                    },
                    {
                         $set: { isLockedAfterExpiration: true },
                    },
               );
          }

          // remove locked/expired events from returned result
          result = result.filter((event) => !(event.eventDateTime && new Date(event.eventDateTime) < presentTime));
     }

     const meta = await queryBuilder.countTotal();

     return { meta, result };
};

const getAllUnpaginatedEvents = async (): Promise<IEvent[]> => {
     const result = await Event.find({ isDeleted: false, isApproved: true, isVisibilityPublic: true });
     return result;
};

const updateEvent = async (id: string, payload: Partial<IEvent>) => {
     try {
          const isExist = await Event.findById(id);
          if (!isExist) {
               throw new AppError(StatusCodes.NOT_FOUND, 'Event not found.');
          }

          if (payload.eventDate || payload.eventTime) {
               if (payload.eventDate && !payload.eventTime) {
                    payload.eventDateTime = new Date(`${payload.eventDate} ${isExist.eventTime || '00:00'}`);
               } else if (payload.eventTime && !payload.eventDate) {
                    payload.eventDateTime = new Date(`${isExist.eventDate} ${payload.eventTime}`);
               } else if (payload.eventDate && payload.eventTime) {
                    payload.eventDateTime = new Date(`${payload.eventDate} ${payload.eventTime}`);
               }
               // validate its of future
               if (payload.eventDateTime && payload.eventDateTime < new Date()) {
                    throw new AppError(StatusCodes.BAD_REQUEST, 'Event date and time must be in the future.');
               }
          }

          if (payload.image && isExist.image) {
               unlinkFile(isExist.image);
          }
          if (payload.eventQRImage && isExist.eventQRImage) {
               unlinkFile(isExist.eventQRImage);
          }
          if (isExist.images && isExist.images.length > 0 && payload.images && payload.images.length > 0) {
               isExist.images.forEach((image) => {
                    unlinkFile(image);
               });
          }

          return await Event.findByIdAndUpdate(id, payload, { new: true });
     } catch (error) {
          if (payload.image) {
               unlinkFile(payload.image);
          }
          if (payload.eventQRImage) {
               unlinkFile(payload.eventQRImage);
          }
          if (payload.images && payload.images.length > 0) {
               payload.images.forEach((image) => {
                    unlinkFile(image);
               });
          }
     }
};

const deleteEvent = async (id: string): Promise<IEvent | null> => {
     const result = await Event.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Event not found.');
     }
     result.isDeleted = true;
     result.deletedAt = new Date();
     await result.save();
     return result;
};

const hardDeleteEvent = async (id: string): Promise<IEvent | null> => {
     const result = await Event.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Event not found.');
     }

     if (result.image) {
          unlinkFile(result.image);
     }
     if (result?.eventQRImage) {
          unlinkFile(result?.eventQRImage);
     }
     if (result.images && result.images.length > 0) {
          result.images.forEach((image) => {
               unlinkFile(image);
          });
     }
     return result;
};

const getEventById = async (id: string, user: any): Promise<IEvent | null> => {
     const result = await Event.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Event not found.');
     }
     const adminEventLockPermissionRule = await RuleService.getPermissionFromDB(EPermissionType.IS_EXPIRED_EVENTS_AUTO_LOCK);
     if (adminEventLockPermissionRule && adminEventLockPermissionRule.permission) {
          result.isLockedAfterExpiration = true;
          await result.save();
     }
     // if eventDateTime < present time
     const presentTime = new Date();
     const isEventPassed = result.eventDateTime && new Date(result.eventDateTime) < presentTime;

     if (user.role !== USER_ROLES.SUPER_ADMIN && isEventPassed && result.isLockedAfterExpiration) {
          throw new AppError(StatusCodes.FORBIDDEN, 'Event is locked');
     }
     return result;
};

const getEventByQr = async (eventId: string) => {
     const result = await Event.findById(eventId).select('eventType image images eventLocation eventDateTime eventDescription isApproved isLocked registrationCount');
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Event not found.');
     }
     const adminEventLockPermissionRule = await RuleService.getPermissionFromDB(EPermissionType.IS_EXPIRED_EVENTS_AUTO_LOCK);
     if (adminEventLockPermissionRule && adminEventLockPermissionRule.permission) {
          result.isLockedAfterExpiration = true;
          await result.save();
     }
     // if eventDateTime < present time
     const presentTime = new Date();
     const isEventPassed = result.eventDateTime && new Date(result.eventDateTime) < presentTime;

     if (isEventPassed || result.isLockedAfterExpiration) {
          throw new AppError(StatusCodes.FORBIDDEN, 'Event is passed or locked');
     }

     const guests = await EvenRegistration.find({ event: new mongoose.Types.ObjectId(eventId), isProfileVisibleToAttendees: true })
          .select('user')
          .populate('user', 'name image')
          .limit(6);

     (result as any).guests = guests;

     return result;
};

const reportAgainstEventById = async (eventId: string, reportData: { reason: string }, user: { id: string } | any) => {
     const result = await Event.findById(eventId).select('eventType image images eventLocation eventDateTime eventDescription isApproved isLocked registrationCount');
     if (!result || (result && !result.isApproved)) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Event not found.');
     }
     const isUserRegisteredEvent = await EvenRegistration.findOne({
          event: new mongoose.Types.ObjectId(eventId),
          user: new mongoose.Types.ObjectId(user.id),
     });
     if (!isUserRegisteredEvent) {
          throw new AppError(StatusCodes.FORBIDDEN, 'You are not a guest to this event.');
     }

     // update the reason
     await EvenRegistration.findByIdAndUpdate(isUserRegisteredEvent._id, {
          userReportAgainstEventRegistration: reportData.reason,
     });
     return isUserRegisteredEvent.userReportAgainstEventRegistration;
};

export const EventService = {
     createEvent,
     getAllEvents,
     getAllEventsForAdmin,
     getAllUnpaginatedEvents,
     updateEvent,
     deleteEvent,
     hardDeleteEvent,
     getEventById,
     getEventByQr,
     reportAgainstEventById,
};
