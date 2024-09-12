import Joi from "joi";
import sanitizeHtml from 'sanitize-html';
import { List, sequelize } from "../models/index.js";

export async function getAllLists(req, res) {
  const lists = await List.findAll({
    order: [["position", "ASC"]],
    include: { association: "cards", include: "tags" }
  });

  // Praticité : on récupère toute la BDD (dans une variable "lists")
  // Performance : ne faites pas ça chez vous ! Ici, on cherche juste à se faciliter la vie pour la S13
  res.json(lists);
}

export async function getOneList(req, res) {
  // Récupérer l'ID de la liste à trouver
  const listId = parseInt(req.params.id);

  // Vérifier que listId est un entier valide
  if (isNaN(listId)) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  // Récupérer la liste en BDD
  const list = await List.findByPk(listId);

  // Si pas de liste => 404
  if (! list) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  // Sinon => renvoie la liste
  res.json(list);
}

export async function getOneListInsecure(req, res) {
  // Récupérer l'ID de la liste à trouver
  const listId = req.params.id; // (sans le parser ni le valider)

  // Récupérer la liste en BDD (sans le model List, avec directement "pg")
  const resultSequelize = await sequelize.query(`SELECT * FROM "list" WHERE "id" = ${listId}`);

  // `SELECT * FROM "list" WHERE "id" = ${listId}`
  // `SELECT * FROM "list" WHERE "id" = 1; DROP TABLE card_has_tag; --`
  // listId ======>>>>  1; DROP TABLE card_has_tag; --
  const resultPg = resultSequelize[1];
  const list = resultPg.rows[0];

  // Sinon => renvoie la liste
  res.json(list);

  // Pour se prémunir de l'injection :
  // 1) Never trust user input 
  //    - prendre le temps de valider le listId récupéré par req.params

  // 2) Pour les requêtes à la BDD
  //    - soit l'ORM est à jour
  //    - si à la main, utiliser les requêtes paramétrés (requêtes préparées)

  // ❌ const resultSequelize = await sequelize.query(`SELECT * FROM "list" WHERE "id" = ${listId}`);
  // ✅ const resultSequelize = await sequelize.query(`SELECT * FROM "list" WHERE "id" = $1`, [listId]);
}

export async function createList(req, res) {
  // 1. Récupérer les données du body
  const { title, position } = req.body;

  // 2. Valider les données du body
  // 2.1. Vérifier que le 'title' est une string et qu'elle est non vide
  if (typeof title !== "string" || title.length === 0) {
    res.status(400).json({ error: "Property 'title' should be a non empty string." });
    return; // Ne pas oublier le return (ou le else) pour arrêter la fonction

    // res.json() = renvoie la réponse HTTP au client
    // res.send() = idem
    // res.render() = idem
    // return = arrête le code, la fonction

    // Sinon : Cannot send headers after they have been sent to the client
  }

  // 2.1.XSS : valider que le title ne contienne pas d'injection XSS
  const sanitizedTitle = sanitizeHtml(title);

  // 2.2. Vérifier que, s'il est fourni, la position est un entier positif
  if (position && (! Number.isInteger(position) || position <= 0)) {
    res.status(400).json({ error: "Property 'position', when provided, should be a positive integer." });
    return; // Ne pas oublier le return (ou le else) pour arrêter la fonction
  }

  // Créer la liste en BDD
  const createdList = await List.create({ // L'ORM Sequelize gère le cas où la valeur dans 'title' est un code malveillant de type injection SQL
    title: sanitizedTitle,
    position: position || 1
  });

  // Répondre avec du JSON les données de la liste
  res.status(201).json(createdList);
}

export async function deleteList(req, res) {
  // Récupérer l'ID de la liste à supprimer
  const listId = parseInt(req.params.id);

  // Récupérer la liste à supprimer en BDD
  const list = await List.findByPk(listId);

  // Vérifier si la liste existe, sinon => 404
  if (! list) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  // Supprime la liste
  await list.destroy();

  // Renvoyer une réponse positive (204) sans contenu
  res.status(204).end();
}

export async function updateList(req, res) {
  // Récupérer l'ID de la liste à mettre à jour
  const listId = parseInt(req.params.id);

  // Récupérer la liste en BDD
  const list = await List.findByPk(listId);

  // Si la liste n'existe pas, => 404
  if (! list) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  // Valider les donénes : 
  // - on veut que si un nouveau titre est fourni, alors ça soit une string non vide
  // - on veut que si une nouvelle "position" est fournie, alors ça soit un entier positif
  const updateListSchema = Joi.object({
    title: Joi.string().min(1), // une string d'au moins un caractère
    position: Joi.number().integer().min(1) // un integer supérieur ou égal à 1
  }).min(1).message("Please provide at least 'title' or 'position' property");
  
  // La validation des 2 champs est fait avec un seul .validate()
  const { error } = updateListSchema.validate(req.body);
  if (error) {
    // => Sinon : 400 (Bad Request)
    return res.status(400).json({ error: error.message });
  }

  // Si OK : on update la liste en BDD
  list.title = req.body.title || list.title; // Met le nouveau titre, et s'il n'est pas fourni, reste sur le titre actuel
  list.position = req.body.position || list.position;
  await list.save(); // Sauvegarde la list en BDD

  // On renvoie la liste updated
  res.json(list);
}
