class CreerRencontreController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
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
                const listePersonnesARencontrer = await this.model.GetListePersonnesARencontrer(this.JWT);
                let listeHtmlPersonnesARencontrer = `<option value=""></option>`;

                for(const personne of listePersonnesARencontrer)
                {
                    listeHtmlPersonnesARencontrer += this.CreerLigne(personne)
                }

                selectPersonnesARencontrer.innerHTML = listeHtmlPersonnesARencontrer;
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
        let   selectDateNaissanceJour  = document.getElementById("selectDateNaissanceJour");
        let   selectDateNaissanceMois  = document.getElementById("selectDateNaissanceMois");
        let   selectDateNaissanceAnnee = document.getElementById("selectDateNaissanceAnnee");
        let   selectDateJour           = document.getElementById("selectDateJour");
        let   selectDateMois           = document.getElementById("selectDateMois");
        let   selectDateAnnee          = document.getElementById("selectDateAnnee");
        let   selectNote               = document.getElementById("selectNote");
        const valeurJour               = 31;
        const valeurMois               = 12;
        const valeurAnnee              = new Date(Date.now()).getFullYear() + 10;
        const valeurAnneeNaissance     = new Date(Date.now()).getFullYear();
        const valeurNote               = 10;

        selectDateNaissanceJour.innerHTML = `<option value="">Jour</option>`;
        selectDateNaissanceMois.innerHTML = `<option value="">Mois</option>`;
        selectDateNaissanceAnnee.innerHTML = `<option value="">Ann&eacute;e</option>`;
        selectDateJour.innerHTML = `<option value="">Jour</option>`;
        selectDateMois.innerHTML = `<option value="">Mois</option>`;
        selectDateAnnee.innerHTML = `<option value="">Ann&eacute;e</option>`;

        for(let i = 1 ; i <= valeurJour ; i++)
        {
            selectDateNaissanceJour.innerHTML += `<option value="${i}">${i}</option>`;
        }
        for(let i = 1 ; i <= valeurMois ; i++)
        {
            selectDateNaissanceMois.innerHTML += `<option value="${i}">${i}</option>`;
        }
        for(let i = valeurAnneeNaissance ; i >= 1900 ; i--)
        {
            selectDateNaissanceAnnee.innerHTML += `<option value="${i}">${i}</option>`;
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



        for(let i = 0 ; i <= valeurNote ; i++)
        {
            selectNote.innerHTML += `<option value="${i}">${i}</option>`;
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
        const selectPartage              = document.getElementById("selectPartage");

        if((selectPersonnesARencontrer.value === '') || (selectPartage.value === ''))
        {
            this.toast("toastErreurCertainsChampsObligatoiresSontVides");
            return;
        }

        try
        {
            const Result = await this.model.CreerRencontre({
                'idPersonneRencontree' : selectPersonnesARencontrer.value,
                'dateRencontreJour'    : selectDateJour.value,
                'dateRencontreMois'    : selectDateMois.value,
                'dateRencontreAnnee'   : selectDateAnnee.value,
                'note'                 : selectNote.value,
                'commentaire'          : textAreaCommentaire.value,
                'partage'              : selectPartage.value
            }, this.JWT);

            if(Result === 201)
            {
                this.toast("toastSuccesCreerRencontre");
                navigate("index");
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

window.creerRencontreController = new CreerRencontreController()