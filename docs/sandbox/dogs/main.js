const httpResponse = await fetch("https://dog.ceo/api/breeds/list/all"); // { body, ok, status, url }
const data = await httpResponse.json(); // Les données du body en JSON // { ... }

const dogNames = Object.keys(data.message); // { ... } ==> [ ... ] (JS pure)
// console.log(dogs); ["affenpinscher", "african"]

// Récupérer le UL 
const dogsListElement = document.querySelector("#dogs");

// Pour chaque dog dans le tableau dogs : 
dogNames.forEach(dogName => {
  // console.log(dog);

  // - créer un LI
  const dogLi = document.createElement("li");

  // - changer son textContent
  dogLi.textContent = dogName;

  // - insérer le LI dans le UL
  dogsListElement.appendChild(dogLi);

  // - Ajouter un listener pour écouter le click
  dogLi.addEventListener("click", async () => {
    console.log(dogName);

    const url = `https://dog.ceo/api/breed/${dogName}/images`;

    const httpResponse = await fetch(url);
    const data = await httpResponse.json();

    console.log(data);

    const imageUrl = data.message[Math.floor(Math.random() * data.message.length)];

    console.log(data)
    const imageElement = document.querySelector("img");
    imageElement.setAttribute("src", imageUrl);
    imageElement.setAttribute("alt", dogName);
  })
});
  


console.log(navigator.geolocation.getCurrentPosition((position) => {
  console.log(position);
}));
