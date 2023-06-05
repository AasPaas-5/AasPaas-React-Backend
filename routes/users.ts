import { router } from "../import";
import { catchAsync } from "../utils/catchAsync";
import { loginUser, registerUser } from "../controllers/users";
// import {
//   isLoggedIn,
//   isAuthor,
//   validateProduct,
//   isVerified,
//   isRegistered,
// } from "../middleware";

router.route("/register").post(catchAsync(loginUser));

router.route("/login").post(catchAsync(registerUser));

// router.get("/logout", isLoggedIn, users.logout);

// router.get("/profile", isLoggedIn, isRegistered, users.profilePage);

export default router;
