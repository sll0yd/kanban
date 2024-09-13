import { apiBaseUrl } from "./config.js";

export async function getLists() {
  try {
    
    // Appel HTTP GET /api/lists
    const httpResponse = await fetch(`${apiBaseUrl}/lists`);

    // Ici, on gère les cas d'erreur 4XX et 5XX possibles
    if (! httpResponse.ok) { // true (si 1XX, 2XX, 3XX) et false (si 4XX ou 5XX)
      console.error(httpResponse);
      return null;
    }

    // Dans les cas où la réponse fonctionne, on parse le body et on renvoie les listes
    const lists = await httpResponse.json();
    return lists;

  } catch (error) {
    // Le catch se déclenche si le backend est injoignable (coupé, pas de 4G suffisante, problème DNS)
    // Error de type : ERR_CONNECTION_REFUSED

    // Note : si le backend répond avec un code d'erreur 400 ou 500 (mais qu'il répond), le fetch ne lève PAS d'exception => on va pas dans le try-catch

    console.error(error);
    return null;
  }
}

export async function createList(listData) { // listData = { title: "..." }
  try {

    const httpResponse = await fetch(`${apiBaseUrl}/lists`, {
      method: "POST",
      body: JSON.stringify(listData),
      headers: { "Content-Type": "application/json" }
    });
    
    // Erreur 4XX et 5XX
    if (! httpResponse.ok) {
      console.error(httpResponse);
      return null;
    }

    const createdList = await httpResponse.json();
    return createdList;

  } catch (error) { // Erreur network
    console.error(error);
    return null;
  }
}

export async function updateList(listId, listData) { // listData = { title: "...", position : "..." }
  try {

    const httpResponse = await fetch(`${apiBaseUrl}/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listData)
    });
  
    if (! httpResponse.ok) {
      console.error(httpResponse);
      return null;
    }
  
    const updatedList = await httpResponse.json();
    return updatedList;

  } catch (error) {
    console.error(error);
    return null;
  }

}

export async function deleteList(listId) {
  try {

    const httpResponse = await fetch(`${apiBaseUrl}/lists/${listId}`, {
      method: "DELETE"
    });
  
    if (! httpResponse.ok) {
      console.error(httpResponse);
      return false; // si erreur, le deleteList ne marche pas !
    }
  
    return true; // c'est ok ! 
    // Note : notre DELETE /lists ne renvoie pas de body => rien à .json() !

  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createCard(cardData) { // card = { content, list_id, color }
  try {

    const httpResponse = await fetch(`${apiBaseUrl}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardData)
    });
  
    if (! httpResponse.ok) {
      console.log(httpResponse);
      return null;
    }
  
    const createdCard = await httpResponse.json();
    return createdCard;

  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateCard(cardId, cardData) { // cardData = { content, color, list_id }
  try {

    const httpResponse = await fetch(`${apiBaseUrl}/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardData)
    });
  
    if (!httpResponse.ok) {
      console.log(httpResponse);
      return null;
    }
  
    const updatedCard = await httpResponse.json();
    return updatedCard;

  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteCard(cardId) {
  try {
    const httpResponse = await fetch(`${apiBaseUrl}/cards/${cardId}`, {
      method: "DELETE"
    });
  
    if (! httpResponse.ok) {
      console.error(httpResponse);
      return false;
    }
  
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
