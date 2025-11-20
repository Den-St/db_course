import { Router } from 'express';
import { AuthController } from 'controllers/auth.controller';
import { validateSignIn } from 'middleware/validation/users/validateSignIn';

const router = Router();
const authController = new AuthController();

router.post('/signin', validateSignIn, authController.signIn);

export default router;
