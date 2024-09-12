# QCM3

Sur git/github, un `remote` c'est :
- ✅ Une référence vers un repo GitHub
- ❌ Une référence vers le repo d'origine sur GitHub ==> (`origin`)


Devant mon MCD :
- ❌ Je précise les `relations` entre mes `tables` et leurs différents `champs`
- ✅ Je précise les `associations` entre mes `entités` et leurs différents `attributs`
- ❌ Je pars en courant

- `MCD` = pour mamie = on lui parle pas de BDD et de tables
- `MLD` = pour les techos = en préparation de la BDD



Sur mon API REST, pour mettre à jour la `date de naissance` d'un `étudiant`, j'aurais tendance à utiliser la route :
- ❌ `GET /students/42 avec BODY = { birthdate: 1970-01-01 }` ==> GET === récupéré
- ✅ `PATCH /students/42 avec BODY = { birthdate: 1970-01-01 }`
- ❌ `PATCH /students/42/updateBirthDate/1970-01-01` ==> si on veut modifier à la fois son birthdate + email + firstname
  - en général on mes les attributs de la ressource à modifier dans le body !

