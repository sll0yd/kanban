import { Router } from "express";
import sanitizeHtml from "sanitize-html";

import { router as cardRouter } from "./card.router.js";
import { router as listRouter } from "./list.router.js";
import { router as tagRouter } from "./tag.router.js";

// Router principal de l'API
export const router = Router();

// Body XSS sanitizer
router.use((req, res, next) => {
  if (! req.body) { return next(); } // Si pas de body, rien à sanitizer, on passe à la suite

  // Pour chaque KEY dans req.body
  Object.keys(req.body) // req.body = { content: "...", position: 5, color: "..." }   // Object.keys(req.body) === ["content", "position", "color"]
    .forEach(key => {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key]);
      }
    });

  next();
});

// Brancher les routers secondaires
router.use(cardRouter);
router.use(listRouter);
router.use(tagRouter);

// Middleware 404
router.use((req, res) => {
  res.status(404).json({ error: "Resource not found." });
});
