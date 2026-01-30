import express from 'express';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionValidations } from './subscription.validation';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

// create subscription
router.post('/create', auth(USER_ROLES.ORGANIZER), validateRequest(SubscriptionValidations.createSubscriptionSchema), SubscriptionController.createSubscription);

// refund subscription
router.post('/refund/:id', auth(USER_ROLES.ORGANIZER), SubscriptionController.refundSubscription);

// get subs by id
router.get('/:id', auth(USER_ROLES.ORGANIZER), SubscriptionController.getSubscriptionById);

export const subscriptionRoutes = router;
