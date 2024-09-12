import Joi from "joi";
import { Tag, Card } from "../models/index.js";
import { getColorSchema } from "./utils.js";


export async function getAllTags(req, res) {
  const tags = await Tag.findAll();
  return res.json(tags);
}

export async function getOneTag(req, res) {
  const tagId = parseInt(req.params.id);
  if (isNaN(tagId)) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  res.json(tag);
}

export async function deleteTag(req, res) {
  const tagId = parseInt(req.params.id);
  if (isNaN(tagId)) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  await tag.destroy();

  res.status(204).end();
}

export async function createTag(req, res) {
  const createTagSchema = Joi.object({
    name: Joi.string().min(1).required(),
    color: getColorSchema()
  });

  const { error } = createTagSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // On vérifie s'il n'existe pas déjà un tag avec le même nom, auquel cas on envoie une 409 (Conflit)
  const isTagNameAlreadyTaken = !! await Tag.count({ where: { name: req.body.name }}); // 0 (false) ou 1 (true)
  if (isTagNameAlreadyTaken) {
    return res.status(409).json({ error: "The provided tag name is already taken." });
  }

  const { name, color } = req.body;
  const createdTag = await Tag.create({ name, color });

  res.status(201).json(createdTag);
}

export async function updateTag(req, res) {
  const tagId = parseInt(req.params.id);
  if (isNaN(tagId)) {
    return res.status(404).json({ error: `Tag not found. Please verify the provided id.` });
  }

  const updateTagSchema = Joi.object({
    name: Joi.string().min(1),
    color: getColorSchema()
  }).min(1).message("Missing body parameters. Provide at least 'name' or 'color' property.");


  const { error } = updateTagSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  const { name, color } = req.body;

  // S'il y a un nouveau 'name', alors valider qu'il n'est pas déjà pris
  if (name) {
    const isTagNameAlreadyTaken = !! await Tag.count({ where: { name }});
    if (isTagNameAlreadyTaken) {
      return res.status(409).json({ error: "The provided tag name is already taken." });
    }
  }

  const updatedTag = await tag.update({
    name: name || tag.name,
    color: color || tag.color
  });

  res.json(updatedTag);
}

export async function assignTagToCard(req, res) {
  const tagId = parseInt(req.params.tagId);
  if (isNaN(tagId)) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  const cardId = parseInt(req.params.cardId);
  if (isNaN(cardId)) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  const card = await Card.findByPk(cardId);
  if (! card) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  await card.addTag(tag);

  // CONVENTIONNELLEMENT, on devrait renvoyer une 204 (No Content)
  // mais par PRATICITÉ, on renvoie la carte à jour
  const updatedCard = await Card.findByPk(cardId, { include: ["tags"] });
  res.json(updatedCard);
}

export async function removeTagFromCard(req, res) {
  const tagId = parseInt(req.params.tagId);
  if (isNaN(tagId)) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  const cardId = parseInt(req.params.cardId);
  if (isNaN(cardId)) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  const card = await Card.findByPk(cardId);
  if (! card) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  await card.removeTag(tag);

  // CONVENTIONNELLEMENT, on devrait renvoyer une 204 (No Content)
  // mais par PRATICITÉ, on renvoie la carte à jour
  const updatedCard = await Card.findByPk(cardId, { include: ["tags"] });
  res.json(updatedCard);
}
