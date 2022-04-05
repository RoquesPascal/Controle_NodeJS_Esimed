class SiteAPI
{
    constructor()
    {
        this.api = "http://localhost:3000"
        this.lienLogin = "login"
        this.lienSignup = "signup"
        this.headers = new Headers({'Accept'       : 'application/json',
                                        'Content-Type' : 'application/json'})
    }

    Login(body)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienLogin}`, {method  : "POST",
                                                              headers : this.headers,
                                                              body    : body})
                .then(response => {
                    if(response.status !== 200)
                    {
                        console.log(response)
                        reject(response.status)
                    }
                    else
                    {
                        console.log(response)
                        resolve()
                    }
                }).catch(error => reject(error))
        }))
    }

    Signup(body)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienSignup}`, {method  : "POST",
                                                               headers : this.headers,
                                                               body    : body})
                .then(response => {
                    if(response.status !== 201)
                    {
                        console.log(response)
                        reject(response.status)
                    }
                    else
                    {
                        console.log(response)
                        resolve()
                    }
                }).catch(error => reject(error))
        }))
    }
}