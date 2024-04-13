import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
      old_password: Joi.when('password', {
        is: Joi.exist(),
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      password_confirmation: Joi.when('password', {
        is: Joi.exist(),
        then: Joi.string().required().valid(Joi.ref('password')),
        otherwise: Joi.forbidden(),
      }),
    },
  }),
  profileController.update,
);

export default profileRouter;
