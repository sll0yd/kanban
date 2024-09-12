import { sequelize } from "../models/index.js";

// Suppression des tables
await sequelize.drop();

// Création des tables
await sequelize.sync();

// On close la connexion
await sequelize.close();
console.log("✅ Okanban tables created with success!");
