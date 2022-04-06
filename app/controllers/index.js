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
                            ${utilisateur.pseudo} a rencontr&eacute; ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.<br/>
                            La note est de ${rencontre.note}/10. Le commentaire est : ${rencontre.commentaire}
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn btn-primary boutonModifierOuSupprimerRencontre">
                                <img src="../res/IconeModification.png" height="25px"/>
                            </button>
                            <button type="button" class="btn btn-danger boutonModifierOuSupprimerRencontre">
                                <img src="../res/IconeSuppression.png" height="25px"/>
                            </button>
                        </div>
                    </div>
                </li>`
    }

    Deconexion()
    {
        sessionStorage.clear();
        navigate("login");
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
}

window.indexController = new IndexController()