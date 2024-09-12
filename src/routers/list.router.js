import { Router } from "express";

import * as listController from "../controllers/list.controller.js";
import { controllerWrapper as cw } from "./controller-wrapper.js";

export const router = Router();

router.get("/lists", cw(listController.getAllLists));
router.get("/lists/:id", cw(listController.getOneList));
router.post("/lists", cw(listController.createList));
router.delete("/lists/:id", cw(listController.deleteList));
router.patch("/lists/:id", cw(listController.updateList));

