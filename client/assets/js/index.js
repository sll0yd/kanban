
import { fetchAndDisplayLists, initAddListButton, initAddListForm, initEditListForm, initDeleteListForm, initDragAndDropOnLists } from "./lists.module.js";
import { initModalClosingElements } from "./utils.js";


document.addEventListener("DOMContentLoaded", async () => {
  initAddListButton();
  initAddListForm();
  initEditListForm();
  initDeleteListForm();
  initModalClosingElements();
  initDragAndDropOnLists();
  await fetchAndDisplayLists();
});

