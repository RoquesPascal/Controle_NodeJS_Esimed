class RencontreModerationController extends RencontreUtilisateurController
{
    constructor()
    {
        super();
        this.compteurRencontres = 0;
        this.AfficherToutesLesRencontres().then(r => {});
    }

    AfficherCompteurRencontres()
    {
        let spanCompteurRencontres = document.getElementById("spanCompteurRencontres");
        spanCompteurRencontres.innerHTML = ` (${this.compteurRencontres})`;
    }

    async AfficherToutesLesRencontres()
    {
        let ulListeRencontres = document.getElementById("ulListeRencontres");

        if(ulListeRencontres != null)
        {
            try
            {
                const listeRencontres = await this.model.GetListeRencontresPassees(this.JWT);
                let listeHtmlRencontres = "";

                ulListeRencontres.innerHTML = '<img src="../../FrontEnd/res/Loader.gif"/>';

                for(const rencontre of listeRencontres)
                {
                    this.compteurRencontres ++;
                    const utilisateur = await this.model.GetUtilisateur(rencontre.idUtilisateur, this.JWT);
                    const personne    = await this.model.GetPersonne(rencontre.idPersonneRencontree, this.JWT);
                    listeHtmlRencontres += this.CreerLigneAvecBalise_Li(true, rencontre, utilisateur, personne);
                    this.compteurRencontresPassees++;
                }
                ulListeRencontres.innerHTML = listeHtmlRencontres;
                this.AfficherCompteurRencontres();
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurGetListeRencontres");
            }
        }
    }

    async SupprimerCommentaireDeRencontre(idRencontre)
    {
        if(confirm('Voulez-vous supprimer le commentaire et réinitialiser le partage de cette rencontre ?'))
        {
            try
            {
                const Result = await this.model.SupprimerCommentaireRencontre(idRencontre, this.JWT);

                if(Result === 200)
                {
                    this.toast("toastSuccesSupprimerCommentaire");

                    this.compteurRencontres--;
                    const li = document.getElementById(`rencontre_${idRencontre}`);
                    if (li.parentNode)
                        li.parentNode.removeChild(li);
                    this.AfficherCompteurRencontres();
                }
                else this.toast("toastErreurSupprimerCommentaire");
            }
            catch(e)
            {
                console.log(e);
                this.toast("toastErreurSupprimerCommentaire");
            }
        }
    }
}

window.rencontreModerationController= new RencontreModerationController()