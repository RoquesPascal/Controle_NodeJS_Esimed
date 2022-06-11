class LoginController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()

        this.AfficherListeLogin();
    }

    AfficherListeLogin()
    {
        let dropDownListeLogin       = document.getElementById("dropDownListeLogin");
        let listeLoginSessionStorage = JSON.parse(sessionStorage.getItem(this.HistoriqueLoginCle));
        let listeLogin               = [];

        if(listeLoginSessionStorage == null)
        {
            dropDownListeLogin.innerHTML = `Les adresses e-mail utilis&eacute;es pour se connecter seront affich&eacute;es ici`;
            return;
        }
        else
        {
            for(let loginDeLaListe of listeLoginSessionStorage)
                listeLogin.push(loginDeLaListe);
            listeLogin = this.TrierLesLogin(listeLogin);
        }

        dropDownListeLogin.innerHTML = '';
        for(let loginDeLaListe of listeLogin)
            dropDownListeLogin.innerHTML += `<li><span class="dropdown-item" onclick="loginController.RemplirInputLoginParLoginSelectionne('${loginDeLaListe}')">${loginDeLaListe}</span></li>`;
    }

    async Login()
    {
        const inputEmail      = document.getElementById("inputEmail");
        const inputMotDePasse = document.getElementById("inputMotDePasse");

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

    RemplirInputLoginParLoginSelectionne(login)
    {
        let inputEmail = document.getElementById("inputEmail");
        inputEmail.value = login;
    }

    TrierLesLogin(listeLogin)
    {
        let trier = false;
        let nbrElemRestants = 0;
        let personneTemp;

        do
        {
            nbrElemRestants = 0;

            for(let i = 1 ; i < listeLogin.length ; i++)
            {
                trier = (listeLogin[i].toLowerCase() < listeLogin[i-1].toLowerCase());

                if(trier)
                {
                    nbrElemRestants = nbrElemRestants + 1;

                    personneTemp = listeLogin[i - 1];
                    listeLogin[i - 1] = listeLogin[i];
                    listeLogin[i] = personneTemp;
                }
            }
        } while(nbrElemRestants != 0);

        return listeLogin;
    }
}

window.loginController = new LoginController()