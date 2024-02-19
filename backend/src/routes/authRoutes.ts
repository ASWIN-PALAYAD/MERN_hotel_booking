import express from 'express';
import { loginUser,validateToken,logout } from '../controllers/authControllers';
import { check } from 'express-validator';
import verifyToken from '../middlewares/auth';

const router = express.Router(); 


router.post('/login',[
    check('email',"Email is required").isEmail(),
    check('password',"Password with 6 or more charactors required").isLength({
        min:6,
    })
],loginUser);

router.get('/validate-token',verifyToken,validateToken);
router.post('/logout',logout);

export default router;