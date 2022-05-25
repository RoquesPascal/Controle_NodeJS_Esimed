class LoginController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
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
            this.MettreLeJWTDansLeSessionStorage(token);
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
}

window.loginController = new LoginController()