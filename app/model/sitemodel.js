class Sitemodel
{
    constructor()
    {
        this.api = new SiteAPI()
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