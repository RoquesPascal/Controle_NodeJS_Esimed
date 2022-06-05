# Examen pratique - JavaScript / NodeJS

## Speedatify

### Expression des besoins

L'application (destinée à être utilisée principalement sur mobile) à développer est une application de *dating* avec partage social. Pour permettre à ceux d'entre vous adeptes du *speed dating* de gérer vos rencontres et de mettre en commun vos solides compétences de jugement
l'application vous permet de sauvegarder vos remarques et notes (de 1 à 10) de chacune de vos rencontres et de partager ces remarques avec d'autres utilisateurs. Désormais, plus de temps perdu avec un cas irrécupérable, vous pouvez les repérer avant grâce aux remarques de vos prédécesseurs !

### Contraintes fonctionnelles

#### Lot 1

##### Identification en ligne

- [x]  Enregistrement :
  
  - [x]  Adresse e-mail
  
  - [x]  Pseudo
  
  - [x]  Mot de passe

- [x]  Connexion : 
  
  - [x]  Adresse e-mail
  
  - [x]  Mot de passe

L'identification ainsi que l'enregistrement seront gérés côté serveur par un service d'authentification.

##### Personnes rencontrées et rencontres

L'application permettra :

- [x]  La visualisation 

- [x]  La saisie 

- [x]  La modification 

- [x]  La suppression 

d'un ensemble de personne :

- [x]  Nom

- [x]  Prénom

- [x]  Sexe

- [x]  Date de naissance

que l'on va rencontrer en speedating :

- [x]  Date de rencontre

- [x]  Note de 0 à 10

- [x]  Remarques

On peut avoir plusieurs sessions de speed dating avec la même personne.

##### Application cliente

Après les étapes d'enregistrement et de connexion, sera affichée :

- [x]  La liste des personnes rencontrées

- [x]  La liste des personnes à rencontrer 

- [x]  Possibilités :
  
  - [x]  Ajouter
  
  - [x]  Modifier
  
  - [x]  Supprimer
    
    - [x]  Nom
    
    - [x]  Prénom
    
    - [x]  Sexe
    
    - [x]  Date de naissance
    
    - [x]  Note /10
    
    - [x]  Si on veut : on peut ajouter une remarque

- [x]  Les rencontres peuvent être modifiées ou supprimées de même que les personnes rencontrées (les suppressions devront être confirmées par l'utilisateur).

#### Lot 2

##### Partage social

A partir de l'application, on pourra : 

- [x]  Partager les remarques concernant ses rencontres

- [x]  Visualiser les remarques partagées par d'autres sur les rencontres qu'ils ont faites avec les personnes qui sont connues par l'utilisateur

Le partage des remarques concernant les rencontres sera stocké côté serveur. On y trouvera :

- [x]  Les personnes rencontrées :
  
  - [x]  Nom
  
  - [x]  Prénom
  
  - [x]  Sexe
  
  - [x]  Date de naissance

- [x]  Les remarques (texte libre) sur les rencontres avec ces personnes  faites par d'autres utilisateurs. Une remarque sera partagée avec les informations suivantes :
  
  - [x]  Adresse e-mail de l'utilisateur qui partage
  
  - [x]  Identification de la personne rencontrée :
    
    - [x]  Nom
    
    - [x]  Prénom
    
    - [x]  Sexe
    
    - [x]  Date de naissance
  
  - [x]  Remarque

- [x]  Les remarques partagées seront récupérées par l'application client en fonction des paramètres suivants :
  
  - [x]  Identification de la personne rencontrée :
    
    - [x]  Nom
    
    - [x]  Prénom
    
    - [x]  Sexe
    
    - [x]  Date de naissance
  
  - [x]  L'application renverra les informations suivantes :
    
    - [x]  Date du partage
    
    - [x]  Pseudo de l'utilisateur qui a partagé la remarque
    
    - [x]  La remarque

- [x]  Les remarques sont associées aux rencontres. On peut donc partager plusieurs remarques pour une personnes puisque l'on peut avoir plusieurs sessions de *speed dating* avec la même personne

##### Application cliente

- [x]  L'utilisateur pourra partager chaque remarque concernant une rencontre.

- [x]  La suppression d'une rencontre supprime son partage.

- [x]  On pourra consulter la liste de remarques partagées pour une personne donnée.

#### Lot 3

- [ ]  Il sera possible de stocker en local l'identifiant de connexion de l'utilisateur s'il le désire.

- [ ]  L'utilisateur pourra prendre une photo de la personne rencontrée et l'associer à la fiche correspondante.

- [x]  Certains utilisateurs auront un statut "modérateur" et pourront : 
  
  - [x]  visualiser les derniers partages faits par les utilisateurs 
  
  - [x]  les supprimer ci-besoin en cas de remarque ne respectant pas la charte d'utilisation de l'application



### Contraintes non fonctionnelles

- [ ]  L'application devra au maximum simplifier la vie de l'utilisateur :
  
  - [x]  Initialisation correcte des formulaires
  
  - [ ]  Choix pertinents des types de saisies pour les champs textes
  
  - [ ]  ...

- [ ]  Toutes les parties de l'application devront respecter les architectures utilisées en cours.

- [ ]  La partie cliente devra être développée avec un design mobile-first.
