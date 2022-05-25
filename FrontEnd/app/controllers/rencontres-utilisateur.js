class RencontreUtilisateurController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
        this.AfficherPseudo()
        this.AfficherListeRencontres().then(r => {})
        this.ChangerListeAAfficher(true)
    }

    async AfficherListeRencontres()
    {
        let ulListeRencontres                = document.getElementById("ulListeRencontres");
        let ulListeRencontresAVenir          = document.getElementById("ulListeRencontresAVenir");
        let buttonListeRencontres_Bleu       = document.getElementById("buttonListeRencontres_Bleu");
        let buttonListeRencontresAVenir_Gris = document.getElementById("buttonListeRencontresAVenir_Gris");
        let buttonListeRencontres_Gris       = document.getElementById("buttonListeRencontres_Gris");
        let buttonListeRencontresAVenir_Bleu = document.getElementById("buttonListeRencontresAVenir_Bleu");
        let compteurRencontresPassees        = 0;
        let compteurRencontresAVenir         = 0;


        if((ulListeRencontres != null) && (ulListeRencontresAVenir != null))
        {
            try
            {
                const listeRencontres = await this.model.GetListeRencontresDeUtilisateurConnecte(this.JWT, this.ParseJwt(this.JWT).id);
                let listeHtmlRencontresPassees = "";
                let listeHtmlRencontresFutures = "";

                ulListeRencontres.innerHTML = '<img src="../../FrontEnd/res/Loader.gif"/>';
                ulListeRencontresAVenir.innerHTML = '<img src="../../FrontEnd/res/Loader.gif"/>';

                for(const rencontre of listeRencontres)
                {
                    const personne = await this.model.GetPersonne(rencontre.idPersonneRencontree, this.JWT);
                    if(this.EstRencontreDejaFaite(rencontre))
                    {
                        listeHtmlRencontresPassees += this.CreerLigneRencontrePassee(rencontre, personne);
                        compteurRencontresPassees++;
                    }
                    else
                    {
                        listeHtmlRencontresFutures += this.CreerLigneRencontreFuture(rencontre, personne);
                        compteurRencontresAVenir++;
                    }
                }
                ulListeRencontres.innerHTML = listeHtmlRencontresPassees;
                ulListeRencontresAVenir.innerHTML = listeHtmlRencontresFutures;
                buttonListeRencontres_Bleu      .innerText += ` (${compteurRencontresPassees})`;
                buttonListeRencontresAVenir_Gris.innerText += ` (${compteurRencontresAVenir})`;
                buttonListeRencontres_Gris      .innerText += ` (${compteurRencontresPassees})`;
                buttonListeRencontresAVenir_Bleu.innerText += ` (${compteurRencontresAVenir})`;
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurGetListeRencontres");
            }
        }
    }

    ChangerListeAAfficher(afficherListeRencontres)
    {
        let ulListeRencontres         = document.getElementById("ulListeRencontres");
        let ulListeRencontresAVenir   = document.getElementById("ulListeRencontresAVenir");
        let bouttonsRencontresPassees = document.getElementById("bouttonsRencontresPassees");
        let bouttonsRencontresFutures = document.getElementById("bouttonsRencontresFutures");

        if((ulListeRencontres != null) && (ulListeRencontresAVenir != null))
        {
            if(afficherListeRencontres)
            {
                ulListeRencontres.style.display = 'block';
                ulListeRencontresAVenir.style.display = 'none';
                bouttonsRencontresPassees.style.display = 'block';
                bouttonsRencontresFutures.style.display = 'none';
            }
            else
            {
                ulListeRencontres.style.display = 'none';
                ulListeRencontresAVenir.style.display = 'block';
                bouttonsRencontresPassees.style.display = 'none';
                bouttonsRencontresFutures.style.display = 'block';
            }
        }
    }

    CreerLigneRencontreFuture(rencontre, personne)
    {
        return `<li class="liRencontre" id="rencontre_${rencontre.id}">
                    <div class="row">
                        <div class="col">
                            Vous avez rendez-vous avec ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalModifierRencontre" onclick="rencontreUtilisateurController.InitialiserChamps('${rencontre.id}')">
                                <img src="../FrontEnd/res/IconeModification.png" height="25px"/>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="rencontreUtilisateurController.SupprimerRencontre('${rencontre.id}')">
                                <img src="../FrontEnd/res/IconeSuppression.png" height="25px"/>
                            </button>
                        </div>
                    </div>
                </li>`;
    }

    CreerLigneRencontrePassee(rencontre, personne)
    {
        return `<li class="liRencontre" id="rencontre_${rencontre.id}">
                    <div class="row">
                        <div class="col">
                            Vous avez rencontr&eacute; ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.<br/>
                            La note est de ${rencontre.note}/10. Le commentaire est : ${rencontre.commentaire}
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalModifierRencontre" onclick="rencontreUtilisateurController.InitialiserChamps('${rencontre.id}')">
                                <img src="../FrontEnd/res/IconeModification.png" height="25px"/>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="rencontreUtilisateurController.SupprimerRencontre('${rencontre.id}')">
                                <img src="../FrontEnd/res/IconeSuppression.png" height="25px"/>
                            </button>
                        </div>
                    </div>
                </li>`;
    }

    EstRencontreDejaFaite(rencontre)
    {
        const dateActuelle = new Date(Date.now());
        const dateDeLaRencontre = rencontre.dateRencontre.toString(); //Car les GetDate() et tout ne fonctionnent pas

        if(dateActuelle.getFullYear() > parseInt(dateDeLaRencontre[0] + dateDeLaRencontre[1] + dateDeLaRencontre[2] + dateDeLaRencontre[3])) //Année actuelle > année rencontre
            return true;
        else if(dateActuelle.getFullYear() < parseInt(dateDeLaRencontre[0] + dateDeLaRencontre[1] + dateDeLaRencontre[2] + dateDeLaRencontre[3])) //Année actuelle < année rencontre
             return false;
        else
        {
            if(dateActuelle.getMonth() + 1 > parseInt(dateDeLaRencontre[5] + dateDeLaRencontre[6])) //Mois actuel > mois rencontre
                return true;
            else if(dateActuelle.getMonth() + 1 < parseInt(dateDeLaRencontre[5] + dateDeLaRencontre[6])) //Mois actuel < mois rencontre
                return false;
            else
            {
                if(dateActuelle.getDate() >= parseInt(dateDeLaRencontre[8] + dateDeLaRencontre[9])) //Jour actuel >= jour rencontre
                    return true;
                else //Jour actuel < jour rencontre
                    return false;
            }
        }
    }

    async InitialiserChamps(idRencontre)
    {
        try
        {
            const rencontre = await this.model.GetRencontre(idRencontre, this.JWT);

            let selectDateJour                   = document.getElementById("selectDateJour");
            let selectDateMois                   = document.getElementById("selectDateMois");
            let selectDateAnnee                  = document.getElementById("selectDateAnnee");
            let boutonModifierRencontreModal     = document.getElementById("boutonModifierRencontreModal");
            let champsNoteEtCommentaireEtPartage = document.getElementById("champsNoteEtCommentaireEtPartage");
            const valeurJour                     = 31;
            const valeurMois                     = 12;
            const valeurAnnee                    = new Date(Date.now()).getFullYear() + 10;
            const valeurNote                     = 10;

            selectDateJour.innerHTML = `<option value="">Jour</option>`;
            selectDateMois.innerHTML = `<option value="">Mois</option>`;
            selectDateAnnee.innerHTML = `<option value="">Ann&eacute;e</option>`;

            for(let i = 1 ; i <= valeurJour ; i++)
            {
                selectDateJour.innerHTML += `<option value="${i}">${i}</option>`;
            }
            for(let i = 1 ; i <= valeurMois ; i++)
            {
                selectDateMois.innerHTML += `<option value="${i}">${i}</option>`;
            }
            for(let i = valeurAnnee ; i >= 1900 ; i--)
            {
                selectDateAnnee.innerHTML += `<option value="${i}">${i}</option>`;
            }

            const dateDeLaRencontre = rencontre.dateRencontre.toString(); //Car les GetDate() et tout ne fonctionnent pas
            selectDateJour.value  = `${parseInt(dateDeLaRencontre[8] + dateDeLaRencontre[9])}`;
            selectDateMois.value  = `${parseInt(dateDeLaRencontre[5] + dateDeLaRencontre[6])}`;
            selectDateAnnee.value = `${parseInt(dateDeLaRencontre[0] + dateDeLaRencontre[1] + dateDeLaRencontre[2] + dateDeLaRencontre[3])}`;

            if(this.EstRencontreDejaFaite(rencontre))
            {
                champsNoteEtCommentaireEtPartage.innerHTML = `
                    <div class="row marginBottom10px">
                        <div class="col-5">Notation de 0 &agrave; 10</div>
                        <div class="col-7">
                            <select id="selectNote">
                                <option value="">Note</option>
                            </select>
                        </div>
                    </div>
                    <div class="row marginBottom10px">
                        <div class="col-5">Commentaire</div>
                        <div class="col-7">
                            <textarea id="textAreaCommentaire" rows="5" cols="25"></textarea>
                        </div>
                    </div>
                    <div class="row marginBottom10px">
                        <div class="col-5">Partager le commentaire ? *</div>
                        <div class="col-7">
                            <select id="selectPartage">
                                <option value="">Partage</option>
                                <option value="1">Oui</option>
                                <option value="0">Non</option>
                            </select>
                        </div>
                    </div>`;

                let selectNote          = document.getElementById("selectNote");
                let textAreaCommentaire = document.getElementById("textAreaCommentaire");
                let selectPartage       = document.getElementById("selectPartage");
                for(let i = 0 ; i <= valeurNote ; i++)
                {
                    selectNote.innerHTML += `<option value="${i}">${i}</option>`;
                }
                selectNote.value          = `${rencontre.note}`;
                textAreaCommentaire.value = `${rencontre.commentaire}`;
                if(rencontre.partage)
                    selectPartage.value = '1';
                else
                    selectPartage.value = '0';
            }
            else
                champsNoteEtCommentaireEtPartage.innerHTML = "";

            boutonModifierRencontreModal.innerHTML = `
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        <img src="../FrontEnd/res/IconeRetour.png" height="25px"/> Annuler
                    </button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="rencontreUtilisateurController.ModifierRencontre('${rencontre.id}')">
                        <img src="../FrontEnd/res/IconeSauvegarder.png" height="25px"/> Enregistrer
                    </button>`;
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurChargementRencontre");
        }
    }

    async ModifierRencontre(idRencontre)
    {
        try
        {
            let selectDateJour      = document.getElementById("selectDateJour");
            let selectDateMois      = document.getElementById("selectDateMois");
            let selectDateAnnee     = document.getElementById("selectDateAnnee");
            let selectNote          = document.getElementById("selectNote");
            let textAreaCommentaire = document.getElementById("textAreaCommentaire");
            let selectPartage       = document.getElementById("selectPartage");

            if((selectPartage != null) &&(selectPartage.value === ''))
            {
                this.toast("toastErreurCertainsChampsObligatoiresSontVides");
                return;
            }

            let Result;
            if((selectNote != null) || (textAreaCommentaire != null) || (selectPartage != null))
            {
                Result = await this.model.ModifierRencontre({
                    'idRencontre'        : idRencontre,
                    'dateRencontreJour'  : selectDateJour.value,
                    'dateRencontreMois'  : selectDateMois.value,
                    'dateRencontreAnnee' : selectDateAnnee.value,
                    'note'               : selectNote.value,
                    'commentaire'        : textAreaCommentaire.value,
                    'partage'            : selectPartage.value
                }, this.JWT);
            }
            else
            {
                Result = await this.model.ModifierRencontre({
                    'idRencontre'        : idRencontre,
                    'dateRencontreJour'  : selectDateJour.value,
                    'dateRencontreMois'  : selectDateMois.value,
                    'dateRencontreAnnee' : selectDateAnnee.value,
                    'note'               : 0,
                    'commentaire'        : "",
                    'partage'            : 0
                }, this.JWT);
            }

            if(Result === 200)
            {
                this.toast("toastSuccesModifierRencontre");
                const nouvelleRencontre = await this.model.GetRencontre(idRencontre, this.JWT);
                let liRencontre = document.getElementById(`rencontre_${nouvelleRencontre.id}`);
                if(liRencontre != null)
                {
                    const personne = await this.model.GetPersonne(nouvelleRencontre.idPersonneRencontree, this.JWT);
                    liRencontre.innerHTML = this.RemplirLiRencontrePendantModification(nouvelleRencontre, personne);
                }
            }
            else if(Result === 400)
            {
                this.toast("toastErreurModifierRencontre");
            }
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurModifierRencontre");
        }
    }

    RemplirLiRencontrePendantModification(rencontre, personne)
    {
        if(this.EstRencontreDejaFaite(rencontre))
            return `<div class="row">
                        <div class="col">
                            Vous avez rencontr&eacute; ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.<br/>
                            La note est de ${rencontre.note}/10. Le commentaire est : ${rencontre.commentaire}
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalModifierRencontre" onclick="rencontreUtilisateurController.InitialiserChamps('${rencontre.id}')">
                                <img src="../FrontEnd/res/IconeModification.png" height="25px"/>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="rencontreUtilisateurController.SupprimerRencontre('${rencontre.id}')">
                                <img src="../FrontEnd/res/IconeSuppression.png" height="25px"/>
                            </button>
                        </div>
                    </div>`;
        else
            return `<div class="row">
                        <div class="col">
                            Vous avez rendez-vous avec ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalModifierRencontre" onclick="rencontreUtilisateurController.InitialiserChamps('${rencontre.id}')">
                                <img src="../FrontEnd/res/IconeModification.png" height="25px"/>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="rencontreUtilisateurController.SupprimerRencontre('${rencontre.id}')">
                                <img src="../FrontEnd/res/IconeSuppression.png" height="25px"/>
                            </button>
                        </div>
                    </div>`;
    }

    async SupprimerRencontre(idRencontre)
    {
        if(confirm('Voulez-vous supprimer cette rencontre ?'))
        {
            try
            {
                const Result = await this.model.SupprimerRencontre({
                    'idRencontre' : idRencontre
                }, this.JWT);

                if(Result === 200)
                {
                    const li = document.getElementById(`rencontre_${idRencontre}`);
                    if(li.parentNode)
                    {
                        li.parentNode.removeChild(li);
                    }
                    this.toast("toastSuccesSupprimerRencontre");
                }
                else if(Result === 400)
                {
                    this.toast("toastErreurSupprimerRencontre");
                }
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurSupprimerRencontre");
            }
        }
    }
}

window.rencontreUtilisateurController= new RencontreUtilisateurController()