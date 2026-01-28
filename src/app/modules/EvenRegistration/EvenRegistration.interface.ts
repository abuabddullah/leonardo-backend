import { Types } from 'mongoose';
export enum EAttendingAs {
     VOLUNTEER = 'VOLUNTEER',
     GUEST = 'GUEST',
}
export interface IEvenRegistration {
     event: Types.ObjectId;
     user: Types.ObjectId;
     attendingAs: EAttendingAs;
     noOfAttendees: number;
     specialRequest: string;
     userReportAgainstEventRegistration?: string;
     isProfileVisibleToAttendees: boolean;
     isAllowedChatAndMatchWithAttendees: boolean;
     createdAt: Date;
     updatedAt: Date;
     isDeleted: boolean;
     deletedAt?: Date;
}

export type IEvenRegistrationFilters = {
     searchTerm?: string;
};
