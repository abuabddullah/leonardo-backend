import { Request, Response, NextFunction } from 'express';
import { SubscriptionServices } from './subscription.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IJwtData } from '../../../types/auth';

// create subscription
const createSubscription = catchAsync(async (req: Request, res: Response) => {
     const result = await SubscriptionServices.createSubscriptionIntoDB({
          ...req.body,
          user: (req.user as IJwtData)?.id,
     });

     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Subscription created successfully',
          data: result,
     });
});

// get subscription by id
const getSubscriptionById = catchAsync(async (req: Request, res: Response) => {
     const result = await SubscriptionServices.getSubscriptionById(req.params.id);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Subscription retrieved successfully',
          data: result,
     });
});

// refundSubscription
const refundSubscription = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await SubscriptionServices.refundSubscription(id, req.user as IJwtData);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Subscription refunded successfully',
          data: result,
     });
});

export const SubscriptionController = {
     createSubscription,
     getSubscriptionById,
     refundSubscription,
};
