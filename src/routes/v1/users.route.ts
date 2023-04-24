import { Router } from "express";
const router: Router = Router();
import { VerifyAdminDev } from "../../middlewares/VerifyAdminDev";
import { VerifyDev } from "../../middlewares/VerifyDev";
import { VerifyToken } from "../../middlewares/VerifyToken";
import {
          getUsers,
          getUserById,
          getAllUsers,
          updateUser,
          createUser,
          deleteUser,
          findAdmin,
          roleChange,
          postUrls,
          deleteUrl,
          getUserUrlsWithoutUid,
          getUserUrlsBySlug,
          getSlug,
          getUrlSbyEmail,
          getUsersMail,
} from "../../controllers/users.controller";

// here will be all the routes
router.get("/users", VerifyToken, getUsers);
router.get("/user", getUserById);
router.get("/users/urls", getUserUrlsBySlug);
router.get("/users/all", VerifyToken, VerifyAdminDev, getAllUsers);
router.get("/users/usersMail", VerifyToken, getUsersMail);
router.get("/users/role/find", VerifyToken, findAdmin);
router.get("/users/allUrls/email", VerifyToken, VerifyAdminDev, getUrlSbyEmail);
router.post("/user/urls/dup/q", getUserUrlsWithoutUid);
router.put("/user", createUser);
router.patch("/user/getSlug", VerifyToken, getSlug);
router.patch("/users", VerifyToken, updateUser);
router.delete("/user/deleteUser", VerifyToken, VerifyDev, deleteUser);
router.delete("/user/url/delete", VerifyToken, deleteUrl);
router.put("/user/roleChange", VerifyToken, VerifyDev, roleChange);
router.post("/user/urls", VerifyToken, postUrls);

export default router;
