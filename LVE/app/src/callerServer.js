import {URL_SERVER} from './constant' 
import * as util from './util'
export async function get(requestUrl, data){
    let formBody = util.convertPostData(data)

    let response = await fetch(`${URL_SERVER}/${requestUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    }).then(data => data.json())
    if(response.status === true) {
        return response   
    }
    return false;
}