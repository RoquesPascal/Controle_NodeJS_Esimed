let   Historique       = []
const HistoriqueCle    = "HistoriqueAppliRencontre"
const AncienHistorique = sessionStorage.getItem(HistoriqueCle)

class BaseController
{
    constructor()
    {
        this.setBackButtonView('login')

        if((AncienHistorique != null) && this.JwtEstValide(AncienHistorique))
        {
            Historique = JSON.parse(AncienHistorique)
        }
    }

    AfficherPseudo()
    {
        let affichagePseudo = document.getElementById("dropDownMenu");
        if (affichagePseudo != null)
        {
            try {
                const token = this.ParseJwt(Historique);
                affichagePseudo.innerText = token.pseudo;
            } catch (e) {
                console.log(e);
            }
        }
    }

    JwtEstValide(token)
    {
        const jwtEstValide = this.ParseJwt(token);
        const currentTimestamp = new Date().getTime() / 1000;
        return (jwtEstValide.id && (jwtEstValide.exp > currentTimestamp));
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

    toast(elemId)
    {
        const toast = new bootstrap.Toast(document.getElementById(elemId))
        toast.show()
    }

    setBackButtonView(view)
    {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
}
