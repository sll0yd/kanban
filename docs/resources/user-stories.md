# User stories

## Rappel

- Intérêt : 
  - clarifier le besoin utilisateur
  - se doter de **scenari de test** pour pouvoir valider le bon fonctionnement du logiciel

- Bonnes pratiques : 
  - user stories les plus **atomiques** possibles (1 seul fonctionnalité par user stories)
  - éviter les actions "plurielles" ou "multiples"

- Formalisme
  - 🇫🇷 `En tant que [role], je veux pouvour [action] ((afin de [objectif]))`
  - 🇺🇸 `As a [role], I want to [action] ((so that [goal]))`

- Objectif :
  - penser à l'avance au plus de fonctionnalités possibles
  - et éviter des "edge cases" : cas imprevus 

## Définir les rôles

- **Utilisateur** (utilisateur unique), mobile ou desktop


## Quelques exemples

| **En tant que**          | **Je souhaite pouvoir**                                                | **Afin de**                                                                       |
| ------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Utilisateur              | Accéder à la page d'accueil                                            | consulter l'état actuel du kaban (listes et cartes)                               |
| Utilisateur              | Créer une liste                                                        | rajouter une liste au kanban                                                      |
| Utilisateur              | Modifier une liste                                                     | changer ses informations (nom)                                                    |
| Utilisateur              | Déplacer une liste                                                     | modifier sa position au sein du board                                             |
| Utilisateur              | Supprimer une liste                                                    | de ne plus la voir s'afficher et de supprimer ses cartes également                |
| Utilisateur              | Créer une carte                                                        | rajouter une carte dans une liste                                                 |
| Utilisateur              | Modifier une carte                                                     | mettre à jour son contenu ou sa couleur                                           |
| Utilisateur              | Déplacer une carte au sein d'une même liste                            | réorganiser la position des cartes de cette liste                                 |
| Utilisateur              | Déplacer une carte d'une liste à l'autre                               | réorganiser l'agencement du kanban                                                |
| Utilisateur              | Supprimer une carte                                                    |                                                                                   |
| Utilisateur              | Créer un label                                                         | augmenter la liste des labels disponibles                                         |
| Utilisateur              | Modifier un label                                                      | corriger une faute ou sa couleur                                                  |
| Utilisateur              | Supprimer un label                                                     | qu'il disparaisse complètement y compris de toutes les cartes où il était assigné |
| Utilisateur              | Associer un label à une carte                                          | qualifier la carte                                                                |
| Utilisateur              | Dissocier un label d'une carte                                         | retirer la qualification de la carte                                              |
| Utilisateur              | Créer une carte avec le même contenu qu'une autre carte déjà existante |                                                                                   |
| Utilisateur (sur mobile) | Accéder au site de manière responsive                                  |                                                                                   |
