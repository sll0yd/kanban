
import { initAddCardForm, initDeleteCardForm, initEditCardForm } from "./cards.module.js";
import { fetchAndDisplayLists, initAddListButton, initAddListForm, initEditListForm, initDeleteListForm, initDragAndDropOnLists } from "./lists.module.js";
import { initModalClosingElements } from "./utils.js";


document.addEventListener("DOMContentLoaded", async () => {
  initAddListButton();

  initAddListForm();
  initEditListForm();
  initDeleteListForm();

  initAddCardForm();
  initEditCardForm();
  initDeleteCardForm();

  initModalClosingElements();
  initDragAndDropOnLists();

  await fetchAndDisplayLists();
});
