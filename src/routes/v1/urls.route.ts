import { Router } from "express";
const router: Router = Router();
import {
  getAllToDos,
  createUrls,
  deleteToDo,
  deleteToDoAdmin,
  completeToDo,
  getMyToDos,
  getMyToDosByTitle,
  getMyCompletedToDos,
  updateToDo,
} from "../../controllers/urls.controller";
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";
import { VerifyToken } from "../../middlewares/VerifyToken";

router.get("/toDos", getAllToDos);
router.patch("/createUrls", createUrls);
// router.delete("/toDoS", VerifyToken, deleteToDo);
// router.delete("/todoS/:id", VerifyToken, VerifyAdmin, deleteToDoAdmin);
// router.patch("/toDoS", VerifyToken, completeToDo);
// router.get("/myToDos", VerifyToken, getMyToDos);
// router.get("/myToDoS/search", VerifyToken, getMyToDosByTitle);
// router.get("/myToDoS/completed", VerifyToken, getMyCompletedToDos);
// router.patch("/toDos/updateToDoS/:id", VerifyToken, updateToDo);

export default router;
