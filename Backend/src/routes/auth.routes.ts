import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, signupSchema } from '../validations/authSchemas.js';
import * as authController from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/signup', authLimiter, validate({ body: signupSchema }), authController.signup);
authRouter.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);
authRouter.post('/google', authLimiter, authController.googleLogin);
authRouter.post('/refresh', authLimiter, authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.post('/forgot-password', authLimiter, authController.forgotPassword);
authRouter.post('/reset-password', authLimiter, authController.resetPassword);
