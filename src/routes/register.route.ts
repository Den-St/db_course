import { Router } from 'express';
import { RegisterController } from 'controllers/register.controller';
import { validateRegister } from 'middleware/validation/users/validateRegister';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const registerController = new RegisterController();

router.post('/register', validateRegister, catchAsync(registerController.register));

export default router;
