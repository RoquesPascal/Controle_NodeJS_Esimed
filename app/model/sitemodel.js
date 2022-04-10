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

    async GetRencontre(id, jwt)
    {
        try
        {
            return await this.api.GetRencontre(id, jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async GetRencontresCommunesUtilisateurPersonne(body, jwt)
    {
        try
        {
            return await this.api.GetRencontresCommunesUtilisateurPersonne(JSON.stringify(body), jwt)
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

    async ModifierPersonne(body, jwt)
    {
        try
        {
            return await this.api.ModifierPersonne(JSON.stringify(body), jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async ModifierRencontre(body, jwt)
    {
        try
        {
            return await this.api.ModifierRencontre(JSON.stringify(body), jwt)
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

    async SupprimerPersonne(body, jwt)
    {
        try
        {
            return await this.api.SupprimerPersonne(JSON.stringify(body), jwt)
        }
        catch (e)
        {
            return e
        }
    }

    async SupprimerRencontre(body, jwt)
    {
        try
        {
            return await this.api.SupprimerRencontre(JSON.stringify(body), jwt)
        }
        catch (e)
        {
            return e
        }
    }
}