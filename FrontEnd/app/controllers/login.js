class LoginController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()

        this.HistoriqueLoginCle = "HistoriqueLoginAppliRencontre1"
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
}

window.loginController = new LoginController()