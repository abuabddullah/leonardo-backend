import { Types } from 'mongoose';

export enum EEventStatus {
     PENDING = 'PENDING',
     APPROVED = 'APPROVED',
     REJECTED = 'REJECTED',
}

export interface IEvent {
     eventName: string;
     eventType: string; // conference, wedding
     image: string;
     images: string[];
     eventQRImage: string;
     eventDate: string;
     eventTime: string;
     eventDateTime: Date;
     eventLocation: string;
     eventDescription: string;
     ageLimitMax: number;
     ageLimitMin: number;
     eventBrandColor: string; // hex color set by admin
     eventThemeColor: string; // hex color
     eventFontColor: string; // hex color
     isVisibilityPublic: boolean; // default true
     eventStatus: EEventStatus;
     isLockedAfterExpiration: boolean; // set by admin
     eventAttendeeLimit: number;
     registrationCount: number;
     registrationVacancyCount: number;
     eventCode: number;
     createdBy: Types.ObjectId;
     createdAt: Date;
     updatedAt: Date;
     isDeleted: boolean;
     deletedAt?: Date;
}

export type IEventFilters = {
     searchTerm?: string;
};
