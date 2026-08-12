import { Router } from "express";
import { getCurrentProject } from "../controllers/projectController.js";

const router = Router();

router.get("/project", getCurrentProject);

export default router;
