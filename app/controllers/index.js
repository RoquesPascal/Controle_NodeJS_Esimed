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

        console.log(inputEmail.value)
        console.log(inputMotDePasse.value)

        const Result = await this.model.Login({
            'email'      : inputEmail.value,
            'motDePasse' : inputMotDePasse.value
        })

       if(Result !== undefined)
       {
           console.log(`Result = ${Result}`)
       }
       else
       {
           console.log(`Result = ${Result}`)
       }
    }
}

window.indexController = new IndexController()