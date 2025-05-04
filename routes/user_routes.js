
import express from "express"
import { registerSchema } from "../validators/validate_user.js";
import { Register } from "../controllers/user_controller.js";
import { validate } from '../middleware/validation_middleware.js';

const router = express.Router();


router.route('/register-user').post(validate(registerSchema), Register)


export default router