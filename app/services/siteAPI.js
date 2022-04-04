class SiteAPI
{
    constructor()
    {
        this.api = "http://localhost:3000"
    }

    Login(params)
    {
        return new Promise(((resolve, reject) => {
            fetch(`${this.api}/login`, {body : params, method : 'POST'})
                .then(response => {
                    if(response.status !== 200)
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
}