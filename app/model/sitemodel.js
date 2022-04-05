class Sitemodel
{
    constructor()
    {
        this.api = new SiteAPI()
    }

    async Login(body)
    {
        try
        {
            return await this.api.Login(JSON.stringify(body))
        }
        catch (e)
        {
            console.log("AAAAAAAAAAAAAAAAAaa")
            return e
        }
    }
}