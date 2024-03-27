import express from "express"
import Transaction from "../models/Transaction.js";

const router =express.Router();

router.get("/latestTransactions",async (req,res)=>{
    try{
        
        const transactions=await Transaction.find()
        .limit(50)
        // Gets the new lastest transaction
        .sort({createdAt:-1}); 

        // const firstTransactions = await Transaction.find().limit(50)
        // .sort({createdOn:1});
       
        res.status(200)
        .json(
            transactions
        )
    }

    catch(error){
        res.status(404).json({message:error})
    }
})




export default router


