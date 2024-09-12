# QCM3

Sur git/github, un `remote` c'est :
- Une référence vers un repo GitHub
- Une référence vers le repo d'origine sur GitHub


Devant mon MCD :
- Je précise les `relations` entre mes `tables` et leurs différents `champs`
- Je précise les `associations` entre mes `entités` et leurs différents `attributs`
- Je pars en courant


Sur mon API REST, pour mettre à jour la `date de naissance` d'un `étudiant`, j'aurais tendance à utiliser la route :
- `GET /students/42 avec BODY = { birthdate: 1970-01-01 }`
- `PATCH /students/42 avec BODY = { birthdate: 1970-01-01 }`
- `PATCH /students/42/updateBirthDate/1970-01-01`

