import { Router } from "express";
import documentIARoutes from "./document_ia.route";

const router = Router();

router.use('/document_ia', documentIARoutes);

export default router;