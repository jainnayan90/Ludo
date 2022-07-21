import Device from './constants/Device';

class HttpRequest {
    baseUrl = 'http://ludo.havrock.com';
    authToken = null;
    headers = {
        "authorization": this.authToken,
        "Content-Type":"application/json"
    };
    errorTexts = {
        noNetwork: "No Internet Connection.",
    }
    
    async post(URL, Params){
        let postUrl = this.baseUrl + URL;
        
        let RequestData = {
            headers: this.headers,
            method: "POST",
            body: Params
        }; 

        let response = null;
        try{
            response = await fetch(postUrl, RequestData);
        }catch(err){
            throw new Error(this.errorTexts.noNetwork);
        };

        if(!response.ok){
            const errResData = await response.json();
            //console.log('+++++++++++++++', errResData.error_message);
            return {"error": "Some error occured! Please try later."}
            
        }; 
        
        return response.json();

    }

    async absGet(URL){
        let postUrl = URL;
        
        // let RequestData = {
        //     headers: this.headers,
        //     method: "GET",
        //     body: Params
        // }; 

        let response = null;
        try{
            response = await fetch(postUrl);
        }catch(err){
            //console.log('~~~~~~~~~~~~~~~~~~~~~~   ', err)
            throw new Error(this.errorTexts.noNetwork);
        };

        if(!response.ok){
            const errResData = await response.json();
            //console.log('+++++++++++++++', errResData.error_message);
            return {"error": "Some error occured! Please try later."}
            
        }; 
        
        return response.json();

    }

}

export default new HttpRequest();