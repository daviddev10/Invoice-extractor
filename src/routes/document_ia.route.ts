import { Router } from "express";
import multer from "multer";
import { GeminiParseController } from "../controllers/gemini_parse/gemini-parse.controller";

const router = Router();
const geminiParseController = new GeminiParseController();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/gemini-parse', upload.single("file"), geminiParseController.onParseDocument);

export default router;