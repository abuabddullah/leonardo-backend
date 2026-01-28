import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { EvenRegistrationService } from './EvenRegistration.service';

const createEvenRegistration = catchAsync(async (req: Request, res: Response) => {
     const result = await EvenRegistrationService.createEvenRegistration(req.body, req.user as any);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'EvenRegistration created successfully',
          data: result,
     });
});

const getAllEvenRegistrationsForAdmin = catchAsync(async (req: Request, res: Response) => {
     const result = await EvenRegistrationService.getAllEvenRegistrationsForAdmin(req.query);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'EvenRegistrations retrieved successfully',
          data: result,
     });
});

const getAllEvenRegistrations = catchAsync(async (req: Request, res: Response) => {
     const result = await EvenRegistrationService.getAllEvenRegistrations(req.query);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'EvenRegistrations retrieved successfully',
          data: result,
     });
});

const getAllUnpaginatedEvenRegistrations = catchAsync(async (req: Request, res: Response) => {
     const result = await EvenRegistrationService.getAllUnpaginatedEvenRegistrations();

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'EvenRegistrations retrieved successfully',
          data: result,
     });
});

const updateEvenRegistration = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EvenRegistrationService.updateEvenRegistration(id, req.body);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'EvenRegistration updated successfully',
          data: result || undefined,
     });
});

const deleteEvenRegistration = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EvenRegistrationService.deleteEvenRegistration(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'EvenRegistration deleted successfully',
          data: result || undefined,
     });
});

const hardDeleteEvenRegistration = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EvenRegistrationService.hardDeleteEvenRegistration(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'EvenRegistration deleted successfully',
          data: result || undefined,
     });
});

const getEvenRegistrationById = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await EvenRegistrationService.getEvenRegistrationById(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'EvenRegistration retrieved successfully',
          data: result || undefined,
     });
});

export const EvenRegistrationController = {
     createEvenRegistration,
     getAllEvenRegistrations,
     getAllEvenRegistrationsForAdmin,
     getAllUnpaginatedEvenRegistrations,
     updateEvenRegistration,
     deleteEvenRegistration,
     hardDeleteEvenRegistration,
     getEvenRegistrationById,
};
