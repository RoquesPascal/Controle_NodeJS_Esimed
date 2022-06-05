class RencontreModerationController extends RencontreUtilisateurController
{
    constructor()
    {
        super();
        this.AfficherToutesLesRencontres().then(r => {});
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
                    const utilisateur = await this.model.GetUtilisateur(rencontre.idUtilisateur, this.JWT);
                    const personne    = await this.model.GetPersonne(rencontre.idPersonneRencontree, this.JWT);
                    listeHtmlRencontres += this.CreerLigneAvecBalise_Li(true, rencontre, utilisateur, personne);
                    this.compteurRencontresPassees++;
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

    async SupprimerCommentaireDeRencontre()
    {
        console.log("AAAAAAA")
    }
}

window.rencontreModerationController= new RencontreModerationController()