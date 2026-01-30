import  express  from "express";
import { login, logout, register } from "../controllers/authControllers.js";

const router = express.Router();

// authentication requests
router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout)

export default router;