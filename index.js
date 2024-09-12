// Import des variables d'environnement
import "dotenv/config";

// Import des modules
import { rateLimit } from 'express-rate-limit';
import express from "express";
import cors from "cors";
import { router as apiRouter } from "./src/routers/index.js";

// Création de l'app
const app = express();

// Desactiver le header x-powered-by Express
app.disable("x-powered-by");

// Middleware pour autoriser les CORS requests
// (A la mano)
// app.use((req, res, next) => {
//   res.set("Access-Control-Allow-Origin", "http://localhost:5500");
//   next();
// });

// Autoriser les CORS depuis certains domaines 
app.use(cors("*")); // * = n'importe quel domaine (mauvaise pratique de sécurité, mais tellement pratique pour la facilité du cours)

// Ajout du rate limiter
app.use(rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100, // Limit each IP to 100 requests per `window` (here, per minute)
}));

// Ajout du body parser
app.use(express.urlencoded({ extended: false })); // Body parser pour les body des <form>
app.use(express.json({ limit: "10kb" })); // Body parser pour les body de type "JSON"

// Configuration du router
app.use("/api", apiRouter);

// Route de base
app.use(express.static("client/dist")); // index.html ==> "/"

// Lancement de l'application
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
