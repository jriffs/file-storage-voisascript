import fetch from "node-fetch";

export async function authenticate(bearerToken) {
    let headers = {
        "Authorization": `Bearer ${bearerToken}`,
        "originator": `file-storage`
    }
    const request = await fetch('http://localhost:3000/user/validate', {
        method: 'GET',
        mode: 'no-cors',
        headers: headers
    })
    if (request) {
        const response = await request.json()
        return response 
    }
    
}
