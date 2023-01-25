import fetch from "node-fetch";

export async function authenticate(bearerToken) {
    console.log(`at authenticate - ${bearerToken}`);
    let headers = {
        "Authorization": `Bearer ${bearerToken}`,
        "originator": `file-storage`
    }
    const responseObj = await fetch('https://voisascript-auth.herokuapp.com/user/validate', {
        method: 'GET',
        mode: 'no-cors',
        headers: headers
    })
    if (responseObj) {
        const response = await responseObj.json()
        return response 
    }
    
}
