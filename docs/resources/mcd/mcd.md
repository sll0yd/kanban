# MCD - Modèle Conceptuel de Données

## Rappels

- Exercice académique
- Pas de termes techniques
  - pas d'ID
  - pas de clé étrangère
  - pas de table de liaison

## Brouillon

Lister les entités : 

- Liste
- Carte
- Label

Liste les attributs des entités :

- Liste
  - titre
  - position  (un entier)
  - #cartes (une association)

- Carte
  - contenu
  - position  (un entier)
  - couleur (un code hexa)

- Label
  - nom
  - couleur (un code hexa)


Différence de modélisation sur la couleur et ce que ça implique en terme d'interface et fonctionnalités : 
- Si **COULEUR === ATTRIBUT** : 
  - au moment de la création de la carte, on choisit une couleur sur une roue chromatique
- Si **COULEUR === ENTITE** : 
  - on peut faire le CRUD (CREATE / READ / UPDATE / DELETE)
  - on créé les couleurs "à l'avance"
  - au moment de la création de la carte, on choisit un couleur parmis la liste des couleurs déjà créées.
  - liste prédéfinie de couleurs (celles de la BDD)

## Déterminant

- choisir un attribut qui fait office de **déterminant** === **discriminant**
  - un attribut qui caractérise de manière **unique** un élément de l'entité

- si on a pas d'attribut suffisant pour faire office de déterminant, on rajoute artificiellement un attribut `code <entité>`

## Association

- Block rond
- Avec un verbe à l'**indicatif** ou l'infinitif
  - potentiellement à la voix passive

- Attention aux cardinalités
  - `1,N` est assez rare : implique que lors de la création d'une entité, on s'assure qu'elle est lié avec MINIMUM un exemplaire de l'autre entité => rajoute du code => rajoute de la complexité => PAS `KISS` (Keep it simple stupid)


