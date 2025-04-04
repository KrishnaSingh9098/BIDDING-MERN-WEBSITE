import { fetchLeaderBoard, getProfile, login, logout, register } from "../controllers/userController.js"; // Correctly import the register function
import express from "express"; // Correctly import express
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router(); // Create a new router instance

// Define the POST route for register
router.post("/register", register);
router.post("/login", login)
// router.get("/me",isAuthenticated, getProfile)
router.get("/profile", isAuthenticated, (req, res) => {
    // Access the authenticated user from `req.User`
    res.json({
        success: true,
        user: req.User
    });
});
router.get("/logout",isAuthenticated, logout)
router.get("/leaderBoard", fetchLeaderBoard)

// Export the router
export default router;
