class IndexController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
        this.AfficherPseudo()
        this.AfficherListePersonnesARencontrer().then(r => {})
        this.ChangerListeAAfficher(true)
        this.InitialiserChamps().then(r => {})
    }

    async AfficherListePersonnesARencontrer()
    {
        let ulListePersonnesRencontrees  = document.getElementById("ulListePersonnesRencontrees");
        let ulListePersonnesARencontrer  = document.getElementById("ulListePersonnesARencontrer");

        if((ulListePersonnesRencontrees != null) && (ulListePersonnesARencontrer != null))
        {
            try
            {
                const token = Historique;
                let listePersonnes = await this.model.GetListePersonnesARencontrer(token);
                let listeHtmlPersonnesRencontrees = "";
                let listeHtmlPersonnesARencontrer = "";

                ulListePersonnesRencontrees.innerHTML = '<img src="../../FrontEnd/res/Loader.gif"/>';
                ulListePersonnesARencontrer.innerHTML = '<img src="../../FrontEnd/res/Loader.gif"/>';

                for(const personne of listePersonnes)
                {
                    // Il met une erreur ici (avec les console.log() sur le navigateur, mais c'est une erreur maîtrisée)
                    const rencontresCommunesUtilisateurPersonne = await this.model.GetRencontresCommunesUtilisateurPersonne(
                        {"idUtilisateur"        : this.ParseJwt(token).id,
                              "idPersonneRencontree" : personne.id},
                        token
                    );
                    if(rencontresCommunesUtilisateurPersonne.idUtilisateur != null) //Je fais comme ça pour éviter de remonter un 404 depuis le back
                    {
                        listeHtmlPersonnesRencontrees += this.CreerLigne(personne);
                    }
                    else
                    {
                        listeHtmlPersonnesARencontrer += this.CreerLigne(personne);
                    }
                }
                ulListePersonnesRencontrees.innerHTML = listeHtmlPersonnesRencontrees;
                ulListePersonnesARencontrer.innerHTML = listeHtmlPersonnesARencontrer;
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurGetListePersonnes");
            }
        }
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
                ulListePersonnesRencontrees.style.display = 'block';
                ulListePersonnesARencontrer.style.display = 'none';
                bouttonsPersonnesRecontrees.style.display = 'block';
                bouttonsPersonnesARencontrer.style.display = 'none';
            }
            else
            {
                ulListePersonnesRencontrees.style.display = 'none';
                ulListePersonnesARencontrer.style.display = 'block';
                bouttonsPersonnesRecontrees.style.display = 'none';
                bouttonsPersonnesARencontrer.style.display = 'block';
            }
        }
    }

    CreerLigne(personne)
    {
        let li =  `<li class="liPersonne" id="personne_${personne.id}">
                       <div class="row">
                           <div class="col">
                               ${personne.prenom} ${personne.nom} `
        if(personne.sexe === 1)
        {
            li += `<img src="../FrontEnd/res/IconeSexeMasculin.png" height="25px"/>`;
        }
        else if(personne.sexe === 0)
        {
            li += `<img src="../FrontEnd/res/IconeSexeFeminin.png" height="25px"/>`;
        }
        li +=         `</div>
                           <div class="col-1">
                               <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalCreerPersonne" onclick="indexController.InitialiserChampsModificationPersonne('${personne.id}')">
                                   <img src="../FrontEnd/res/IconeModification.png" height="25px"/>
                               </button>
                               <button type="button" class="btn btn-danger" onclick="indexController.SupprimerPersonne('${personne.id}')">
                                   <img src="../FrontEnd/res/IconeSuppression.png" height="25px"/>
                               </button>
                           </div>
                       </div>
                   </li>`;
        return li;
    }

    async CreerPersonne()
    {
        const inputNom                 = document.getElementById("inputNom");
        const inputPrenom              = document.getElementById("inputPrenom");
        const selectSexe               = document.getElementById("selectSexe");
        const selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
        const selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
        const selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");

        if((inputNom.value === '') || (inputPrenom.value === '') || (selectSexe.value === ''))
        {
            this.toast("toastErreurCertainsChampsObligatoiresSontVides");
            return;
        }

        try
        {
            const token = Historique;

            const Result = await this.model.CreerPersonne({
                'nom'                : inputNom.value,
                'prenom'             : inputPrenom.value,
                'sexe'               : selectSexe.value,
                'dateNaissanceJour'  : selectDateNaissanceJour.value,
                'dateNaissanceMois'  : selectDateNaissanceMois.value,
                'dateNaissanceAnnee' : selectDateNaissanceAnnee.value
            }, token);

            if(Result === 201)
            {
                this.toast("toastSuccesCreerPersonne");
            }
            else if(Result === 400)
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
        sessionStorage.clear();
        localStorage.clear();
        navigate("login");
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
            const token = Historique;
            const personne = await this.model.GetPersonne(idPersonne, token);

            this.IntialiserModalModifierPersonne(personne.id);

            let inputNom                 = document.getElementById("inputNom");
            let inputPrenom              = document.getElementById("inputPrenom");
            let selectSexe               = document.getElementById("selectSexe");
            let selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
            let selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
            let selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");

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

        if(modalTitre != null)
        {
            modalTitre.innerHTML = `Cr&eacute;ez une personne`;
        }

        if(bouttonsModalCreerModifierPersonne != null)
        {
            bouttonsModalCreerModifierPersonne.innerHTML = `
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        <img src="../FrontEnd/res/IconeRetour.png" height="25px"/> Annuler
                    </button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="indexController.CreerPersonne()">
                        <img src="../FrontEnd/res/IconeAjoutBlanche.png" height="25px"/> Ajouter
                    </button>`;
        }
    }

    IntialiserModalModifierPersonne(idPersonne)
    {
        let modalTitre                         = document.getElementById("modalTitre");
        let bouttonsModalCreerModifierPersonne = document.getElementById("bouttonsModalCreerModifierPersonne");

        if(modalTitre != null)
        {
            modalTitre.innerHTML = `Modifiez cette personne`;
        }

        if(bouttonsModalCreerModifierPersonne != null)
        {
            bouttonsModalCreerModifierPersonne.innerHTML = `
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        <img src="../FrontEnd/res/IconeRetour.png" height="25px"/> Annuler
                    </button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="indexController.ModifierPersonne('${idPersonne}')">
                        <img src="../FrontEnd/res/IconeSauvegarder.png" height="25px"/> Enregistrer
                    </button>`;
        }
    }

    async ModifierPersonne(idPersonne)
    {
        try
        {
            const token = Historique;

            const inputNom                 = document.getElementById("inputNom");
            const inputPrenom              = document.getElementById("inputPrenom");
            const selectSexe               = document.getElementById("selectSexe");
            const selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
            const selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
            const selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");

            if((inputNom.value === '') || (inputPrenom.value === '') || (selectSexe.value === ''))
            {
                this.toast("toastErreurCertainsChampsObligatoiresSontVides");
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
            }, token);

            if(Result === 200)
            {
                this.toast("toastSuccesModifierPersonne");
                const nouvellePersonne = await this.model.GetPersonne(idPersonne, token);
                let liRencontre = document.getElementById(`personne_${idPersonne}`);
                if(liRencontre != null)
                {
                    liRencontre.innerHTML = this.RemplirLiPersonnePendantModification(nouvellePersonne);
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

    RemplirLiPersonnePendantModification(personne)
    {
        let li =  `<div class="row">
                       <div class="col">
                           ${personne.prenom} ${personne.nom} `
        if(personne.sexe ===1)
        {
            li += `<img src="../FrontEnd/res/IconeSexeMasculin.png" height="25px"/>`;
        }
        else if(personne.sexe === 0)
        {
            li += `<img src="../FrontEnd/res/IconeSexeFeminin.png" height="25px"/>`;
        }
        li +=     `</div>
                       <div class="col-1">
                           <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalCreerPersonne" onclick="indexController.InitialiserChampsModificationPersonne('${personne.id}')">
                               <img src="../FrontEnd/res/IconeModification.png" height="25px"/>
                           </button>
                           <button type="button" class="btn btn-danger" onclick="indexController.SupprimerPersonne('${personne.id}')">
                               <img src="../FrontEnd/res/IconeSuppression.png" height="25px"/>
                           </button>
                       </div>
                   </div>`;
        return li;
    }

    async SupprimerPersonne(idPersonne)
    {
        if(confirm('Voulez-vous supprimer cette personne ?'))
        {
            try
            {
                const token = Historique;

                const Result = await this.model.SupprimerPersonne({
                    'idPersonneARencontrer' : idPersonne
                }, token);

                if(Result === 200)
                {
                    const li = document.getElementById(`personne_${idPersonne}`);
                    if(li.parentNode)
                    {
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