import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IEvenRegistration } from './EvenRegistration.interface';
import { EvenRegistration } from './EvenRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { USER_ROLES } from '../../../enums/user';
import { Event } from '../Event/Event.model';
import mongoose from 'mongoose';
import { emailTemplate } from '../../../shared/emailTemplate';
import { emailHelper } from '../../../helpers/emailHelper';
import { User } from '../user/user.model';

const createEvenRegistration = async (payload: IEvenRegistration, user: { id: string; role: USER_ROLES }): Promise<IEvenRegistration> => {
     const isExistUser = await User.isExistUserById(user.id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }
     const isExistEvent = await Event.findOne({ _id: new mongoose.Types.ObjectId(payload.event), isDeleted: false, isApproved: true, isVisibilityPublic: true, eventDateTime: { $gte: new Date() } });
     if (!isExistEvent) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Event not found.');
     }
     const isAlreadyRegistered = await EvenRegistration.findOne({ event: new mongoose.Types.ObjectId(payload.event), user: new mongoose.Types.ObjectId(isExistUser.id) });
     if (isAlreadyRegistered) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'You have already registered for this event.');
     }

     const session = await mongoose.startSession();

     try {
          session.startTransaction();

          const result = await EvenRegistration.create([payload], { session });

          const createdRegistration = result[0];

          await Event.findByIdAndUpdate(payload.event, { $inc: { registrationCount: 1 } }, { session });

          if (!createdRegistration) {
               throw new AppError(StatusCodes.NOT_FOUND, 'EvenRegistration not found.');
          }

          await session.commitTransaction();
          session.endSession();

          // send email of qr code via mail

          const values: {
               name: string;
               event: string;
               qrCode: string;
               email: string;
          } = {
               name: isExistUser.name,
               event: isExistEvent.eventName,
               qrCode: isExistEvent.eventQRImage,
               email: isExistUser.email,
          };
          const createAccountTemplate = emailTemplate.eventRegistration(values);
          emailHelper.sendEmail(createAccountTemplate);

          return createdRegistration;
     } catch (error) {
          await session.abortTransaction();
          session.endSession();
          throw error;
     }
};

const getAllEvenRegistrationsForAdmin = async (query: Record<string, any>): Promise<{ meta: { total: number; page: number; limit: number }; result: IEvenRegistration[] }> => {
     const queryBuilder = new QueryBuilder(EvenRegistration.find(), query);
     const result = await queryBuilder.filter().sort().paginate().fields().modelQuery;
     const meta = await queryBuilder.countTotal();
     return { meta, result };
};
const getAllEvenRegistrations = async (query: Record<string, any>): Promise<{ meta: { total: number; page: number; limit: number }; result: IEvenRegistration[] }> => {
     const queryBuilder = new QueryBuilder(EvenRegistration.find({ isDeleted: false, isProfileVisibleToAttendees: true }).populate('user', 'name image'), query);
     const result = await queryBuilder.filter().sort().paginate().fields().modelQuery;
     const meta = await queryBuilder.countTotal();
     return { meta, result };
};

const getAllUnpaginatedEvenRegistrations = async (): Promise<IEvenRegistration[]> => {
     const result = await EvenRegistration.find({ isDeleted: false, isProfileVisibleToAttendees: true });
     return result;
};

const updateEvenRegistration = async (id: string, payload: Partial<IEvenRegistration>): Promise<IEvenRegistration | null> => {
     const isExist = await EvenRegistration.findById(id);
     if (!isExist) {
          throw new AppError(StatusCodes.NOT_FOUND, 'EvenRegistration not found.');
     }
     return await EvenRegistration.findByIdAndUpdate(id, payload, { new: true });
};

const deleteEvenRegistration = async (id: string): Promise<IEvenRegistration | null> => {
     const result = await EvenRegistration.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'EvenRegistration not found.');
     }
     result.isDeleted = true;
     result.deletedAt = new Date();
     await result.save();
     return result;
};

const hardDeleteEvenRegistration = async (id: string): Promise<IEvenRegistration | null> => {
     const result = await EvenRegistration.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'EvenRegistration not found.');
     }
     return result;
};

const getEvenRegistrationById = async (id: string): Promise<IEvenRegistration | null> => {
     const result = await EvenRegistration.findById(id);
     return result;
};

export const EvenRegistrationService = {
     createEvenRegistration,
     getAllEvenRegistrationsForAdmin,
     getAllEvenRegistrations,
     getAllUnpaginatedEvenRegistrations,
     updateEvenRegistration,
     deleteEvenRegistration,
     hardDeleteEvenRegistration,
     getEvenRegistrationById,
};
