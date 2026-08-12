import { Router } from "express";
import {
  getItems,
  getItemById,
  updateItemProgress,
} from "../controllers/itemController.js";

const router = Router();

router.get("/", getItems);
router.get("/:id", getItemById);
router.patch("/:id/progress", updateItemProgress);

export default router;
