import { Card } from "./card.model.js";
import { List } from "./list.model.js";
import { sequelize } from "./sequelize-client.js";
import { Tag } from "./tag.model.js";


// List <--> Card
// One-To-Many

List.hasMany(Card, {
  as: "cards",
  foreignKey: {
    name: "list_id",
    allowNull: false
  },
});
Card.belongsTo(List, {
  as: "list",
  foreignKey: {
    name: "list_id",
    allowNull: false
  }
});



// Card <--> Tag
// Many-to-Many
Card.belongsToMany(Tag, {
  through: "card_has_tag",
  as: "tags",
  foreignKey: "card_id",
});
Tag.belongsToMany(Card, {
  through: "card_has_tag", // grace au `sequelize.sync()`, pas besoin de créer un modèle pour la table de liaison (on pourrait !), cette clé suffit à Sequelize pou comprendre que lib doit créer la table card_has_tag
  as: "cards",
  foreignKey: "tag_id" // permet de créer la clé étrangère `tag_id` sur la table `card_has_tag` qui pointe vers la clé primaire du modèle `Tag` (donc Tag.id)
});

export { Card, List, Tag, sequelize };
