# QCM4

`GET`, `POST`, `PUT`, `PATCH`... c'est quoi ? 
- ❌ le chemin (path) de la requête HTTP
- ✅ le verbe (method) de la requête HTTP
- ❌ l'hôte (host) de la requête HTTP

```js
"protocol://host:port/path"

"https://oclock.io:443/qui-sommes-nous"

// Port par défaut pour HTTP : 80
// Port par défaut pour HTTPS : 443
// Pour par défaut pour Postgres : 5432
```



Quelle information est fausse ?
- ❌ insérer `coucou` dans un `VARCHAR(7)` lève une erreur. ==> `VARCHAR(7)` = entre 0 et 7 caractères
- ❌ insérer `coucou` dans un `VARCHAR` lève une erreur. ==> `VARCHAR` ===` VARCHAR(255)` = 0 et 255 caractères
- ✅ le type `VARCHAR(42)` accepte uniquement les chaines de caractère qui font exactement 42 caractères.  ==> jusqu'à 42 caractère. Sinon : `CHAR(42)`
- ❌ elles sont toutes fausse



Je suis Bob de l'équipe Frontend, et notre code client appelle l'API d'Alice, qui me retourne une `401`:
- ✅ c'est probablement la faute de l'équipe Frontend ! ==> `401` === `Unauthorized` : Bob n'a pas authentifié la requête
- ❌ c'est probablement la faute de l'équipe Backend !
- ❌ c'est probablement la faute des reptiliens

