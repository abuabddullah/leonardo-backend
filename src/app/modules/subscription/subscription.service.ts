import { StatusCodes } from 'http-status-codes';
import { Package } from '../package/package.model';
import { ISubscription } from './subscription.interface';
import { Subscription } from './subscription.model';
import { verifyAppleReceipt, verifyGooglePurchase } from '../../../helpers/purchaseVerifyHelper';
import { AppleVerificationResult, GoogleVerificationResult } from '../../../types/purchase';
import { SubscriptionPlatform } from './subscription.constants';
import { User } from '../user/user.model';
import AppError from '../../../errors/AppError';

export const createSubscriptionIntoDB = async (payload: Partial<ISubscription> & { transactionReceipt?: string }) => {
     // check if the package is valid
     const pkg = await Package.findById(payload.package);
     if (!pkg) {
          throw new Error('Package does not exist');
     }

     let verificationResult: GoogleVerificationResult & AppleVerificationResult;

     if (payload.platform === SubscriptionPlatform.GOOGLE) {
          if (!payload.purchaseToken) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Purchase token is required for Google Play subscriptions');
          }
          if (!pkg.googleProductId) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Google Play product id is required for Google Play subscriptions');
          }
          verificationResult = await verifyGooglePurchase(payload.purchaseToken, pkg.googleProductId);
     } else if (payload.platform === SubscriptionPlatform.APPLE) {
          if (!payload.transactionReceipt) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Transaction receipt is required for Apple subscriptions');
          }
          if (!pkg.appleProductId) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Apple product id is required for Apple subscriptions');
          }
          verificationResult = await verifyAppleReceipt(payload.transactionReceipt, pkg.appleProductId);
     } else {
          throw new Error('Unsupported platform');
     }

     if (!verificationResult.valid) {
          return { success: false, message: 'Subscription verification failed' };
     }

     const subscription = await Subscription.create({
          user: payload.user,
          package: payload.package,
          platform: payload.platform,
          price: pkg.price,
          googleProductId: pkg.googleProductId,
          appleProductId: pkg.appleProductId,
          purchaseToken: payload.purchaseToken,
          orderId: verificationResult.orderId,
          transactionId: verificationResult.transactionId,
          originalTransactionId: verificationResult.originalTransactionId,
          status: verificationResult.status,
          startedAt: verificationResult.startedAt,
          expiresAt: verificationResult.expiresAt,
     });

     if (!subscription) {
          throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create subscription');
     }

     // update user subscription
     await User.findByIdAndUpdate(payload.user, {
          subscription: subscription._id,
     });

     return subscription;
};

export const SubscriptionServices = {
     createSubscriptionIntoDB,
};
