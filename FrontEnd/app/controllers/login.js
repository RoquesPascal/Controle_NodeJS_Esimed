class LoginController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
    }

    AfficherListeLogin()
    {
        const listeLogin = sessionStorage.getItem(this.HistoriqueLoginCle);

        if(listeLogin != null)
        {
            for(let loginDeLaListe of listeLogin)
            {
                console.log(listeLogin)
            }
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

            if(token != null)
            {
                this.MettreLoginDansLeSessionStorage(inputEmail.value);
                this.MettreLeJWTDansLeSessionStorage(token);
            }
            else
                this.toast("toastErreurLogin");
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurLogin");
        }
    }
}

window.loginController = new LoginController()