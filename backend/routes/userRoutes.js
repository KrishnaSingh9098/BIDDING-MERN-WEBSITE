import { register } from "../controllers/userController.js"; // Correctly import the register function
import express from "express"; // Correctly import express

const router = express.Router(); // Create a new router instance

// Define the POST route for register
router.post("/register", register);

// Export the router
export default router;
