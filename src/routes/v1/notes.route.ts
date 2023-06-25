import { Router } from "express";
const router: Router = Router();
import {
          postNotes,
          getNotes,
          getNote,
          updateNote,
          deleteNote,
} from "../../controllers/notes.controller";

router.post("/notes", postNotes);
router.get("/notes", getNotes);
router.get("/note", getNote);
router.patch("/note", updateNote);
router.delete("/note", deleteNote);

export default router;
