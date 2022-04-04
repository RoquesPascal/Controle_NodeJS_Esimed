class Sitemodel
{
    constructor()
    {
        this.api = new SiteAPI()
    }

    async Login(params)
    {
        try
        {
            return await this.api.Login(params)
        }
        catch
        {
            return  undefined
        }
    }
}