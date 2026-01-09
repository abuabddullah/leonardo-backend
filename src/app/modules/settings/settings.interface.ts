import { Document } from 'mongoose';

// Define the interface for your settings
export interface ISettings extends Document {
     primaryColor: string;
}
