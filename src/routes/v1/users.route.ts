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
          deleteUrl,
          getUserUrlsWithoutUid,
          getUserUrlsParams,
          getUserUrlsBySlug,
          getSlug,
          getUrlSbyEmail,
          getUsersMail,
} from "../../controllers/users.controller";

// here will be all the routes
router.get("/users", VerifyToken, getUsers);
router.get("/user", getUserById);
router.get("/users/urls", getUserUrlsBySlug);
router.get("/user/urls/:uid", getUserUrlsParams);
router.get("/users/all", VerifyToken, VerifyAdmin, getAllUsers);
router.get("/users/usersMail", VerifyToken, getUsersMail);
router.get("/admin/:email", VerifyToken, findAdmin);
router.get("/users/allUrls/email", VerifyToken, VerifyAdmin, getUrlSbyEmail);
router.post("/user/urls/dup/q", getUserUrlsWithoutUid);
router.put("/user", createUser);
router.patch("/user/getSlug", VerifyToken, getSlug);
router.patch("/users", VerifyToken, updateUser);
router.delete("/user/:email", VerifyToken, VerifyAdmin, deleteUser);
router.delete("/user/url/delete", VerifyToken, deleteUrl);
router.put("/user/admin", VerifyToken, VerifyAdmin, makeAdmin);
router.put("/user/removeAdmin", VerifyToken, VerifyAdmin, removeAdmin);
router.post("/user/urls", VerifyToken, postUrls);

export default router;
