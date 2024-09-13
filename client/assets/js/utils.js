import "animate.css";
import { toast } from "bulma-toast";

export function initModalClosingElements() {
  // Sélectionner les 3 boutons "fermant", ie. les éléments avec la classe "".close"
  // Ici le selecteur par classe est acceptable car la classe .close n'a que cette responsabilité (elle ne stylise rien)
  const modalClosingElements = document.querySelectorAll(".close");

  // Ajouter un listener sur chacun des boutons :
  modalClosingElements.forEach(modalClosingElement => {
    modalClosingElement.addEventListener("click", closeActiveModal);
  });
}

export function closeActiveModal() {
  // - selectionner LA modal ACTIVE (ie, avec l'attribut "open")
  const activeModal = document.querySelector("dialog[open]");

  // - ferme la modal
  activeModal.close();
}

export function showErrorModal() {
  // Selectionner la modal d'erreur et l'ouvrir
  const errorModal = document.querySelector("#error-modal");

  // Ouvrir la modal
  errorModal.showModal();
}

export function displaySuccessToast(message) {
  toast({
    message,
    type: 'is-success',
    dismissible: true,
    duration: 5000,
    animate: { in: 'fadeIn', out: 'fadeOut' },
  });
}