import Sortable from "sortablejs";
import * as api from "./api.js";
import { closeActiveModal, displaySuccessToast, showErrorModal } from "./utils.js";
import { addCardToList } from "./cards.module.js";

export function initAddListButton() {
  // Récupérer le bouton d'ajout de liste
  const addListButton = document.querySelector("#add-list-button");

  // Ecouter le click sur ce bouton, en cas de click :
  addListButton.addEventListener("click", () => {
    // - sélectionner la modale
    const addListModal = document.querySelector("#add-list-modal");

    // - l'ouvrir (showModal())
    addListModal.showModal(); // ==> met l'attribut 'open' sur la modale (donc l'affiche)
  });
}

export async function fetchAndDisplayLists() {
  const lists = await api.getLists(); // [{}, {}, {}] || null

  // Si l'appel backend nous renvoie null, on gère l'erreur ici
  if (!lists) {
    showErrorModal();
    return;
  }
  
  // Pour chaque liste, l'insérer dans la page : 
  lists.forEach(list => { 
    addListToListsContainer(list);

    list.cards.forEach(card => {
      // Insérer la carte dans la bonne liste !
      addCardToList(card); // card = { color, content, list_id }
    });
  });
}

export function addListToListsContainer(list) { // list = { id, position, title, updated_at, created_at, cards: [] }
  // - récupérer le template
  const listTemplate = document.querySelector("#list-template");
  
  // - cloner le template
  const listClone = listTemplate.content.cloneNode(true);
  
  // - modifier le clone avec les informations de la liste
  listClone.querySelector('[slot="list-title"]').textContent = list.title;
  
  // - ajouter l'ID de la liste (son ID de BDD) sur le clone
  listClone.querySelector('[slot="list-id"]').id = `list-${list.id}`;

  // - ajouter un listener sur le bouton 🖊️ du clone
  const editListButton = listClone.querySelector('[slot="list-edit-button"]');
  editListButton.addEventListener("click", () => {
    // Selectionner la modal d'edition de liste
    const editListModal = document.querySelector("#edit-list-modal");

    // Avant d'ouvrir la modale, on ajoute à celle-ci l'ID de la liste que l'utilisateur va modifier
    editListModal.dataset.listId = list.id;

    // Puis on ouvre la modal
    editListModal.showModal();

    // Récupérer la valeur ACTUELLE du titre de la liste cliquée
    // - selectionner la liste 
    const listElement = document.querySelector(`#list-${list.id}`);
    
    // - selectionner le titre de la liste et lire son textContent
    const previousValue = listElement.querySelector('[slot="list-title"]').textContent;

    // Selectionner l'input du titre et lui mettre la nouvelle valeur
    const editListTitleInput = document.querySelector("#edit-list-title");
    editListTitleInput.value = previousValue;
  });

  // - ajouter un listener sur le bouton 🗑️ du clone
  const deleteListButton = listClone.querySelector('[slot="list-delete-button"]');
  deleteListButton.addEventListener("click", () => {
    // Sélectionner la modale de confirmation de suppression
    const deleteListModal = document.querySelector("#delete-list-modal");

    // Fournir à la modal l'ID de la liste à supprimer (en passant => dataset)
    deleteListModal.dataset.listId = list.id;

    // Ouvre la modal
    deleteListModal.showModal();

  });

  // - ajouter un listener sur le bouton ➕ du clone
  const addCardButton = listClone.querySelector('[slot="add-card-button"]');
  addCardButton.addEventListener("click", () => {
    // Sélectionner la modale de confirmation de suppression
    const addCardModal = document.querySelector("#add-card-modal");

    // Fournir à la modal l'ID de la liste à supprimer (en passant => dataset)
    addCardModal.dataset.listId = list.id;

    // Ouvre la modal
    addCardModal.showModal();

  });

  // - ajout du drag and drop sur les cartes de la liste
  const cardsContainer = listClone.querySelector('[slot="list-content"]');
  Sortable.create(cardsContainer, {
    animation: 150,
    group: "shared",
    onEnd: async (event) => {
      const cardId = parseInt(event.item.id.slice(5));
      const fromListId = parseInt(event.from.parentElement.id.slice(5));
      const toListId = parseInt(event.to.parentElement.id.slice(5));

      if (fromListId !== toListId) { // S'il y a eu changement de liste, on update la list_id de la carte
        const updatedCard = await api.updateCard(cardId, { list_id: toListId });
        if (!updatedCard) { showErrorModal(); return; }
      }

      // Et on update les positions des cartes dans la liste d'arrivée 
      const cardElements = Array.from(document.querySelector(`#list-${toListId} [slot="list-content"]`).children);
      const promises = cardElements.map((card, index) => {
        const cardId = card.id.slice(5);
        const position = index + 1;
        return api.updateCard(cardId, { position });
      });
      const results = await Promise.all(promises);

      if (results.includes(null)) { // Si l'une des requêtes n'as pas marché
        showErrorModal();
      } else {
        displaySuccessToast("Positions des cartes sauvegardées avec succès");
      }
    }
  });

  // - récupérer le lists-container
  const listsContainer = document.querySelector("#lists-container");
  
  // - insérer le clone dans ce list-container
  listsContainer.appendChild(listClone);
}

