const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const drug = express.Router();
const DrugModel = require('../model/drug');


drug.get('/', async(req, res)=>{
    res.status(200).json({msg:'drug'});
});

drug.post('/create', async (req, res)=>{

    try{

        const data = new DrugModel({
            name: req.body.name,
        });
    
        const dataToSave = await data.save();
        res.status(200).json({id: dataToSave.id});

    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

drug.get("/all", protect,async (req,res)=>{

    try{
        const data = await DrugModel.find({});

        res.status(200).json(data);
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
    
});

drug.get("/:name", async (req,res)=>{

    try{
        const data = await DrugModel.find({name : req.params.name});

        res.status(200).json(data[0]);
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
    
});


module.exports = drug;