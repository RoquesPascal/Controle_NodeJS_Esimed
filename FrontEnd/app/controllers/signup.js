class SignupController extends BaseController
{
    constructor()
    {
        super()
        this.model = new Sitemodel()
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

            if(token != null)
            {
                this.MettreLoginDansLeSessionStorage(inputEmail.value);
                this.MettreLeJWTDansLeSessionStorage(token);
            }
            else
                this.toast("toastErreurSignup");
        }
        catch(e)
        {
            console.log(e);
            this.toast("toastErreurSignup");
        }
    }
}

window.signupController = new SignupController()