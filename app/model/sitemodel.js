class Sitemodel
{
    constructor()
    {
        this.api = new SiteAPI()
    }

    async CreerPersonne(body, jwt)
    {
        try
        {
            return await this.api.CreerPersonne(JSON.stringify(body), jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async CreerRencontre(body, jwt)
    {
        try
        {
            return await this.api.CreerRencontre(JSON.stringify(body), jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async GetListePersonnesARencontrer(jwt)
    {
        try
        {
            return await this.api.GetListePersonnesARencontrer(jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async GetListeRencontres(jwt)
    {
        try
        {
            return await this.api.GetListeRencontres(jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async GetListeRencontresDeUtilisateurConnecte(jwt, idUtilisateur)
    {
        try
        {
            return await this.api.GetListeRencontresDeUtilisateurConnecte(jwt, idUtilisateur)
        }
        catch (e)
        {
            return e
        }
    }

    async GetPersonne(id, jwt)
    {
        try
        {
            return await this.api.GetPersonne(id, jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async GetUtilisateur(id, jwt)
    {
        try
        {
            return await this.api.GetUtilisateur(id, jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async Login(body)
    {
        try
        {
            return await this.api.Login(JSON.stringify(body))
        }
        catch (e)
        {
            return e
        }
    }

    async Signup(body)
    {
        try
        {
            return await this.api.Signup(JSON.stringify(body))
        }
        catch (e)
        {
            return e
        }
    }
}