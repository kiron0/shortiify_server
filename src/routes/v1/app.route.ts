import { Router } from "express";
const router: Router = Router();
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";
import { VerifyToken } from "../../middlewares/VerifyToken";

import {
  getAppName,
  updateAppName,
  addVisitor,
} from "../../controllers/app.controller";

router.get("/app/appName", getAppName);
router.get("/app/addVisitor", addVisitor);
router.patch("/app/changeAppName", VerifyToken, VerifyAdmin, updateAppName);

export default router;
