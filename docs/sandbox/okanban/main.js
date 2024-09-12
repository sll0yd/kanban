// Récupérer les listes à afficher sur la page 

const httpResponse = await fetch("http://localhost:3000/api/lists");
const lists = await httpResponse.json();

lists.forEach(list => {
  // Créer un LI
  const liElement = document.createElement("li");

  // Modifier son contenu
  // ❌ liElement.innerHTML = list.title; // Pas de innerHTML avec des données "externes" et non controlées
  // ✅ liElement.textContent = list.title;
  // ✅ liElement.innerText = list.title;

  liElement.textContent = list.title;
  // L'insérer dans le ul
  const ulElement = document.querySelector("ul");
  ulElement.appendChild(liElement);
});
