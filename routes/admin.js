const express = require('express');
const admin = express.Router();
const AdminModel = require('../model/admin');
const password = require('../services/password');

admin.get('/', async(req, res)=>{
    res.status(200).json({msg:'admin'});
});

admin.post('/create', async (req, res) => {

    try{
        const data = await AdminModel.find({username : req.body.username});

        if(data.length > 0){
            res.status(900).json({ message: 'Already have an account!' });
            return;
        }

        password.cryptPassword(req.body.password, async function(err, hash) {

            const data = new AdminModel({
                name: req.body.name,
                username: req.body.username,
                password: hash,
            });
        
            const dataToSave = await data.save();
            res.status(200).json({uid: dataToSave.id});
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }

});

admin.post('/login', async(req, res)=>{
    try{
        const data = await AdminModel.find({username : req.body.username});
        
        if(data.length === 0){
            res.status(401).json({message: 'Login failed!'});
            return;
        }

        password.comparePassword(req.body.password, data[0]['password'], async function(err, isPasswordMatch) {

            if(!isPasswordMatch){
                res.status(401).json({message: 'Login failed!'});
                return;
            }

            res.status(200).json({ uid : data[0]['id']});
        });
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});


module.exports = admin;