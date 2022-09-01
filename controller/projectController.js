import { getAll } from "../model/db.js"

export function GetIndividualUser(req, res){
    res.status(200).json({
        Message:`hello from ${req.params.id}`
    })
};

export function GetAllRowsFromProjectTable(req,res){
    getAll('Projects' , (a,v)=>{
        res.status(200).json({
            Projects:v,
           
    })
        })
    
}