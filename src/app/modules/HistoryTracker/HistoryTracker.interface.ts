import { Types } from 'mongoose';

export enum ERecordType {
     BLOCK_USER = 'BLOCK_USER',
     MATCH_USER = 'MATCH_USER',
     REPORT_USER = 'REPORT_USER',
}

export enum EReferenceModule {
     USER = 'User',
}

export interface IHistoryTracker {
     createdBy: Types.ObjectId;
     recordType: ERecordType;
     referenceModule: EReferenceModule;
     referenceId: Types.ObjectId;
     createdAt: Date;
     updatedAt: Date;
     isDeleted: boolean;
     deletedAt?: Date;
}

export type IHistoryTrackerFilters = {
     searchTerm?: string;
};
