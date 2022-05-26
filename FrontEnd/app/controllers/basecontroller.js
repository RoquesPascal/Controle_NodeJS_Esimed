class BaseController
{
    constructor()
    {
        this.setBackButtonView('login')

        this.HistoriqueCle    = "HistoriqueAppliRencontre"
        const AncienHistorique = sessionStorage.getItem(this.HistoriqueCle)
        if((AncienHistorique != null) && this.JwtEstValide(AncienHistorique))
            this.JWT = JSON.parse(AncienHistorique);
        else
            this.JWT = [];
    }

    AfficherPseudo()
    {
        let affichagePseudo = document.getElementById("dropDownMenu");
        if (affichagePseudo != null)
        {
            try
            {
                const token = this.ParseJwt(this.JWT);
                affichagePseudo.innerText = token.pseudo;
            }
            catch (e)
            {
                console.log(e);
            }
        }
    }

    AfficherDate(date)
    {
        //return      jour       + '/' +        mois       + '/' +                 annee;
        return date[8] + date[9] + '/' + date[5] + date[6] + '/' + date[0] + date[1] + date[2] + date[3];
    }

    JwtEstValide(token)
    {
        const jwtEstValide = this.ParseJwt(token);
        const currentTimestamp = new Date().getTime() / 1000;
        return (jwtEstValide.id && (jwtEstValide.exp > currentTimestamp));
    }

    MettreLeJWTDansLeSessionStorage(token)
    {
        if(this.JwtEstValide(token))
        {
            sessionStorage.setItem(this.HistoriqueCle, JSON.stringify(token));
            this.JWT = token;
            navigate("index");
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
