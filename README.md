# Examen pratique - JavaScript / NodeJS

## Speedatify

### Expression des besoins

L'application (destinée à être utilisée principalement sur mobile) à développer est une application de *dating* avec partage social. Pour permettre à ceux d'entre vous adeptes du *speed dating* de gérer vos rencontres et de mettre en commun vos solides compétences de jugement
l'application vous permet de sauvegarder vos remarques et notes (de 1 à 10) de chacune de vos rencontres et de partager ces remarques avec d'autres utilisateurs. Désormais, plus de temps perdu avec un cas irrécupérable, vous pouvez les repérer avant grâce aux remarques de vos prédécesseurs !

### Contraintes fonctionnelles

#### Lot 1

##### Identification en ligne

- [ ]  Enregistrement :
  
  - [ ]  Adresse e-mail
  
  - [ ]  Pseudo
  
  - [ ]  Mot de passe

- [ ]  Connexion : 
  
  - [ ]  Adresse e-mail
  
  - [ ]  Mot de passe

L'identification ainsi que l'enregistrement seront gérés côté serveur par un service d'authentification.

##### Personnes rencontrées et rencontres

L'application permettra :

- [ ]  La visualisation 

- [ ]  La saisie 

- [ ]  La modification 

- [ ]  La suppression 

d'un ensemble de personne :

- [ ]  Nom

- [ ]  Prénom

- [ ]  Sexe

- [ ]  Date de naissance

que l'on va rencontrer en speedating :

- [ ]  Date de rencontre

- [ ]  Note de 0 à 10

- [ ]  Remarques

On peut avoir plusieurs sessions de speed dating avec la même personne.

##### Application cliente

Après les étapes d'enregistrement et de connexion, sera affichée :

- [ ]  La liste des personnes rencontrées

- [ ]  La liste des personnes à rencontrer 

- [ ]  Possibilités :
  
  - [ ]  Ajouter
  
  - [ ]  Modifier
  
  - [ ]  Supprimer
    
    - [ ]  Nom
    
    - [ ]  Prénom
    
    - [ ]  Sexe
    
    - [ ]  Date de naissance
    
    - [ ]  Note /10
    
    - [ ]  Si on veut : on peut ajouter une remarque

- [ ]  Les rencontres peuvent être modifiées ou supprimées de même que les personnes rencontrées (les suppressions devront être confirmées par l'utilisateur).

#### Lot 2

##### Partage social

A partir de l'application, on pourra : 

- [ ]  Partager les remarques concernant ses rencontres

- [ ]  Visualiser les remarques partagées par d'autres sur les rencontres qu'ils ont faites avec les personnes qui sont connues par l'utilisateur

Le partage des remarques concernant les rencontres sera stocké côté serveur. On y trouvera :

- [ ]  Les personnes rencontrées :
  
  - [ ]  Nom
  
  - [ ]  Prénom
  
  - [ ]  Sexe
  
  - [ ]  Date de naissance

- [ ]  Les remarques (texte libre) sur les rencontres avec ces personnes  faites par d'autres utilisateurs. Une remarque sera partagée avec les informations suivantes :
  
  - [ ]  Adresse e-mail de l'utilisateur qui partage
  
  - [ ]  Identification de la personne rencontrée :
    
    - [ ]  Nom
    
    - [ ]  Prénom
    
    - [ ]  Sexe
    
    - [ ]  Date de naissance
  
  - [ ]  Remarque

- [ ]  Les remarques partagées seront récupérées par l'application client en fonction des paramètres suivants :
  
  - [ ]  Identification de la personne rencontrée :
    
    - [ ]  Nom
    
    - [ ]  Prénom
    
    - [ ]  Sexe
    
    - [ ]  Date de naissance
  
  - [ ]  L'application renverra les informations suivantes :
    
    - [ ]  Date du partage
    
    - [ ]  Pseudo de l'utilisateur qui a partagé la remarque
    
    - [ ]  La remarque

- [ ]  Les remarques sont associées aux rencontres. On peut donc partager plusieurs remarques pour une personnes puisque l'on peut avoir plusieurs sessions de *speed dating* avec la même personne

##### Application cliente

- [ ]  L'utilisateur pourra partager chaque remarque concernant une rencontre.

- [ ]  La suppression d'une rencontre supprime son partage.

- [ ]  On pourra consulter la liste de remarques partagées pour une personne donnée.

#### Lot 3

- [ ]  Il sera possible de stocker en local l'identifiant de connexion de l'utilisateur s'il le désire.

- [ ]  L'utilisateur pourra prendre une photo de la personne rencontrée et l'associer à la fiche correspondante.

- [ ]  Certains utilisateurs auront un statut "modérateur" et pourront : 
  
  - [ ]  visualiser les derniers partages faits par les utilisateurs 
  
  - [ ]  les supprimer ci-besoin en cas de remarque ne respectant pas la charte d'utilisation de l'application



### Contraintes non fonctionnelles

- [ ]  L'application devra au maximum simplifier la vie de l'utilisateur :
  
  - [ ]  Initialisation correcte des formulaires
  
  - [ ]  Choix pertinents des types de saisies pour les champs textes
  
  - [ ]  ...

- [ ]  Toutes les parties de l'application devront respecter les architectures utilisées en cours.

- [ ]  La partie cliente devra être développée avec un design mobile-first.
