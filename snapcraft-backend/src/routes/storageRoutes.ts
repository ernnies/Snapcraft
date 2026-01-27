import { Router } from "express";
import {
  uploadWorkflow,
  downloadWorkflow,
} from "../controllers/storageController";
import { generateReport } from "../controllers/reportController";
import { verifyToken } from "../controllers/authController";

const router = Router();

router.post("/upload", verifyToken, uploadWorkflow);
router.get("/download/:rootHash", verifyToken, downloadWorkflow);
router.post("/report", verifyToken, generateReport);   // <-- now exported

export default router;