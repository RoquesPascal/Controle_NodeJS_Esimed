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
        this.headers = new Headers({'Accept'        : 'application/json',
                                        'Authorization' : 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmMDdhNjE5LTY5ZDEtNDg2Yy1hMmEzLTUzYTliZTYxNzFhYSIsInBzZXVkbyI6IlBhc3Nla2FsZSIsImVtYWlsIjoicGFzY2FsLnJvcXVlczIwMDFAZ21haWwuY29tIiwiaWF0IjoxNjQ5MjUzNzc5LCJleHAiOjE2NTI4NTM3Nzl9.zn5wnnXYxBZqQiZcFdaCSZf-cGMEKup3ca9W9kriDhM',
                                        'Content-Type'  : 'application/json'})
    }

    GetListeRencontres()
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}`, {method  : "GET",
                                                                   headers : this.headers})
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

    GetPersonne(id)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienPersonnes}/${id}`, {method  : "GET",
                                                                        headers : this.headers})
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

    GetUtilisateur(id)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienUtilisateurs}/${id}`, {method  : "GET",
                                                                           headers : this.headers})
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
                                                              headers : this.headers,
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
                                                               headers : this.headers,
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