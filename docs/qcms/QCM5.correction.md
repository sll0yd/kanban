# QCM5 - Securité

Pour se prémunir d'une faille XSS, on :
- ❌ contrôle les inputs côté backend
- ❌ contrôle les rendus côté client
- ✅ les deux, mon capitaine !

Côté backend : 
- never trust user input :
  - les utilisateurs peuvent essayer de faire entrer en BDD des scripts 
  - controle : `sanitize-html`

Côté client : 
- attention à l'exécution du code lorsqu'il contient des données utilisateurs
  - par ex : éviter `innerHTML`
  - par ex : attention avec `<%- %>`


Avant de les mettre en BDD, les mots de passe : 
- ❌ on les chiffre ==> chiffrer (ex: HTTPS) implique de pouvoir déchiffrer
- ✅ on les hache ==> pleins d'algo : `argon2id`, `scrypt`, `bcrypt`
- ❌ on les encrypte (anglais)


Les CORS m'empêche de contacter mon API depuis mon FRONT, je dois : 
- faire quelque chose côté FRONT
- ✅ faire quelque chose côté BACK ==> on rajoute un header `Access-Control-Allow-Headers` qui permet de préciser les fronts que l'on autorise
- ❌ on m'avait pourtant bien dit de me méfier des CORS



Que permet le sel dans un mot de passe généré par un algo de hachage : 
- ❌ ralonger le temps de calcul du mot de passe haché ==> **cost factor** ou **nombre de tour de salage (SALT_ROUNDS)**
- ✅ faire en sorte que 2 mots de passe identiques soient hachés différemment ==> évite les attaques statistiques sur la BDD
- ❌ rajouté du goût sur mon steak haché

