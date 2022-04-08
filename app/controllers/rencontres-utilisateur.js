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



class RencontreUtilisateurController extends BaseController
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
                const listeRencontres = await this.model.GetListeRencontresDeUtilisateurConnecte(token, ParseJwt(token).id);
                let listeHtmlRencontres = "";

                ulListeRencontres.innerHTML = '<img src="../../res/Loader.gif"/>';

                for(const rencontre of listeRencontres)
                {
                    const utilisateur = await this.model.GetUtilisateur(rencontre.idUtilisateur, token);
                    const personne = await this.model.GetPersonne(rencontre.idPersonneRencontree, token);
                    listeHtmlRencontres += this.CreerLigne(rencontre, utilisateur, personne)
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

    CreerLigne(rencontre, utilisateur, personne)
    {
        return `<li class="liRencontre" id="rencontre_${rencontre.id}">
                    <div class="row">
                        <div class="col">
                            Vous avez rencontr&eacute; ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.<br/>
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
                    </div>
                </li>`
    }
}

window.rencontreUtilisateurController= new RencontreUtilisateurController()