import express from 'express';
import { EventController } from './Event.controller';
import auth from '../../middleware/auth';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import parseFileData from '../../middleware/parseFileData';
import { FOLDER_NAMES } from '../../../enums/files';
import validateRequest from '../../middleware/validateRequest';
import { EventValidation } from './Event.validation';
import { USER_ROLES } from '../../../enums/user';
import parseMultipleFileData from '../../middleware/parseMultipleFiledata';

const router = express.Router();

router.post(
     '/',
     auth(USER_ROLES.SUPER_ADMIN),
     fileUploadHandler(),
     parseFileData(FOLDER_NAMES.IMAGE),
     parseMultipleFileData(FOLDER_NAMES.IMAGES),
     validateRequest(EventValidation.createEventZodSchema),
     EventController.createEvent,
);

router.get('/admin', EventController.getAllEventsForAdmin);
router.get('/', EventController.getAllEvents);

router.get('/unpaginated', EventController.getAllUnpaginatedEvents);

router.delete('/hard-delete/:id', auth(USER_ROLES.SUPER_ADMIN), EventController.hardDeleteEvent);
router.get('/qr-route/:id', EventController.getEventByQr);

router.patch(
     '/:id',
     auth(USER_ROLES.SUPER_ADMIN),
     fileUploadHandler(),
     parseFileData(FOLDER_NAMES.IMAGE),
     parseMultipleFileData(FOLDER_NAMES.IMAGES),
     validateRequest(EventValidation.updateEventZodSchema),
     EventController.updateEvent,
);

router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN), EventController.deleteEvent);

router.get('/:id', EventController.getEventById);

export const EventRoutes = router;
