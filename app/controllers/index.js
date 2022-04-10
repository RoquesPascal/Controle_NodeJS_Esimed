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
        this.AfficherListePersonnesARencontrer().then(r => {})
        this.ChangerListeAAfficher(true)
        this.InitialiserChamps().then(r => {})
    }

    async AfficherListePersonnesARencontrer()
    {
        let ulListePersonnesRencontrees  = document.getElementById("ulListePersonnesRencontrees");
        let ulListePersonnesARencontrer  = document.getElementById("ulListePersonnesARencontrer");

        if((ulListePersonnesRencontrees != null) && (ulListePersonnesARencontrer != null))
        {
            try
            {
                const token = Historique;
                let listePersonnes = await this.model.GetListePersonnesARencontrer(token);
                console.log(listePersonnes);
                let listeHtmlPersonnesRencontrees = "";
                let listeHtmlPersonnesARencontrer = "";

                ulListePersonnesRencontrees.innerHTML = '<img src="../../res/Loader.gif"/>';
                ulListePersonnesARencontrer.innerHTML = '<img src="../../res/Loader.gif"/>';

                for(const personne of listePersonnes)
                {
                    const rencontresCommunesUtilisateurPersonne = await this.model.GetRencontresCommunesUtilisateurPersonne(
                        {'idPersonneRencontree' : personne.id},
                        ParseJwt(token).id,
                        token
                    );
                    console.log(rencontresCommunesUtilisateurPersonne);

                    if(rencontresCommunesUtilisateurPersonne == 200)
                    {
                        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                        listeHtmlPersonnesRencontrees += this.CreerLigne(personne);
                    }
                    else
                    {
                        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                        listeHtmlPersonnesARencontrer += this.CreerLigne(personne);
                    }
                }
                ulListePersonnesRencontrees.innerHTML = listeHtmlPersonnesRencontrees;
                ulListePersonnesARencontrer.innerHTML = listeHtmlPersonnesARencontrer;
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurGetListePersonnes");
            }
        }
    }

    ChangerListeAAfficher(afficherListeRencontres)
    {
        let ulListePersonnesRencontrees  = document.getElementById("ulListePersonnesRencontrees");
        let ulListePersonnesARencontrer = document.getElementById("ulListePersonnesARencontrer");
        let bouttonsPersonnesRecontrees   = document.getElementById("bouttonsPersonnesRecontrees");
        let bouttonsPersonnesARencontrer   = document.getElementById("bouttonsPersonnesARencontrer");

        if((ulListePersonnesRencontrees != null) && (ulListePersonnesARencontrer != null))
        {
            if(afficherListeRencontres)
            {
                ulListePersonnesRencontrees.style.display = 'block';
                ulListePersonnesARencontrer.style.display = 'none';
                bouttonsPersonnesRecontrees.style.display = 'block';
                bouttonsPersonnesARencontrer.style.display = 'none';
            }
            else
            {
                ulListePersonnesRencontrees.style.display = 'none';
                ulListePersonnesARencontrer.style.display = 'block';
                bouttonsPersonnesRecontrees.style.display = 'none';
                bouttonsPersonnesARencontrer.style.display = 'block';
            }
        }
    }

    CreerLigne(personne)
    {
        return `<li class="liPersonne" id="personne_${personne.id}">
                    <div class="row">
                        <div class="col">
                            ${personne.prenom} ${personne.nom}.<br/>
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalModifierRencontre" onclick="indexController.InitialiserChamps('${personne.id}')">
                                <img src="../res/IconeModification.png" height="25px"/>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="indexController.SupprimerPersonne('${personne.id}')">
                                <img src="../res/IconeSuppression.png" height="25px"/>
                            </button>
                        </div>
                    </div>
                </li>`;
    }

    async CreerPersonne()
    {
        const inputNom                   = document.getElementById("inputNom");
        const inputPrenom                = document.getElementById("inputPrenom");
        const selectSexe                 = document.getElementById("selectSexe");
        const selectDateNaissanceJour    = document.getElementById("selectDateNaissanceJour");
        const selectDateNaissanceMois    = document.getElementById("selectDateNaissanceMois");
        const selectDateNaissanceAnnee   = document.getElementById("selectDateNaissanceAnnee");

        try
        {
            const token = Historique;

            const Result = await this.model.CreerPersonne({
                'nom'                : inputNom.value,
                'prenom'             : inputPrenom.value,
                'sexe'               : selectSexe.value,
                'dateNaissanceJour'  : selectDateNaissanceJour.value,
                'dateNaissanceMois'  : selectDateNaissanceMois.value,
                'dateNaissanceAnnee' : selectDateNaissanceAnnee.value
            }, token);

            if(Result === 201)
            {
                this.toast("toastSuccesCreerPersonne");
            }
            else if(Result === 400)
            {
                this.toast("toastErreurCreerPersonne");
            }
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurCreerPersonne");
        }
    }

    Deconexion()
    {
        sessionStorage.clear();
        localStorage.clear();
        navigate("login");
    }

    async InitialiserChamps()
    {
        try
        {
            let selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
            let selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
            let selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");

            if((selectDateNaissanceJour == null) || (selectDateNaissanceMois == null) || (selectDateNaissanceAnnee == null))
                return;

            let valeurJour               = 31;
            let valeurMois               = 12;
            let valeurAnnee              = new Date(Date.now()).getFullYear() + 10;

            selectDateNaissanceJour .innerHTML = `<option value="">Jour</option>`;
            selectDateNaissanceMois .innerHTML = `<option value="">Mois</option>`;
            selectDateNaissanceAnnee.innerHTML = `<option value="">Ann&eacute;e</option>`;

            for(let i = 1 ; i <= valeurJour ; i++)
            {
                selectDateNaissanceJour.innerHTML += `<option value="${i}">${i}</option>`;
            }
            for(let i = 1 ; i <= valeurMois ; i++)
            {
                selectDateNaissanceMois.innerHTML += `<option value="${i}">${i}</option>`;
            }
            for(let i = valeurAnnee ; i >= 1900 ; i--)
            {
                selectDateNaissanceAnnee.innerHTML += `<option value="${i}">${i}</option>`;
            }
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurChargementRencontre");
        }
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

    RemplirLiRencontrePendantModification(rencontre, utilisateur, personne)
    {
        return `<div class="row">
                    <div class="col">
                        ${utilisateur.pseudo} a rencontr&eacute; ${personne.prenom} ${personne.nom} le ${rencontre.dateRencontre}.<br/>
                        La note est de ${rencontre.note}/10. Le commentaire est : ${rencontre.commentaire}
                    </div>
                    <div class="col-1">
                        <button type="button" class="btn btn btn-primary boutonModifierRencontre" data-bs-toggle="modal" data-bs-target="#modalCreerPersonne" onclick="indexController.InitialiserChamps('${rencontre.id}')">
                            <img src="../res/IconeModification.png" height="25px"/>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="indexController.SupprimerRencontre('${rencontre.id}')">
                            <img src="../res/IconeSuppression.png" height="25px"/>
                        </button>
                    </div>
                </div>`;
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

    async SupprimerPersonne(idPersonne)
    {
        if(confirm('Voulez-vous supprimer cette personne ?'))
        {
            try
            {
                const token = Historique;

                const Result = await this.model.SupprimerPersonne({
                    'idPersonneARencontrer' : idPersonne
                }, token);

                if(Result === 200)
                {
                    const li = document.getElementById(`personne_${idPersonne}`);
                    if(li.parentNode)
                    {
                        li.parentNode.removeChild(li);
                    }
                    this.toast("toastSuccesSupprimerPersonne");
                }
                else if(Result === 400)
                {
                    this.toast("toastErreurSupprimerPersonne");
                }
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurSupprimerPersonne");
            }
        }
    }

    async SupprimerRencontre(idRencontre)
    {
        if(confirm('Voulez-vous supprimer cette rencontre ?'))
        {
            try
            {
                const token = Historique;

                const Result = await this.model.SupprimerRencontre({
                    'idRencontre' : idRencontre
                }, token);

                if(Result === 200)
                {
                    const li = document.getElementById(`rencontre_${idRencontre}`);
                    if(li.parentNode)
                    {
                        li.parentNode.removeChild(li);
                    }
                    this.toast("toastSuccesSupprimerRencontre");
                }
                else if(Result === 400)
                {
                    this.toast("toastErreurSupprimerRencontre");
                }
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurSupprimerRencontre");
            }
        }
    }

    ViderChampsNomEtPrenomPersonne()
    {
        let inputNom    = document.getElementById("inputNom");
        let inputPrenom = document.getElementById("inputPrenom");

        inputNom.value = "";
        inputPrenom.value = "";
    }
}

window.indexController = new IndexController()