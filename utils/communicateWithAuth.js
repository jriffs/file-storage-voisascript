import fetch from "node-fetch";

export async function authenticate(bearerToken) {
    let headers = {
        "Authorization": `Bearer ${bearerToken}`,
        "originator": `file-storage`
    }
    const responseObj = await fetch('http://localhost:3000/user/validate', {
        method: 'GET',
        mode: 'no-cors',
        headers: headers
    })
    if (responseObj) {
        const response = await responseObj.json()
        return response 
    }
    
}
