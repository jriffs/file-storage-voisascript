async function getUserData(){
  // url this is just a dommy url from the dommy server i created
  let url = "http://127.0.0.1:3000/projects/amos";
  let option = {
    method: "GET",
    headers:{
      Accept: "application/json"
    }
  }
  try{
    let response = await fetch(url, option);
    let data = await response.json();
     return data;
  }catch(err){
    return err;
  }
}

export default getUserData;
