import { Router } from 'express';
import { UserController } from 'controllers/user.controller';

const router = Router();
const userController = new UserController();

router.get('/get-me', userController.getMe.bind(userController));

export default router;