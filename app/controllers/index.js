class IndexController extends BaseController
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
            const Result = await this.model.Login({
                'email'      : inputEmail.value,
                'motDePasse' : inputMotDePasse.value
            })
            console.log(Result);
        }
        catch(e)
        {
            console.log(e);
        }

       /*if(Result !== undefined) //Si c'est undefined c'est qu'on a pu trouver l'utilisateur, sinon ça renvoi l'erreur 404
       {
           //navigate('index');
           console.log(Result);
       }
       else
       {
           console.log(`Connexion  pas ok`)
       }*/
    }

    async Signup()
    {
        const inputPseudo     = document.getElementById("inputPseudo")
        const inputEmail      = document.getElementById("inputEmail")
        const inputMotDePasse = document.getElementById("inputMotDePasse")

        const Result = await this.model.Signup({
            "pseudo"     : inputPseudo.value,
            'email'      : inputEmail.value,
            'motDePasse' : inputMotDePasse.value
        })

        if(Result == undefined) //Si c'est undefined c'est qu'on a pu créer l'utilisateur, sinon ça renvoi un code erreur
        {
            console.log(`Creation OK !`)
        }
        else
        {
            console.log(`Création  pas ok`)
        }
    }
}

window.indexController = new IndexController()