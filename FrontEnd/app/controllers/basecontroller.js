class BaseController
{
    constructor()
    {
        this.setBackButtonView('login')
        this.role_membre     = "membre";
        this.role_moderateur = "moderateur";

        this.HistoriqueLoginCle = "HistoriqueLoginAppliRencontre"

        this.HistoriqueCle    = "HistoriqueAppliRencontre"
        const AncienHistorique = sessionStorage.getItem(this.HistoriqueCle)
        if((AncienHistorique != null) && this.JwtEstValide(AncienHistorique))
            this.JWT = JSON.parse(AncienHistorique);
        else
            this.JWT = [];

        this.AfficherDropDown();
    }

    AfficherChampsNoteEtCommentaireEtPartage()
    {
        let selectDateJour                      = document.getElementById("selectDateJour");
        let selectDateMois                      = document.getElementById("selectDateMois");
        let selectDateAnnee                     = document.getElementById("selectDateAnnee");
        let divChampsNoteEtCommentaireEtPartage = document.getElementById("divChampsNoteEtCommentaireEtPartage");

        let date = `${selectDateAnnee.value}`;
        if(selectDateMois.value < 10)
            date += `-0${selectDateMois.value}`;
        else
            date += `-${selectDateMois.value}`;
        if(selectDateJour.value < 10)
            date += `-0${selectDateJour.value}`;
        else
            date += `-${selectDateJour.value}`;

        if((!selectDateJour.value) || (!selectDateMois.value) || (!selectDateAnnee.value) || (!this.EstRencontreDejaFaite({'dateRencontre' : date})))
        {
            divChampsNoteEtCommentaireEtPartage.innerHTML = '';
            return;
        }

        if((divChampsNoteEtCommentaireEtPartage.innerHTML == '') && (selectDateJour.value != null) && (selectDateMois.value != null) && (selectDateAnnee.value != null) && (this.EstRencontreDejaFaite({'dateRencontre' : date})))
        {
            divChampsNoteEtCommentaireEtPartage.innerHTML =
                `<div class="row marginBottom10px">
                     <div class="col-5">Notation de 0 &agrave; 10</div>
                     <div class="col-7">
                         <select id="selectNote">
                             <option value="">Note</option>
                         </select>
                     </div>
                 </div>
                 <div class="row marginBottom10px">
                     <div class="col-5">Commentaire</div>
                     <div class="col-7">
                         <textarea id="textAreaCommentaire" rows="5" cols="33"></textarea>
                     </div>
                 </div>
                 <div class="row marginBottom10px">
                     <div class="col-5">Partager le commentaire ? *</div>
                     <div class="col-7">
                         <select id="selectPartage">
                             <option value="">Partage</option>
                             <option value="1">Oui</option>
                             <option value="0">Non</option>
                         </select>
                     </div>
                 </div>`;

            this.CreerLeSelectNotePourLesRencontres();
        }
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

    CreerLeSelectNotePourLesRencontres()
    {
        let   selectNote = document.getElementById("selectNote");
        const valeurNote = 10;

        for(let i = 0 ; i <= valeurNote ; i++)
        {
            selectNote.innerHTML += `<option value="${i}">${i}</option>`;
        }
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

    MettreLoginDansLeSessionStorage(login)
    {
        let listeLoginSessionStorage = JSON.parse(sessionStorage.getItem(this.HistoriqueLoginCle));
        let listeLogin = [];

        if(listeLoginSessionStorage != null)
            for(let loginDeLaListe of listeLoginSessionStorage)
                listeLogin.push(loginDeLaListe);
        listeLogin.push(login);
        sessionStorage.setItem(this.HistoriqueLoginCle, JSON.stringify(listeLogin));
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

window.baseController = new BaseController()
