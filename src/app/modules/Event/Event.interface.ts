import { Types } from 'mongoose';

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
     isApproved: boolean; // set by admin
     isLockedAfterExpiration: boolean; // set by admin
     eventAttendeeLimit: number;
     registrationCount: number;
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
