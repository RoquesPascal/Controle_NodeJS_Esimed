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
        this.CreerLesSelectPourLesRencontres()
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

    CreerLesSelectPourLesRencontres()
    {
        const selectDateJour  = document.getElementById("selectDateJour");
        const selectDateMois  = document.getElementById("selectDateMois");
        const selectDateAnnee = document.getElementById("selectDateAnnee");
        const selectNote      = document.getElementById("selectNote");
        const valeurJour      = 31;
        const valeurMois      = 12;
        const valeurAnnee     = 2022;
        const valeurNote      = 10;



        for(let i = 0 ; i <= valeurNote ; i++)
        {
            selectNote.innerHTML += `<option value="${i}">${i}</option>`;
        }
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
    }

    async CreerRencontre()
    {
        const selectPersonnesARencontrer = document.getElementById("selectPersonnesARencontrer");
        const selectDateJour             = document.getElementById("selectDateJour");
        const selectDateMois             = document.getElementById("selectDateMois");
        const selectDateAnnee            = document.getElementById("selectDateAnnee");
        const selectNote                 = document.getElementById("selectNote");
        const textAreaCommentaire        = document.getElementById("textAreaCommentaire");

        try
        {
            const token = Historique;

            const Result = await this.model.CreerRencontre({
                'idPersonneRencontree' : selectPersonnesARencontrer.value,
                'dateRencontreJour'    : selectDateJour.value,
                'dateRencontreMois'    : selectDateMois.value,
                'dateRencontreAnnee'   : selectDateAnnee.value,
                'note'                 : selectNote.value,
                'commentaire'          : textAreaCommentaire.value
            }, token);

            if(Result === 201)
            {
                this.toast("toastSuccesCreerRencontre");
            }
            else if(Result === 400)
            {
                this.toast("toastErreurCreerRencontre");
            }
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurCreerRencontre");
        }
    }
}

window.creerRencontreController= new CreerRencontreController()