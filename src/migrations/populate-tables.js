/* eslint-disable no-unused-vars */

import { Card, List, Tag, sequelize } from "../models/index.js";

// Ajout de quelques listes
const list1 = await List.create({ title: "Liste des courses", position: 1 });
const list2 = await List.create({ title: "Liste des anniversaire", position: 2 });
const list3 = await List.create({ title: "Liste des choses à faire", position: 3 });

// Ajout de quelques tags
const tag1 = await Tag.create({ name: "Urgent", color: "#FF00FF" });
const tag2 = await Tag.create({ name: "Eco-friendly", color: "#00FF00" });
const tag3 = await Tag.create({ name: "En retard", color: "#FF0000" });

// Ajout de quelques cartes
const card1 = await Card.create({ content: "Savon", color: "#FF00FF", list_id: list1.id });
const card2 = await Card.create({ content: "Chartreuse", list_id: list1.id });
const card3 = await Card.create({ content: "Concombre", color: "#00FF00", list_id: list1.id });

const card4 = await Card.create({ content: "Dormir", color: "#FF0000", list_id: list2.id });
const card5 = await Card.create({ content: "Nourrir le chat", list_id: list2.id });
const card6 = await Card.create({ content: "Devenir le meilleur dresseur", list_id: list2.id });

const card7 = await Card.create({ content: "Maman le 01/01/1970", color: "#0000FF", list_id: list3.id });

// Ajout des tags sur les cartes
await card1.addTag(tag3);
await card1.addTag(tag1);
await card5.addTag(tag1);
await card4.addTag(tag2);

// On close la connexion
await sequelize.close();
console.log("✅ Seeding done with success!");
