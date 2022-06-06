class BaseController
{
    constructor()
    {
        this.setBackButtonView('login')
        this.role_membre     = "membre";
        this.role_moderateur = "moderateur";

        this.HistoriqueCle    = "HistoriqueAppliRencontre"
        const AncienHistorique = sessionStorage.getItem(this.HistoriqueCle)
        if((AncienHistorique != null) && this.JwtEstValide(AncienHistorique))
            this.JWT = JSON.parse(AncienHistorique);
        else
            this.JWT = [];

        this.AfficherDropDown();
    }

    AfficherDropDown()
    {
        let dropDown = document.getElementById("dropDown");

        if(dropDown != null)
        {
            let dropDownInnerHTMTL = `<button class="btn btn-secondary dropdown-toggle" type="button" id="dropDownMenu" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
                                          <li><a class="dropdown-item" onclick="navigate('index');"><img src="../FrontEnd/res/Images/IconeMenuPrincipal_Grise.png" height="25px"/> Menu principal</a></li>
                                          <li><hr class="dropdown-divider"></li>
                                          <li><a class="dropdown-item" onclick="navigate('creer-rencontre');"><img src="../FrontEnd/res/Images/IconeAjout_Grise.png" height="25px"/> Cr&eacute;ez votre rencontre</a></li>
                                          <li><a class="dropdown-item" onclick="navigate('rencontres-utilisateur');"><img src="../FrontEnd/res/Images/IconeVosRencontres_Grise.png" height="25px"/> Vos rencontres</a></li>`;
            if(this.EstRole_moderateur())
                dropDownInnerHTMTL +=    `<li><hr class="dropdown-divider"></li>
                                          <li>
                                              <span class="dropdown-item-text color_RougeFonce_7A0008 fontSizePlus20Pourcents">
                                                    <img src="../FrontEnd/res/Images/IconeModerateur_Orange.png" height="35px"/> Espace mod&eacute;ration <img src="../FrontEnd/res/Images/IconeModerateur_Orange.png" height="35px"/>
                                              </span>
                                          </li>
                                          <li><a class="dropdown-item color_RougeFonce_7A0008" onclick="navigate('rencontres-moderation')"><img src="../FrontEnd/res/Images/IconeRencontres_Orange.png" height="25px"/> Rencontres des utilisateurs</a></li>`;

            dropDownInnerHTMTL +=        `<li><hr class="dropdown-divider"></li>
                                          <li><a class="dropdown-item" onclick="indexController.Deconnexion()"><img src="../FrontEnd/res/Images/IconeDeconnexion_Grise.png" height="25px"/> Se d&eacute;connecter</a></li>
                                      </ul>`;
            dropDown.innerHTML = dropDownInnerHTMTL;
            this.AfficherPseudo();
        }
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

    EstRole_moderateur()
    {
        const utilisateur = this.ParseJwt(this.JWT);

        for(let i = 0 ; i < utilisateur.roles.length ; i++)
        {
            if(utilisateur.roles[i] == this.role_moderateur)
                return true;
        }

        return false;
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
