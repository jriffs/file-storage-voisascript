import { request } from "express"
import { getAll,getOneUProject,UpdateProject } from "../model/db.js"

// get one project
export function getProject(req, res){
    getOneUProject(req.params.User_id,(value)=>{
        res.status(200).json({
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
// update one project
export function UpdateIndividualProject(req,res){
    // getting users details
    const oldProjectName = req.params.opn
    const newProjectName = req.body.npn
    const newProjectDescription = req.body.npd
   
    UpdateProject(oldProjectName,newProjectName,newProjectDescription,(value)=>{
            res.send(value)
    })    
    
   
}