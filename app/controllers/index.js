let   Historique       = []
const HistoriqueCle    = "HistoriqueAppliRencontre"
const AncienHistorique = sessionStorage.getItem(HistoriqueCle)


function ParseJwt(token)
{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function JwtEstValide(token)
{
    const jwtEstValide = ParseJwt(token);
    const currentTimestamp = new Date().getTime() / 1000;
    return (jwtEstValide.id && (jwtEstValide.exp > currentTimestamp));
}

if((AncienHistorique != null) && JwtEstValide(AncienHistorique))
{
    Historique = JSON.parse(AncienHistorique)
}

function AfficherPseudo()
{
    let affichagePseudo = document.getElementById("dropDownMenu");
    if(affichagePseudo != null)
    {
        try
        {
            const token = ParseJwt(Historique);
            affichagePseudo.innerText = token.pseudo;
        }
        catch(e)
        {
            console.log(e);
        }
    }
}



class IndexController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
        AfficherPseudo()
        this.AfficherListeRencontres().then(r => {})
    }

    async AfficherListeRencontres()
    {
        let ulListeRencontres = document.getElementById("ulListeRencontres");
        if(ulListeRencontres != null)
        {
            try
            {
                const token = Historique;
                const listeRencontres = await this.model.GetListeRencontres(token);
                let listeHtmlRencontres = "";

                ulListeRencontres.innerHTML = '<img src="../../res/Loader.gif"/>';

                for(const rencontre of listeRencontres)
                {
                    const utilisateur = await this.model.GetUtilisateur(rencontre.idUtilisateur, token);
                    const personne = await this.model.GetPersonne(rencontre.idPersonneRencontree, token);
                    const estProprietaireRencontre = (utilisateur.id === ParseJwt(token).id); //Permet de savoir si la personne connectée a créé cette rencontre pour ajouter les boutons modifier et supprmier
                    listeHtmlRencontres += this.CreerLigne(rencontre, utilisateur, personne, estProprietaireRencontre)
                }

                ulListeRencontres.innerHTML = listeHtmlRencontres;
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurGetListeRencontres");
            }
        }
    }

    CreerLigne(rencontre, utilisateur, personne, estProprietaireRencontre)
    {
        let li =   `<li class="liRencontre" id="rencontre_${rencontre.id}">
                        <div class="row">
                            <div class="col">
                                ${utilisateur.pseudo} a rencontr&eacute; ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.<br/>
                                La note est de ${rencontre.note}/10. Le commentaire est : ${rencontre.commentaire}
                            </div>`
        if(estProprietaireRencontre)
        {
            let liBoutons =
                            `<div class="col-1">
                                <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalModifierRencontre" onclick="indexController.InitialiserChamps('${rencontre.id}')">
                                    <img src="../res/IconeModification.png" height="25px"/>
                                </button>
                                <button type="button" class="btn btn-danger" onclick="indexController.SupprimerRencontre('${rencontre.id}')">
                                    <img src="../res/IconeSuppression.png" height="25px"/>
                                </button>
                            </div>`
            li += liBoutons;
        }
        li += `
                        </div>
                    </li>`;
        return li;
    }

    Deconexion()
    {
        sessionStorage.clear();
        localStorage.clear();
        navigate("login");
    }

    async InitialiserChamps(idRencontre)
    {
        try
        {
            const token = Historique;
            const rencontre = await this.model.GetRencontre(idRencontre, token);

            let selectDateJour               = document.getElementById("selectDateJour");
            let selectDateMois               = document.getElementById("selectDateMois");
            let selectDateAnnee              = document.getElementById("selectDateAnnee");
            let selectNote                   = document.getElementById("selectNote");
            let textAreaCommentaire          = document.getElementById("textAreaCommentaire");
            let boutonModifierRencontreModal = document.getElementById("boutonModifierRencontreModal");
            const valeurJour        = 31;
            const valeurMois        = 12;
            const valeurAnnee       = new Date(Date.now()).getFullYear();
            const valeurNote        = 10;

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
            for(let i = 0 ; i <= valeurNote ; i++)
            {
                selectNote.innerHTML += `<option value="${i}">${i}</option>`;
            }

            const dateDeLaRencontre = rencontre.dateRencontre.toString(); //Car les GetDate() et tout ne fonctionnent pas
            selectDateJour.value      = `${parseInt(dateDeLaRencontre[8] + dateDeLaRencontre[9])}`;
            selectDateMois.value      = `${parseInt(dateDeLaRencontre[5] + dateDeLaRencontre[6])}`;
            selectDateAnnee.value     = `${parseInt(dateDeLaRencontre[0] + dateDeLaRencontre[1] + dateDeLaRencontre[2] + dateDeLaRencontre[3])}`;
            selectNote.value          = `${rencontre.note}`;
            textAreaCommentaire.value = `${rencontre.commentaire}`;

            boutonModifierRencontreModal.innerHTML = `
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        <img src="../res/IconeRetour.png" height="25px"/> Annuler
                    </button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="indexController.ModifierRencontre('${rencontre.id}')">
                        <img src="../res/IconeSauvegarder.png" height="25px"/> Enregistrer
                    </button>`;
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurChargementRencontre");
        }
    }

    async Login()
    {
        const inputEmail      = document.getElementById("inputEmail")
        const inputMotDePasse = document.getElementById("inputMotDePasse")

        try
        {
            const token = await this.model.Login({
                'email'      : inputEmail.value,
                'motDePasse' : inputMotDePasse.value
            })

            if(JwtEstValide(token))
            {
                sessionStorage.setItem(HistoriqueCle, JSON.stringify(token));
                navigate("index");
            }
        }
        catch(e)
        {
            console.log(e);
        }
        finally
        {
            this.toast("toastErreurLogin");
        }
    }

    async ModifierRencontre(idRencontre)
    {
        try
        {
            const token = Historique;
            const rencontre = await this.model.GetRencontre(idRencontre, token);

            let selectDateJour      = document.getElementById("selectDateJour");
            let selectDateMois      = document.getElementById("selectDateMois");
            let selectDateAnnee     = document.getElementById("selectDateAnnee");
            let selectNote          = document.getElementById("selectNote");
            let textAreaCommentaire = document.getElementById("textAreaCommentaire");

            const Result = await this.model.ModifierRencontre({
                'idRencontre'        : rencontre.id,
                'dateRencontreJour'  : selectDateJour.value,
                'dateRencontreMois'  : selectDateMois.value,
                'dateRencontreAnnee' : selectDateAnnee.value,
                'note'               : selectNote.value,
                'commentaire'        : textAreaCommentaire.value
            }, token);

            if(Result === 200)
            {
                this.toast("toastSuccesModifierRencontre");
                const nouvelleRencontre = await this.model.GetRencontre(idRencontre, token);
                let liRencontre = document.getElementById(`rencontre_${nouvelleRencontre.id}`);
                if(liRencontre != null)
                {
                    const utilisateur = await this.model.GetUtilisateur(nouvelleRencontre.idUtilisateur, token);
                    const personne = await this.model.GetPersonne(nouvelleRencontre.idPersonneRencontree, token);
                    liRencontre.innerHTML = this.RemplirLiRencontrePendantModification(nouvelleRencontre, utilisateur, personne);
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

    RemplirLiRencontrePendantModification(rencontre, utilisateur, personne)
    {
        return `<div class="row">
                    <div class="col">
                        ${utilisateur.pseudo} a rencontr&eacute; ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.<br/>
                        La note est de ${rencontre.note}/10. Le commentaire est : ${rencontre.commentaire}
                    </div>
                    <div class="col-1">
                        <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalCreerPersonne" onclick="indexController.InitialiserChamps('${rencontre.id}')">
                            <img src="../res/IconeModification.png" height="25px"/>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="indexController.SupprimerRencontre('${rencontre.id}')">
                            <img src="../res/IconeSuppression.png" height="25px"/>
                        </button>
                    </div>
                </div>`;
    }

    async Signup()
    {
        const inputPseudo     = document.getElementById("inputPseudo")
        const inputEmail      = document.getElementById("inputEmail")
        const inputMotDePasse = document.getElementById("inputMotDePasse")

        try
        {
            const token = await this.model.Signup({
                "pseudo"     : inputPseudo.value,
                'email'      : inputEmail.value,
                'motDePasse' : inputMotDePasse.value
            })

            if(JwtEstValide(token))
            {
                sessionStorage.setItem(HistoriqueCle, JSON.stringify(token));
                navigate("index");
            }
        }
        catch(e)
        {
            console.log(e);
        }
        finally
        {
            this.toast("toastErreurSignup");
        }
    }

    async SupprimerRencontre(idRencontre)
    {
        if(confirm('Voulez-vous supprimer cette rencontre ?'))
        {
            try
            {
                const token = Historique;

                const Result = await this.model.SupprimerRencontre({
                    'idRencontre' : idRencontre
                }, token);

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

window.indexController = new IndexController()