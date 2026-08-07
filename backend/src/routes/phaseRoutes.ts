import { Router } from "express";
import { getPhases, getPhaseById } from "../controllers/phaseController.js";

const router = Router();

router.get("/", getPhases);
router.get("/:phaseId", getPhaseById);

export default router;
