import { Router } from "express";
const router: Router = Router();
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";
import { VerifyToken } from "../../middlewares/VerifyToken";
import {
          getUsers,
          getUserById,
          getAllUsers,
          updateUser,
          createUser,
          deleteUser,
          findAdmin,
          makeAdmin,
          removeAdmin,
          postUrls,
          getUserUrls,
          deleteUrl
} from "../../controllers/users.controller";

// here will be all the routes
router.get("/users", getUsers);
router.get("/user", VerifyToken, getUserById);
router.get("/user/urls", getUserUrls);
router.get("/users/all", VerifyToken, VerifyAdmin, getAllUsers);
router.get("/admin/:email", findAdmin);
router.put("/user", createUser);
router.patch("/users", VerifyToken, updateUser);
router.delete("/user/:email", VerifyToken, VerifyAdmin, deleteUser);
router.delete("/user/url/delete", VerifyToken, deleteUrl);
router.put("/user/admin", VerifyToken, VerifyAdmin, makeAdmin);
router.put("/user/removeAdmin", VerifyToken, VerifyAdmin, removeAdmin);
router.post("/user/urls", VerifyToken, postUrls);

export default router;
