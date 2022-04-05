let   Historique       = []
const HistoriqueCle    = "HistoriqueAppliRencontre"
const AncienHistorique = localStorage.getItem(HistoriqueCle)
if(AncienHistorique != null)
{
    Historique = JSON.parse(AncienHistorique)
}



class IndexController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
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

            const jwtEstValide = this.ParseJwt(token);
            const currentTimestamp = new Date().getTime() / 1000;
            if(jwtEstValide.id && (jwtEstValide.exp > currentTimestamp))
            {
                localStorage.setItem(HistoriqueCle, JSON.stringify(token));
                navigate("index");
            }
        }
        catch(e)
        {
            console.log(e);
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

            const jwtEstValide = this.ParseJwt(token);
            const currentTimestamp = new Date().getTime() / 1000;
            if(jwtEstValide.id && (jwtEstValide.exp > currentTimestamp))
            {
                localStorage.setItem(HistoriqueCle, JSON.stringify(token));
                navigate("index");
            }
        }
        catch(e)
        {
            console.log(e);
        }
        finally
        {
            this.toast("bonjourToast");
        }
    }

    ParseJwt(token)
    {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

}

window.indexController = new IndexController()