class Sitemodel
{
    constructor()
    {
        this.api = new SiteAPI()
    }

    async GetListeRencontres()
    {
        try
        {
            return await this.api.GetListeRencontres()
        }
        catch (e)
        {
            return e
        }
    }

    async GetPersonne(id)
    {
        try
        {
            return await this.api.GetPersonne(id)
        }
        catch (e)
        {
            return e
        }
    }

    async GetUtilisateur(id)
    {
        try
        {
            return await this.api.GetUtilisateur(id)
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