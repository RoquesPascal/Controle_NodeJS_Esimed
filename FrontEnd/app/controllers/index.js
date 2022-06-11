class IndexController extends BaseController
{
    constructor()
    {
        super()
        this.compteurPersonnesRencontrees = 0;
        this.compteurPersonnesARencontrer = 0;
        this.taillePhotoDeProfil_100px    = 100;
        this.taillePhotoDeProfil_300px    = 300;
        this.model = new Sitemodel()
        this.AfficherListePersonnesARencontrer().then(r => {})
        this.ChangerListeAAfficher(true)
        this.InitialiserChamps().then(r => {})
    }

    async AfficherListePersonnesARencontrer()
    {
        let ulListePersonnesRencontrees      = document.getElementById("ulListePersonnesRencontrees");
        let ulListePersonnesARencontrer      = document.getElementById("ulListePersonnesARencontrer");

        if((ulListePersonnesRencontrees != null) && (ulListePersonnesARencontrer != null))
        {
            try
            {
                let listePersonnes = await this.model.GetListePersonnesARencontrer(this.JWT);
                let listeHtmlPersonnesRencontrees = "";
                let listeHtmlPersonnesARencontrer = "";

                ulListePersonnesRencontrees.innerHTML = '<img src="../../FrontEnd/res/Images/Loader.gif"/>';
                ulListePersonnesARencontrer.innerHTML = '<img src="../../FrontEnd/res/Images/Loader.gif"/>';

                for(const personne of listePersonnes)
                {
                    const rencontresCommunesUtilisateurPersonne = await this.model.GetRencontresCommunesUtilisateurPersonne(
                             {"idUtilisateur"        : this.ParseJwt(this.JWT).id,
                              "idPersonneRencontree" : personne.id},
                        this.JWT
                    );
                    if(rencontresCommunesUtilisateurPersonne.idUtilisateur != null) //Je fais comme ça pour éviter de remonter un 404 depuis le back
                    {
                        listeHtmlPersonnesRencontrees += this.CreerLigneAvecBalise_Li(personne);
                        this.compteurPersonnesRencontrees++;
                    }
                    else
                    {
                        listeHtmlPersonnesARencontrer += this.CreerLigneAvecBalise_Li(personne);
                        this.compteurPersonnesARencontrer++;
                    }
                }
                ulListePersonnesRencontrees.innerHTML = listeHtmlPersonnesRencontrees;
                ulListePersonnesARencontrer.innerHTML = listeHtmlPersonnesARencontrer;
                this.AfficherTitreBouttonsPersonnesRencontreesEtARencontrer();

                for(const personne of listePersonnes)
                {
                    let divPhotoPersonne = document.getElementById(`divPhotoPersonne_${personne.id}`);
                    if(divPhotoPersonne != null)
                        divPhotoPersonne.innerHTML = await this.AfficherPhotoDeProfilDePersonneARencontrer(personne, this.taillePhotoDeProfil_100px);
                }
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurGetListePersonnes");
            }
        }
    }

    async AfficherModalInfoPersonne(idPersonne)
    {
        let   modalTitreNomPrenomPersonne   = document.getElementById("modalTitreNomPrenomPersonne");
        let   divPhotoPersonne              = document.getElementById("divPhotoPersonne");
        let   divInfosPersonne              = document.getElementById("divInfosPersonne");
        let   ulListeCommentairesRencontres = document.getElementById("ulListeCommentairesRencontres");
        const personne                      = await this.model.GetPersonne(idPersonne, this.JWT);
        const listeRencontresDePersonne     = await this.model.GetListeRencontresDePersonneARencontrer(this.JWT, idPersonne);
        let   titreNomPrenomPersonne        = `${personne.prenom} ${personne.nom}`;

        if(personne.sexe == 1)
            titreNomPrenomPersonne += ` <img src="../FrontEnd/res/Images/IconeSexeMasculin_Bleue.png" height="25px"/>`;
        else if(personne.sexe == 0)
            titreNomPrenomPersonne += ` <img src="../FrontEnd/res/Images/IconeSexeFeminin_Rose.png" height="25px"/>`;

        modalTitreNomPrenomPersonne.innerHTML = titreNomPrenomPersonne;
        divPhotoPersonne.innerHTML = await this.AfficherPhotoDeProfilDePersonneARencontrer(personne, this.taillePhotoDeProfil_300px);
        if(personne.dateNaissance != null)
        {
            if(personne.sexe === 1)
                divInfosPersonne.innerHTML = `N&eacute; le ${this.AfficherDate(personne.dateNaissance)}`;
            else if(personne.sexe === 0)
                divInfosPersonne.innerHTML = `N&eacute;e le ${this.AfficherDate(personne.dateNaissance)}`;
        }
        else
            divInfosPersonne.innerHTML = `Date de naissance non renseignée...`;

        let listeCommentaires = '';
        for(const rencontre of listeRencontresDePersonne)
        {
            const utilisateur = await this.model.GetUtilisateur(rencontre.idUtilisateur, this.JWT);
            listeCommentaires += this.CreerLigneListeCommentaireAvecBalise_Li(utilisateur, rencontre);
        }
        ulListeCommentairesRencontres.innerHTML = listeCommentaires;
    }

    async AfficherPhotoDeProfilDePersonneARencontrer(personne, largeurImage)
    {
        try
        {
            const image = await this.model.GetPhotoPersonneARencontrer(this.JWT, personne.id);

            if((image != null) && (image.chemin != null) && (image.nomUnique != null))
                return `<img src="http://localhost:63342/${image.chemin}/${image.nomUnique}" width="${largeurImage}px"/>`;
            else
            {
                if(personne.sexe == 1)
                    return `<img src="../FrontEnd/res/Images/IconeHomme_Blanche.png" height="${largeurImage}px"/>`;
                if(personne.sexe == 0)
                    return `<img src="../FrontEnd/res/Images/IconeFemme_Blanche.png" height="${largeurImage}px"/>`;
                else
                    return ``;
            }
        }
        catch(e)
        {
            console.log(`erreur = ${e}`)
        }
    }

    AfficherTitreBouttonsPersonnesRencontreesEtARencontrer()
    {
        let buttonListeRencontres_Bleu       = document.getElementById("buttonListeRencontres_Bleu");
        let buttonListeRencontresAVenir_Gris = document.getElementById("buttonListeRencontresAVenir_Gris");
        let buttonListeRencontres_Gris       = document.getElementById("buttonListeRencontres_Gris");
        let buttonListeRencontresAVenir_Bleu = document.getElementById("buttonListeRencontresAVenir_Bleu");

        buttonListeRencontres_Bleu.innerHTML       = `Personnes rencontr&eacute;es (${this.compteurPersonnesRencontrees})`;
        buttonListeRencontres_Gris.innerHTML       = `Personnes rencontr&eacute;es (${this.compteurPersonnesRencontrees})`;
        buttonListeRencontresAVenir_Gris.innerHTML = `Personnes &agrave; rencontrer (${this.compteurPersonnesARencontrer})`;
        buttonListeRencontresAVenir_Bleu.innerHTML = `Personnes &agrave; rencontrer (${this.compteurPersonnesARencontrer})`;
    }

    ChangerListeAAfficher(afficherListeRencontres)
    {
        let ulListePersonnesRencontrees  = document.getElementById("ulListePersonnesRencontrees");
        let ulListePersonnesARencontrer  = document.getElementById("ulListePersonnesARencontrer");
        let bouttonsPersonnesRecontrees  = document.getElementById("bouttonsPersonnesRecontrees");
        let bouttonsPersonnesARencontrer = document.getElementById("bouttonsPersonnesARencontrer");

        if((ulListePersonnesRencontrees != null) && (ulListePersonnesARencontrer != null))
        {
            if(afficherListeRencontres)
            {
                ulListePersonnesRencontrees.style.display  = 'block';
                ulListePersonnesARencontrer.style.display  = 'none';
                bouttonsPersonnesRecontrees.style.display  = 'block';
                bouttonsPersonnesARencontrer.style.display = 'none';
            }
            else
            {
                ulListePersonnesRencontrees.style.display  = 'none';
                ulListePersonnesARencontrer.style.display  = 'block';
                bouttonsPersonnesRecontrees.style.display  = 'none';
                bouttonsPersonnesARencontrer.style.display = 'block';
            }
        }
    }

    CreerLigne(personne)
    {
        let ligne =  `<div class="row">
                          <div class="col-3" id="divPhotoPersonne_${personne.id}"><img src="../../FrontEnd/res/Images/Loader.gif"/></div>
                          <div class="col-sm">
                              ${personne.prenom} ${personne.nom} `
        if(personne.sexe === 1)
        {
            ligne += `<img src="../FrontEnd/res/Images/IconeSexeMasculin_Bleue.png" height="25px"/>`;
        }
        else if(personne.sexe === 0)
        {
            ligne += `<img src="../FrontEnd/res/Images/IconeSexeFeminin_Rose.png" height="25px"/>`;
        }
        ligne +=         `</div>
                          <div class="col-1">
                              <button type="button" class="btn btn-success boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalInfoPersonne" onclick="indexController.AfficherModalInfoPersonne('${personne.id}')">
                                  <img src="../FrontEnd/res/Images/IconeDescription_Blanche.png" height="25px"/>
                              </button>
                              <button type="button" class="btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalCreerPersonne" onclick="indexController.InitialiserChampsModificationPersonne('${personne.id}')">
                                  <img src="../FrontEnd/res/Images/IconeModification_Blanche.png" height="25px"/>
                              </button>
                              <button type="button" class="btn btn-danger" onclick="indexController.SupprimerPersonne('${personne.id}')">
                                  <img src="../FrontEnd/res/Images/IconeSuppression_Blanche.png" height="25px"/>
                              </button>
                          </div>
                      </div>`;
        return ligne;
    }

    CreerLigneAvecBalise_Li(personne)
    {
        return `<li class="liPersonne" id="personne_${personne.id}">${this.CreerLigne(personne)}</li>`;
    }

    CreerLigneAvecPseudoOuVous(utilisateur, rencontre)
    {
        if(rencontre.idUtilisateur == this.ParseJwt(this.JWT).id)
            return `Vous le ${this.AfficherDate(rencontre.dateRencontre)} :`;
        else
            return `${utilisateur.pseudo} (${utilisateur.email}) le ${this.AfficherDate(rencontre.dateRencontre)} :`;
    }

    CreerLigneListeCommentaire(utilisateur, rencontre)
    {
        return `<div class="row ligneUtilisateur">
                    ${this.CreerLigneAvecPseudoOuVous(utilisateur, rencontre)}
                </div>
                <div class="row ligneCommentaire">
                    <div class="col-1">
                        <img src="../FrontEnd/res/Images/IconeCommentaire_Blanche.png" height="25px"/>
                    </div>
                    <div class="col-11 texteJustifie">
                        ${rencontre.commentaire}
                    </div>
                </div>`;
    }

    CreerLigneListeCommentaireAvecBalise_Li(utilisateur, rencontre)
    {
        return `<li class="liCommentaireRencontre" id="commentaireRencontre_${rencontre.id}">${this.CreerLigneListeCommentaire(utilisateur, rencontre)}</li>`;
    }

    async CreerPersonne(afficherLaNouvellePersonneDansLaListe)
    {
        const inputNom                 = document.getElementById("inputNom");
        const inputPrenom              = document.getElementById("inputPrenom");
        const selectSexe               = document.getElementById("selectSexe");
        const selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
        const selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
        const selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");
        const inputFichier             = document.getElementById('inputFichier');



        if((inputNom.value === '') || (inputPrenom.value === '') || (selectSexe.value === '') || (selectDateNaissanceJour.value === '') || (selectDateNaissanceMois.value === '') || (selectDateNaissanceAnnee.value === ''))
        {
            this.toast("toastErreurCertainsChampsObligatoiresSontVides");
            return;
        }

        if(!this.EstPersonneMajeure(new Date(selectDateNaissanceAnnee.value, selectDateNaissanceMois.value - 1, selectDateNaissanceJour.value)))
        {
            this.toast("toastErreurLaPersonneDoitEtreMajeure");
            return;
        }

        if((inputFichier.files[0] != null) && !this.EstFichierDeType_JPG_PNG(inputFichier.value))
        {
            this.toast("toastErreurTypePhotoIncorrect");
            return;
        }

        try
        {
            const personne = await this.model.CreerPersonne({
                'nom'                : inputNom.value,
                'prenom'             : inputPrenom.value,
                'sexe'               : selectSexe.value,
                'dateNaissanceJour'  : selectDateNaissanceJour.value,
                'dateNaissanceMois'  : selectDateNaissanceMois.value,
                'dateNaissanceAnnee' : selectDateNaissanceAnnee.value
            }, this.JWT);

            if((personne != null) && (personne.id != null))
            {
                this.toast("toastSuccesCreerPersonne");
                await this.EnregistrerPhotoPersonneARencontrer(personne.id);
                if(afficherLaNouvellePersonneDansLaListe)
                    await creerRencontreController.AfficherListePersonnesARencontrer();
                navigate('index');
            }
            else
            {
                this.toast("toastErreurCreerPersonne");
            }
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurCreerPersonne");
        }
    }

    Deconnexion()
    {
        sessionStorage.removeItem(this.HistoriqueCle);
        navigate("login");
    }

    async EnregistrerPhotoPersonneARencontrer(idPersonne)
    {
        try
        {
            const inputFichier = document.getElementById('inputFichier');

            let formData = new FormData();
            formData.append('fichier', inputFichier.files[0]);

            let request = new XMLHttpRequest();
            request.open("POST", `http://localhost:3000/images/${idPersonne}`);
            request.setRequestHeader('Authorization', 'Bearer ' + this.JWT)
            request.send(formData);
        }
        catch(e)
        {
            console.log(`erreur = ${e}`)
        }
    }

    EstFichierDeType_JPG_PNG(fichier)
    {
        const extensionsAutorisees = /(\.jpg|\.JPG|\.png|\.PNG)$/i;
        return extensionsAutorisees.exec(fichier);
    }

    EstPersonneMajeure(dateNaissance)
    {
        let dateActuelle18AnsEnArriere = new Date(Date.now());
        dateActuelle18AnsEnArriere.setFullYear(dateActuelle18AnsEnArriere.getFullYear() - 18);
        return (dateActuelle18AnsEnArriere >= dateNaissance);
    }

    async InitialiserChamps()
    {
        try
        {
            let selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
            let selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
            let selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");

            if((selectDateNaissanceJour == null) || (selectDateNaissanceMois == null) || (selectDateNaissanceAnnee == null))
                return;

            let valeurJour  = 31;
            let valeurMois  = 12;
            let valeurAnnee = new Date(Date.now()).getFullYear();

            selectDateNaissanceJour .innerHTML = `<option value="">Jour</option>`;
            selectDateNaissanceMois .innerHTML = `<option value="">Mois</option>`;
            selectDateNaissanceAnnee.innerHTML = `<option value="">Ann&eacute;e</option>`;

            for(let i = 1 ; i <= valeurJour ; i++)
            {
                selectDateNaissanceJour.innerHTML += `<option value="${i}">${i}</option>`;
            }
            for(let i = 1 ; i <= valeurMois ; i++)
            {
                selectDateNaissanceMois.innerHTML += `<option value="${i}">${i}</option>`;
            }
            for(let i = valeurAnnee ; i >= 1900 ; i--)
            {
                selectDateNaissanceAnnee.innerHTML += `<option value="${i}">${i}</option>`;
            }
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurChargementRencontre");
        }
    }

    async InitialiserChampsModificationPersonne(idPersonne)
    {
        try
        {
            const personne = await this.model.GetPersonne(idPersonne, this.JWT);

            this.IntialiserModalModifierPersonne(personne.id);

            let inputNom                 = document.getElementById("inputNom");
            let inputPrenom              = document.getElementById("inputPrenom");
            let selectSexe               = document.getElementById("selectSexe");
            let selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
            let selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
            let selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");
            let inputFichier             = document.getElementById('inputFichier');

            if((selectDateNaissanceJour == null) || (selectDateNaissanceMois == null) || (selectDateNaissanceAnnee == null))
                return;

            let valeurJour               = 31;
            let valeurMois               = 12;
            let valeurAnnee              = new Date(Date.now()).getFullYear();

            selectDateNaissanceJour .innerHTML = `<option value="">Jour</option>`;
            selectDateNaissanceMois .innerHTML = `<option value="">Mois</option>`;
            selectDateNaissanceAnnee.innerHTML = `<option value="">Ann&eacute;e</option>`;

            for(let i = 1 ; i <= valeurJour ; i++)
            {
                selectDateNaissanceJour.innerHTML += `<option value="${i}">${i}</option>`;
            }
            for(let i = 1 ; i <= valeurMois ; i++)
            {
                selectDateNaissanceMois.innerHTML += `<option value="${i}">${i}</option>`;
            }
            for(let i = valeurAnnee ; i >= 1900 ; i--)
            {
                selectDateNaissanceAnnee.innerHTML += `<option value="${i}">${i}</option>`;
            }

            inputNom.value = `${personne.nom}`;
            inputPrenom.value = `${personne.prenom}`;
            selectSexe.value = `${personne.sexe}`;
            if(personne.dateNaissance != null)
            {
                const dateDeNaissance = personne.dateNaissance.toString();
                selectDateNaissanceJour.value = `${parseInt(dateDeNaissance[8] + dateDeNaissance[9])}`;
                selectDateNaissanceMois.value = `${parseInt(dateDeNaissance[5] + dateDeNaissance[6])}`;
                selectDateNaissanceAnnee.value = `${parseInt(dateDeNaissance[0] + dateDeNaissance[1] + dateDeNaissance[2] + dateDeNaissance[3])}`;
            }
            inputFichier.value = null;
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurChargementRencontre");
        }
    }

    IntialiserModalCreerPersonne()
    {
        let modalTitre                         = document.getElementById("modalTitre");
        let bouttonsModalCreerModifierPersonne = document.getElementById("bouttonsModalCreerModifierPersonne");
        let spanInfoInputFile                  = document.getElementById("spanInfoInputFile");

        if(modalTitre != null)
        {
            modalTitre.innerHTML = `Cr&eacute;ez une personne`;
        }

        spanInfoInputFile.innerHTML = '';

        if(bouttonsModalCreerModifierPersonne != null)
        {
            bouttonsModalCreerModifierPersonne.innerHTML = `
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        <img src="../FrontEnd/res/Images/IconeRetour_Blanche.png" height="25px"/> Annuler
                    </button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="indexController.CreerPersonne(false)">
                        <img src="../FrontEnd/res/Images/IconeAjout_Blanche.png" height="25px"/> Ajouter
                    </button>`;
        }
    }

    IntialiserModalModifierPersonne(idPersonne)
    {
        let modalTitre                         = document.getElementById("modalTitre");
        let bouttonsModalCreerModifierPersonne = document.getElementById("bouttonsModalCreerModifierPersonne");
        let spanInfoInputFile                  = document.getElementById("spanInfoInputFile");

        if(modalTitre != null)
        {
            modalTitre.innerHTML = `Modifiez cette personne`;
        }

        spanInfoInputFile.innerHTML = `La photo ne sera pas modifi&eacute;e tant que vous n'importez pas un nouveau fichier.`;

        if(bouttonsModalCreerModifierPersonne != null)
        {
            bouttonsModalCreerModifierPersonne.innerHTML = `
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        <img src="../FrontEnd/res/Images/IconeRetour_Blanche.png" height="25px"/> Annuler
                    </button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="indexController.ModifierPersonne('${idPersonne}')">
                        <img src="../FrontEnd/res/Images/IconeSauvegarder_Blanche.png" height="25px"/> Enregistrer
                    </button>`;
        }
    }

    async ModifierPersonne(idPersonne)
    {
        try
        {
            const inputNom                 = document.getElementById("inputNom");
            const inputPrenom              = document.getElementById("inputPrenom");
            const selectSexe               = document.getElementById("selectSexe");
            const selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
            const selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
            const selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");
            const inputFichier             = document.getElementById('inputFichier');


            if((inputNom.value === '') || (inputPrenom.value === '') || (selectSexe.value === '') || (selectDateNaissanceJour.value === '') || (selectDateNaissanceMois.value === '') || (selectDateNaissanceAnnee.value === ''))
            {
                this.toast("toastErreurCertainsChampsObligatoiresSontVides");
                return;
            }

            if(!this.EstPersonneMajeure(new Date(selectDateNaissanceAnnee.value, selectDateNaissanceMois.value - 1, selectDateNaissanceJour.value)))
            {
                this.toast("toastErreurLaPersonneDoitEtreMajeure");
                return;
            }

            if((inputFichier.files[0] != null) && !this.EstFichierDeType_JPG_PNG(inputFichier.value))
            {
                this.toast("toastErreurTypePhotoIncorrect");
                return;
            }

            let Result = await this.model.ModifierPersonne({
                "idPersonneARencontrer" : idPersonne,
                "nom"                   : inputNom.value,
                "prenom"                : inputPrenom.value,
                "sexe"                  : selectSexe.value,
                "dateNaissanceJour"     : selectDateNaissanceJour.value,
                "dateNaissanceMois"     : selectDateNaissanceMois.value,
                "dateNaissanceAnnee"    : selectDateNaissanceAnnee.value
            }, this.JWT);

            if(Result === 200)
            {
                this.toast("toastSuccesModifierPersonne");
                const nouvellePersonne = await this.model.GetPersonne(idPersonne, this.JWT);

                if(inputFichier.files[0] != null)
                {
                    await this.model.SupprimerPhotoPersonneARencontrer(this.JWT, idPersonne);
                    await this.EnregistrerPhotoPersonneARencontrer(idPersonne);
                }

                let liRencontre = document.getElementById(`personne_${idPersonne}`);
                if(liRencontre != null)
                {
                    liRencontre.innerHTML = this.CreerLigne(nouvellePersonne);
                    let divPhotoPersonne = document.getElementById(`divPhotoPersonne_${idPersonne}`);
                    await new Promise(resolve => setTimeout(resolve, 50)); //Truc pourri juste pour laisser le temps à l'image de se créer, avant de l'afficher
                    divPhotoPersonne.innerHTML = await this.AfficherPhotoDeProfilDePersonneARencontrer(nouvellePersonne, this.taillePhotoDeProfil_100px);
                }
            }
            else if(Result === 400)
            {
                this.toast("toastErreurModifierPersonne");
            }
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurModifierPersonne");
        }
    }

    async SupprimerPersonne(idPersonne)
    {
        if(confirm('Voulez-vous supprimer cette personne ?'))
        {
            try
            {
                const Result = await this.model.SupprimerPersonne({
                    'idPersonneARencontrer' : idPersonne
                }, this.JWT);

                if(Result === 200)
                {
                    const li = document.getElementById(`personne_${idPersonne}`);
                    if(li.parentNode)
                    {
                        if(li.parentNode.id === "ulListePersonnesRencontrees")
                            this.compteurPersonnesRencontrees--;
                        else if(li.parentNode.id === "ulListePersonnesARencontrer")
                            this.compteurPersonnesARencontrer--;
                        this.AfficherTitreBouttonsPersonnesRencontreesEtARencontrer();

                        li.parentNode.removeChild(li);
                    }
                    this.toast("toastSuccesSupprimerPersonne");
                }
                else if(Result === 400)
                {
                    this.toast("toastErreurSupprimerPersonne");
                }
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurSupprimerPersonne");
            }
        }
    }

    ViderChampsNomEtPrenomPersonne()
    {
        this.IntialiserModalCreerPersonne();

        let inputNom                 = document.getElementById("inputNom");
        let inputPrenom              = document.getElementById("inputPrenom");
        let selectSexe               = document.getElementById("selectSexe");
        let selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
        let selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
        let selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");

        inputNom.value = "";
        inputPrenom.value = "";
        selectSexe.value = "";
        selectDateNaissanceJour.value = "";
        selectDateNaissanceMois.value = "";
        selectDateNaissanceAnnee.value = "";
    }
}

window.indexController = new IndexController()