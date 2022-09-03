import { request } from "express"
import { getAll,getOneUProject } from "../model/db.js"

// get one project
export function getProject(req, res){
    getOneUProject(req.params.User_id,(value)=>{
        res.json({
            Message: value
         })
    })
};

// get all projects
export function GetAllRowsFromProjectTable(req,res){
    getAll('Projects' , (a,v)=>{
        res.status(200).json({
            Projects:v,
           
    })
        })
    
}
// update project
export function UpdateIndividualUser(req,res){
    Updateproject(req.params.id,(nul,value)=>{
        res.json({
            Message: value
         })
    })
   
}