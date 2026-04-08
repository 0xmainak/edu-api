import { Router } from "express";
import { addSchoolHandler, listSchoolsHandler } from "./school.controller.js";

const router = Router();

router.post("/addSchool", addSchoolHandler);
router.get("/listSchools", listSchoolsHandler);

export default router;
