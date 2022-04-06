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
    try
    {
        let affichagePseudo = document.getElementById("dropDownMenu");
        const token = ParseJwt(Historique);
        affichagePseudo.innerText = token.pseudo;
    }
    catch(e)
    {
        console.log(e);
    }
}



class IndexController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
        AfficherPseudo()
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