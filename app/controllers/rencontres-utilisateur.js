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
        this.ChangerListeAAfficher(true)
    }

    async AfficherListeRencontres()
    {
        let ulListeRencontres = document.getElementById("ulListeRencontres");
        let ulListeRencontresAVenir = document.getElementById("ulListeRencontresAVenir");
        if((ulListeRencontres != null) && (ulListeRencontresAVenir != null))
        {
            try
            {
                const token = Historique;
                const listeRencontres = await this.model.GetListeRencontresDeUtilisateurConnecte(token, ParseJwt(token).id);
                let listeHtmlRencontresPassees = "";
                let listeHtmlRencontresFutures = "";

                ulListeRencontres.innerHTML = '<img src="../../res/Loader.gif"/>';
                ulListeRencontresAVenir.innerHTML = '<img src="../../res/Loader.gif"/>';

                for(const rencontre of listeRencontres)
                {
                    const personne = await this.model.GetPersonne(rencontre.idPersonneRencontree, token);
                    if(this.EstRencontreDejaFaite(rencontre))
                        listeHtmlRencontresPassees += this.CreerLigneRencontrePassee(rencontre, personne);
                    else
                        listeHtmlRencontresFutures += this.CreerLigneRencontreFuture(rencontre, personne);
                }
                ulListeRencontres.innerHTML = listeHtmlRencontresPassees;
                ulListeRencontresAVenir.innerHTML = listeHtmlRencontresFutures;
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
        let ulListeRencontres                = document.getElementById("ulListeRencontres");
        let ulListeRencontresAVenir          = document.getElementById("ulListeRencontresAVenir");
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
                            <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalModifierRencontre" onclick="indexController.InitialiserChamps('${rencontre.id}')">
                                <img src="../res/IconeModification.png" height="25px"/>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="indexController.SupprimerRencontre('${rencontre.id}')">
                                <img src="../res/IconeSuppression.png" height="25px"/>
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
                            <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalModifierRencontre" onclick="indexController.InitialiserChamps('${rencontre.id}')">
                                <img src="../res/IconeModification.png" height="25px"/>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="indexController.SupprimerRencontre('${rencontre.id}')">
                                <img src="../res/IconeSuppression.png" height="25px"/>
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
}

window.rencontreUtilisateurController= new RencontreUtilisateurController()