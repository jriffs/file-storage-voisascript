import { request } from "express"
import { getAll,getOneUProject,UpdateProject } from "../model/db.js"

<<<<<<< HEAD
export default projectController;
=======
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
// export function UpdateIndividualProject(req,res){
//     UpdateProject(req.params.opn,res.body.npn,res.body.pd,()=>{
//             res.json({
//                 old:req.params.opn,
//                 new:res.body.npn,
//                 desc:res.body.pd
//             })
//     })
        
    
   
//}
>>>>>>> 45c4fc07f1a59e4159282223a35141f596e648e4