export function initAddListForm() {
  // Selectionner le formulaire d'ajout de liste
  const addListModal = document.querySelector("#add-list-modal");
  const addListForm = addListModal.querySelector("form");
  
  // Ecouter le "submit" sur ce formulaire
  addListForm.addEventListener("submit", async (event) => {
    // - prevent default
    event.preventDefault();
  
    // - tester
    // console.log(event);
  
    // - récupérer le title renseigné par l'utilisateur
    const listData = Object.fromEntries(new FormData(addListForm)); // listData = { title: "..." }
  
    // - appeler le backend
    const createdList = await api.createList(listData); // { ... } || null
    
    // - si erreur (ie, createdList est null) : on affiche la modal d'erreur
    if (! createdList) {
      showErrorModal();
      return;
    } else {
      // Afficher un toast de succès
      displaySuccessToast("La liste a été créée avec succès.");
    }
  
    // - sinon : insère la nouvelle liste dans la page (addListToListsContaier)
    addListToListsContainer(createdList);
  
    // - fermer la modal active
    closeActiveModal();
  
    // - reset le formulaire
    addListForm.reset();
  
  });
}

export function initEditListForm() {
  // Récupérer le formulaire d'édition de liste
  const editListModal = document.querySelector("#edit-list-modal");
  const editListForm = editListModal.querySelector("form");

  // Ecouter le submit sur ce formulaire, en cas de submit : 
  editListForm.addEventListener("submit", async (event) => {
    // - Prevent default
    event.preventDefault();

    // - Récupérer les données du formulaire (body)
    const editListData = Object.fromEntries(new FormData(editListForm)); // { title: "..." }
    
    // - Récupérer l'ID de la liste à modifier
    const listId = editListModal.dataset.listId;

    // PATCH /lists/LIST_id + BODY editListData
    const updatedList = await api.updateList(listId, editListData); // { ... } || null

    // - Si PAS OK : 
    if (! updatedList) {
      //   - affichage de la modal d'erreur
      showErrorModal();
    } else {
      displaySuccessToast("La liste a bien été mise à jour.");

      // Selectionner la liste par son ID et son slot
      const updatedListTitleElement = document.querySelector(`#list-${updatedList.id} [slot="list-title"]`);

      // Modifier le text content
      updatedListTitleElement.textContent = updatedList.title;
    }
  
    // - reset le form
    editListForm.reset();

    // - fermer la modale active
    closeActiveModal();
  });


}

export function initDeleteListForm() {
  // Selectionner la modal de suppression de liste
  const deleteListModal = document.querySelector("#delete-list-modal");

  // Selectionner le formulaire de suppresion de liste
  const deleteListForm = deleteListModal.querySelector("form");

  // Ecouter le submit sur le formulaire, en cas de submit : 
  deleteListForm.addEventListener("submit", async (event) => {
    // - prevent default
    event.preventDefault();
  
    // - selectionner l'ID de la liste à supprimer (dataset de la modal !)
    const listId = deleteListModal.dataset.listId;
  
    // - DELETE /lists/LIST_ID
    const isDeleted = await api.deleteList(listId);
  
    // - SI PAS OK : modal d'erreur 
    if (!isDeleted) {
      showErrorModal();

    // - SI ok : 
    } else {
      //   - toast de succès
      displaySuccessToast("La liste a bien été supprimée.");

      //   - selectionner la liste à retirer de la page (=> id)
      const listElementToRemove = document.querySelector(`#list-${listId}`);

      //   - la retirer du DOM
      listElementToRemove.remove();
    }
  
    //   - fermer la modale de suppression
    closeActiveModal();
  });

}

export function initDragAndDropOnLists() {
  const listsContainer = document.querySelector("#lists-container");
  Sortable.create(listsContainer, {
    handle: '[slot="list-drag-button"]', // Selecteur pour préciser quel partie des items est "attrapable"
    animation: 200,
    onEnd: () => { // Se callback se déclenche lorsque l'utilisateur termine son drag&drop
      // Récupérer toutes les listes de la page
      const listElements = Array.from(document.querySelector("#lists-container").children); // HTMLCollection ==> Array<Element>
      // Alternativement = document.querySeletorAll('[slot="list-id"]')
      
      // Pour chaque liste :
      listElements.forEach(async (listElement, index) => { // forEach peut prendre 2 paramètres : 1er = l'élement du tableau sur lequel on itère // 2eme = l'index de l'élément du tableau sur lequel on itère
        // console.log(listElement); // ELEMENT
        // console.log(listElement.id); // "list-9"
        // console.log(listElement.id.substring(5)); // "9" ==> on récupère la sous string à partir de l'index

        // Récupérer l'ID de la liste
        const listId = parseInt(listElement.id.substring(5)); // 9

        // Récupérer la nouvelle position de la liste
        const newPosition = index + 1; 

        // PATCH /lists/ID + BODY { position }
        await api.updateList(listId, { position: newPosition });
      });

      // Toast de succès
      displaySuccessToast("La position des listes a bien été mise à jour.");


      // SUGGESTION d'AMELIORATION 
      // Construire l'objet [{ listId: , position: }]
      // const body = listElements.map((listElement, index) => ({
      //   listId: parseInt(listElement.id.substring(5)),
      //   posiiton: index + 1
      // }));


      // SUGGESTION d'AMELIRATION
      // A la place du forEach => Promise.all()
      // const promises = listElements.map(async (listElement, index) => {
      //   const listId = parseInt(listElement.id.substring(5)); // 9
      //   const newPosition = index + 1; 
      //   await api.updateList(listId, { position: newPosition });
      // });
      // const results = await Promise.all(promises);
    }
  });
}