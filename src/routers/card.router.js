import { Router } from "express";

import * as cardController from "../controllers/card.controller.js";
import { controllerWrapper as cw } from "./controller-wrapper.js";

export const router = Router();

router.get("/cards", cw(cardController.getAllCards));
router.get("/cards/:id", cw(cardController.getOneCard));

router.get("/lists/:id/cards", cw(cardController.getCardsOfList)); // Note : ici ou dans le router des lists, dur de choisir. Mon point de vu : cette liste renvoie des Card, je la mets dans le controller des cards.

router.post("/cards", cw(cardController.createCard));
router.patch("/cards/:id", cw(cardController.updateCard));
router.delete("/cards/:id", cw(cardController.deleteCard));
