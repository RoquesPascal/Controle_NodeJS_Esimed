class SiteAPI
{
    constructor()
    {
        this.api = "http://localhost:3000"
        this.lienLogin = "login"
        this.lienPersonnes = "personnes"
        this.lienRencontres = "rencontres"
        this.lienSignup = "signup"
        this.lienUtilisateurs = "utilisateurs"
    }

    AjouterLeJwtDansLeHeader(jwt)
    {
        return new Headers({'Accept'        : 'application/json',
                                'Authorization' : 'Bearer ' + jwt,
                                'Content-Type'  : 'application/json'})
    }

    GetListeRencontres(jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}`, {method  : "GET",
                                                                   headers : this.AjouterLeJwtDansLeHeader(jwt)})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(await response.text())
                    }
                    else
                    {
                        resolve(response.json())
                    }
                }).catch(error => reject(error))
        }))
    }

    GetPersonne(id, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienPersonnes}/${id}`, {method  : "GET",
                                                                        headers : this.AjouterLeJwtDansLeHeader(jwt)})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(await response.text())
                    }
                    else
                    {
                        resolve(response.json())
                    }
                }).catch(error => reject(error))
        }))
    }

    GetUtilisateur(id, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienUtilisateurs}/${id}`, {method  : "GET",
                                                                           headers : this.AjouterLeJwtDansLeHeader(jwt)})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(await response.text())
                    }
                    else
                    {
                        resolve(response.json())
                    }
                }).catch(error => reject(error))
        }))
    }

    Login(body)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienLogin}`, {method  : "POST",
                                                              headers : this.AjouterLeJwtDansLeHeader(""),
                                                              body    : body})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(await response.text())
                    }
                    else
                    {
                        resolve(response.text())
                    }
                }).catch(error => reject(error))
        }))
    }

    Signup(body)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienSignup}`, {method  : "POST",
                                                               headers : this.AjouterLeJwtDansLeHeader(""),
                                                               body    : body})
                .then(async response => {
                    if(response.status !== 201)
                    {
                        reject(await response.text())
                    }
                    else
                    {
                        resolve(response.text())
                    }
                }).catch(error => reject(error))
        }))
    }
}