
import express from "express"
import { registerSchema } from "../validators/validate_user.js";
import { Login, Logout, refreshAcessToken, Register, VerifyEmail } from "../controllers/user_controller.js";
import { validate } from '../middleware/validation_middleware.js';
import upload from "../middleware/multer.js";
import { Authentication } from "../middleware/authentication.js";

const router = express.Router();


router.route('/register-user')
    .post(upload.single("profilePicture"), validate(registerSchema), Register)

router.route('/verify-email-otp').post(VerifyEmail)

router.route('/login-user').post(Login)
router.route('/logout-user').post(Authentication,Logout)

router.route("/refresh-token").post(refreshAcessToken)

export default router
// router.post("/upload", upload.single("image"), uploadImage);