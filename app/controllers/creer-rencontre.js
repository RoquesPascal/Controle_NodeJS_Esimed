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



class CreerRencontreController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
        AfficherPseudo()
        this.AfficherListePersonnesARencontrer().then(r => {})
    }

    async AfficherListePersonnesARencontrer()
    {
        let selectPersonnesARencontrer = document.getElementById("selectPersonnesARencontrer");
        if(selectPersonnesARencontrer != null)
        {
            try
            {
                const token = Historique;
                const listePersonnesARencontrer = await this.model.GetListePersonnesARencontrer(token);
                let listeHtmlPersonnesARencontrer = "";

                for(const personne of listePersonnesARencontrer)
                {
                    listeHtmlPersonnesARencontrer += this.CreerLigne(personne)
                }

                selectPersonnesARencontrer.innerHTML += listeHtmlPersonnesARencontrer;
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurGetListePersonnesARencontrer");
            }
        }
    }

    CreerLigne(personne)
    {
        return `<option value="${personne.id}">${personne.prenom} ${personne.nom}</option>`;
    }
}

window.creerRencontreController= new CreerRencontreController()