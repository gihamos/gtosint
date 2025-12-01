import { Router } from 'express';
import { register, login, isAuth} from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/is-auth', isAuth);


export default router;