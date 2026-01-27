import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { EventService } from './Event.service';

const createEvent = catchAsync(async (req: Request, res: Response) => {
     const result = await EventService.createEvent(req.body);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Event created successfully',
          data: result,
     });
});

const getAllEventsForAdmin = catchAsync(async (req: Request, res: Response) => {
     const result = await EventService.getAllEventsForAdmin(req.query);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Events retrieved successfully',
          data: result,
     });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
     const result = await EventService.getAllEvents(req.query);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Events retrieved successfully',
          data: result,
     });
});

const getAllUnpaginatedEvents = catchAsync(async (req: Request, res: Response) => {
     const result = await EventService.getAllUnpaginatedEvents();

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Events retrieved successfully',
          data: result,
     });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EventService.updateEvent(id, req.body);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Event updated successfully',
          data: result || undefined,
     });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EventService.deleteEvent(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Event deleted successfully',
          data: result || undefined,
     });
});

const hardDeleteEvent = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EventService.hardDeleteEvent(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Event deleted successfully',
          data: result || undefined,
     });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EventService.getEventById(id, req.user);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Event retrieved successfully',
          data: result || undefined,
     });
});

const getEventByQr = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EventService.getEventByQr(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Event retrieved successfully',
          data: result || undefined,
     });
});

// reportAgainstEventById,
const reportAgainstEventById = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EventService.reportAgainstEventById(id, req.body, req.user);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Event reported successfully',
          data: result || undefined,
     });
});

export const EventController = {
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
