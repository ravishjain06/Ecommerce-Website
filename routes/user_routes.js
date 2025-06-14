
import express from "express"
import { registerSchema } from "../validators/validate_user.js";
import { getUserProfile, Login, Logout, Register, renewRefreshToken, updateUserProfile, VerifyEmail } from "../controllers/user_controller.js";
import { validate } from '../middleware/validation_middleware.js';
import upload from "../middleware/multer.js";
import { isUserAuthenticated } from "../utils/Auth.js";

const router = express.Router();


router.route('/register-user')
    .post(upload.single("profilePicture"),Register)

router.route('/verify-email-otp').post(VerifyEmail)
router.route('/login').post(Login)
router.route('/refresh-token').post(renewRefreshToken)
router.route('/logout').post(Logout)
router.route('/profile').get(isUserAuthenticated,getUserProfile)
router.route('/update/profile').put(upload.single("profilePicture"),isUserAuthenticated,updateUserProfile)



export default router
