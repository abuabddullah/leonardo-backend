import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import SettingsRouter from '../app/modules/settings/settings.route';
import { HistoryTrackerRoutes } from '../app/modules/HistoryTracker/HistoryTracker.route';
import { RuleRoute } from '../app/modules/rule/rule.route';
import { WebsiteLogoRoutes } from '../app/modules/websiteLogo/websiteLogo.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { PackageRoutes } from '../app/modules/package/package.route';
import { subscriptionRoutes } from '../app/modules/subscription/subscription.route';
import { EventRoutes } from '../app/modules/Event/Event.route';

const router = express.Router();
const routes = [
     {
          path: '/auth',
          route: AuthRouter,
     },
     {
          path: '/users',
          route: UserRouter,
     },
     {
          path: '/settings',
          route: SettingsRouter,
     },
     {
          path: '/history-tracker',
          route: HistoryTrackerRoutes,
     },
     {
          path: '/rules',
          route: RuleRoute,
     },
     {
          path: '/website-logo',
          route: WebsiteLogoRoutes,
     },
     {
          path: '/faqs',
          route: FaqRoutes,
     },
     {
          path: '/packages',
          route: PackageRoutes,
     },
     {
          path: '/subscriptions',
          route: subscriptionRoutes,
     },
     {
          path: '/events',
          route: EventRoutes,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
