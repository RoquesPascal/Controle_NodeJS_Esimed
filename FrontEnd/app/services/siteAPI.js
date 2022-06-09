class SiteAPI
{
    constructor()
    {
        this.api = "http://localhost:3000"
        this.lienImages = "images"
        this.lienListeRencontreUtilisateur = "idUtilisateur"
        this.lienListeRencontreDePersonneARencontrer = "listeRencontreDePersonneARencontrer"
        this.lienLogin = "login"
        this.lienModeration = "moderation"
        this.lienPersonnes = "personnes"
        this.lienPersonneRencontree = "personne-rencontree"
        this.lienRencontres = "rencontres"
        this.lienRencontresPassees = "rencontres-passees"
        this.rencontresCommunesUtilisateurPersonne = "rencontresCommunes/utilisateurPersonne"
        this.lienSignup = "signup"
        this.lienSupprimerCommentaireRencontre = "supprimer-commentaire"
        this.lienUtilisateurs = "utilisateurs"
    }

    AjouterLeJwtDansLeHeader(jwt)
    {
        return new Headers({'Accept'        : 'application/json',
                                'Authorization' : 'Bearer ' + jwt,
                                'Content-Type'  : 'application/json'})
    }

    TEST_EnregistrerFichier(jwt, body)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienImages}`, {method  : "POST",
                headers : this.AjouterLeJwtDansLeHeader(jwt),
                body    : body})
                .then(async response => {
                    console.log(`response = `)
                    console.log(response)
                    if(response.status !== 201)
                    {
                        reject(response.status)
                    }
                    else
                    {
                        resolve(response.status)
                    }
                }).catch(error => reject(error))
        }))
    }

    TEST_RecupererFichier(jwt, idUtilisateur)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienImages}/${idUtilisateur}`, {method  : "GET",
                                                                                headers : this.AjouterLeJwtDansLeHeader(jwt)})
                .then(async response => {
                    if(response.status === 200)
                    {
                        resolve(response.json())
                    }
                    else if(response.status === 404)
                        resolve()
                    else
                    {
                        reject(response.status)
                    }
                }).catch(error => reject(error))
        }))
    }

    CreerPersonne(body, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienPersonnes}`, {method  : "POST",
                headers : this.AjouterLeJwtDansLeHeader(jwt),
                body    : body})
                .then(async response => {
                    if(response.status !== 201)
                    {
                        reject(response.status)
                    }
                    else
                    {
                        resolve(response.json())
                    }
                }).catch(error => reject(error))
        }))
    }

    CreerRencontre(body, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}`, {method  : "POST",
                headers : this.AjouterLeJwtDansLeHeader(jwt),
                body    : body})
                .then(async response => {
                    if(response.status !== 201)
                    {
                        reject(response.status)
                    }
                    else
                    {
                        resolve(response.status)
                    }
                }).catch(error => reject(error))
        }))
    }

    GetListePersonnesARencontrer(jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienPersonnes}`, {method  : "GET",
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

    GetListeRencontresDePersonneARencontrer(jwt, idPersonne)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}/${this.lienListeRencontreDePersonneARencontrer}/${idPersonne}`, {method  : "GET",
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

    GetListeRencontresDeUtilisateurConnecte(jwt, idUtilisateur)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}/${this.lienListeRencontreUtilisateur}/${idUtilisateur}`, {method  : "GET",
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

    GetListeRencontresPassees(jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}/${this.lienModeration}/${this.lienRencontresPassees}`, {method  : "GET",
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

    GetRencontre(id, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}/${id}`, {method  : "GET",
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

    GetRencontresCommunesUtilisateurPersonne(body, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}/${this.rencontresCommunesUtilisateurPersonne}`, {method  : "POST",
                                                                                                                 headers : this.AjouterLeJwtDansLeHeader(jwt),
                                                                                                                 body    : body})
                .then(async response => {
                    if(response.status === 200)
                    {
                        resolve(response.json())
                    }
                    else
                    {
                        reject(await response.text())
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

    ModifierPersonne(body, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienPersonnes}`, {method  : "PUT",
                                                                  headers : this.AjouterLeJwtDansLeHeader(jwt),
                                                                  body    : body})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(response.status)
                    }
                    else
                    {
                        resolve(response.status)
                    }
                }).catch(error => reject(error))
        }))
    }

    ModifierRencontre(body, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}`, {method  : "PUT",
                headers : this.AjouterLeJwtDansLeHeader(jwt),
                body    : body})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(response.status)
                    }
                    else
                    {
                        resolve(response.status)
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

    SupprimerCommentaireRencontre(idRencontre, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}/${this.lienSupprimerCommentaireRencontre}/${idRencontre}`, {method  : "PUT",
                                                                   headers : this.AjouterLeJwtDansLeHeader(jwt)})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(response.status)
                    }
                    else
                    {
                        resolve(response.status)
                    }
                }).catch(error => reject(error))
        }))
    }

    SupprimerPersonne(body, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienPersonnes}`, {method  : "DELETE",
                                                                  headers : this.AjouterLeJwtDansLeHeader(jwt),
                                                                  body    : body})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(response.status)
                    }
                    else
                    {
                        resolve(response.status)
                    }
                }).catch(error => reject(error))
        }))
    }

    SupprimerRencontre(body, jwt)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/${this.lienRencontres}`, {method  : "DELETE",
                headers : this.AjouterLeJwtDansLeHeader(jwt),
                body    : body})
                .then(async response => {
                    if(response.status !== 200)
                    {
                        reject(response.status)
                    }
                    else
                    {
                        resolve(response.status)
                    }
                }).catch(error => reject(error))
        }))
    }
}