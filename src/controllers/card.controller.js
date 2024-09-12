import Joi from "joi";
import { Card, List } from "../models/index.js";
import { getColorSchema } from "./utils.js";

export async function getAllCards(req, res) {
  // Récupérer toutes les cartes en BDD
  const cards = await Card.findAll();
  // Si on renvoie toutes les cartes + tous les tags de ces cartes => réponse "lourde"
  // Si on a 5 cartes dans la BDD OK
  // Si on a 5000 cartes (2 * 5000 tags) ==> commence à faire lourd !
  // Dans une API, il faut trouver un juste milieu entre le côté "pratique" et les "performances"

  // Exemple ici : 
  // sans les tags : 1KB
  // avec les tags : 2KB
  // ===> C'est peanut ! Mais l'idée est importante.

  // Renvoyer les cartes
  res.json(cards);
}

export async function getOneCard(req, res) {
  // Récupérer l'ID de la carte
  const cardId = parseInt(req.params.id);

  // Vérifier que l'ID est valid
  if (isNaN(cardId)) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  // Récupérer la carte, et ses tags
  const card = await Card.findByPk(cardId, { include: "tags" }); // include par l'alias

  // Si la carte n'existe pas
  if (! card) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  // Si la carte existe
  res.json(card);
}

export async function getCardsOfList(req, res) {
  // Récupérer l'ID de la liste LISTE
  const listId = parseInt(req.params.id);

  // Vérifier que la listId est valide 
  if (isNaN(listId)) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  // Vérifier que la liste existe
  const list = await List.findByPk(listId, { include: "cards" });
  if (! list) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  // Renvoyer les cartes de la liste
  res.json(list.cards);
}

export async function createCard(req, res) {
  // Validation du body : 
  // - content (string | non vide | obligatoire)
  // - list_id (number | >1 | obligatoire)
  // - position (number | >1  | facultatif)
  // - color (string | code hexa | facultatif)

  const createCardSchema = Joi.object({
    content: Joi.string().min(1).required(),
    list_id: Joi.number().integer().min(1).required(),
    position: Joi.number().integer().min(1),
    color: getColorSchema()
  });

  // Si error => 400 avec le message d'erreur
  const { error } = createCardSchema.validate(req.body); // error = {} || null
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // On récupère les champs dont on va se servir
  const { content, list_id: listId, position = 1, color = null } = req.body;
  
  // { list_id: listId } ==> récupérer la valeur de 'list_id' et la mettre dans une variable 'listId' (renaming)
  // { position = 1 } ===> récupérer la valeur de 'position' et la mettre dans une variable 'position' AVEC une valeur par défaut de '1' si la valeur en question est undefined
  // { color = null } ===> récupérer la valeur de 'color' et la mettre dans une variable 'color' AVEC une valeur par défaut de 'null' si la valeur en question est undefined

  // Strictement équivalent à :
  // const content = req.body.content;
  // const listId = req.body.list_id;
  // const position = req.body.position || 1;
  // const color = req.body.color || null;

  // Récupérer la LISTE à partir de list_id
  const list = await List.findByPk(listId);

  // Si la LISTE n'existe => 404 
  if (! list) {
    return res.status(404).json({ error: "List not found. Please verify the provided id."});
  }

  // On créer alors la CARTE
  const createdCard = await Card.create({
    content,
    list_id: listId,
    position,
    color
  });

  // On renvoie cette carte
  res.status(201).json(createdCard);
}

export async function updateCard(req, res) {
  // Récupérer l'ID de la carte à modifier
  const cardId = parseInt(req.params.id);

  // Vérifier que l'ID n'est pas NaN => sinon 404
  if (isNaN(cardId)) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  // Récupérer la carte en BDD 
  const card = await Card.findByPk(cardId);

  // Si pas de carte ==> 404
  if (!card) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  // Valider le body de la requête
  // - content : string().min(1)
  // - position: number().integer().min(1)
  // - list_id : number().integer().min(1)
  // - color : reprendre le code precedent
  // ==> au moins fournir un des champs ! (.min(1))
  const createCardSchema = Joi.object({
    content: Joi.string().min(1),
    position: Joi.number().integer().min(1),
    list_id: Joi.number().integer().min(1),
    color: getColorSchema()
  }).min(1).message("Mising attributes: please provided at least 'content', 'position', 'list_id', 'color'");

  // Valider le body
  const { error } = createCardSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Récupérer les champs à utiliser 
  const { content, position, list_id, color } = req.body;

  // Si l'utilisateur a demander à modifier la list_id, ALORS on vérifie que cette liste existe
  if (list_id) {
    const list = await List.findByPk(list_id);
    if (!list) {
      return res.status(404).json({ error: "List not found. Please verify the provided id." });
    }
  }

  // On update la carte
  card.content = content || card.content;
  card.position = position || card.position;
  card.list_id = list_id || card.list_id;
  card.color = color || card.color;
  await card.save();

  // On renvoie la carte modifiée
  res.json(card);
}

export async function deleteCard(req, res) {
  // Récupérer l'ID de la carte à supprimer
  const cardId = parseInt(req.params.id);

  // Vérifier que l'ID est valide ==> sinon 404
  if (isNaN(cardId)) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  // Récupérer la carte en BDD
  const card = await Card.findByPk(cardId);

  // Vérifier que la carte existe ==> sinon 404
  if (!card) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  // Supprimer la carte
  await card.destroy();

  // Renvoyer une 204 (sans body)
  res.status(204).end();
}
