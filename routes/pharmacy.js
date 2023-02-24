const express = require("express");
const pharmacy = express.Router();
const PharmacyModel = require("../model/pharmacy");
const password = require("../services/password");
const { generateToken } = require("../utills/generatetoken");

pharmacy.get("/", async (req, res) => {
  res.status(200).json({ msg: "pharmacy" });
});

pharmacy.post("/create", async (req, res) => {
  try {
    const data = await PharmacyModel.find({ email: req.body.email });

    if (data.length > 0) {
      res.status(900).json({ message: "Already have an account!" });
      return;
    }

    password.cryptPassword(req.body.password, async function (err, hash) {
      const data = new PharmacyModel({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        pharmacy_license_number: req.body.pharmacy_license_number,
        drug: [],
        address: req.body.address,
        district: req.body.district,
        isVerify: false,
        contact: req.body.contact,
      });

      const dataToSave = await data.save();
      res.status(200).json({ uid: dataToSave.id });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
});

pharmacy.post("/update/:pharmacy", async (req, res) => {
  try {
    await PharmacyModel.updateOne(
      { _id: req.params.pharmacy },
      {
        address: req.body.address,
        contact: req.body.contact,
        ownerName: req.body.ownerName,
        ownerNIC: req.body.ownerNIC,
        ownerAddress: req.body.ownerAddress,
      }
    );

    res.status(200).json({ message: "Updated Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
});

pharmacy.post("/login", async (req, res) => {
  try {
    const data = await PharmacyModel.find({ email: req.body.email });

    if (data.length === 0) {
      res.status(401).json({ message: "Login failed!" });
      return;
    }

    password.comparePassword(
      req.body.password,
      data[0]["password"],
      async function (err, isPasswordMatch) {
        if (!isPasswordMatch) {
          res.status(401).json({ message: "Login failed!" });
          return;
        }

        res.status(200).json({ 
            uid: data[0]["id"], 
            token: generateToken(data[0]["id"]),
            data: data
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

pharmacy.get("/all", async (req, res) => {
  try {
    const data = await PharmacyModel.find({});

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

pharmacy.get("/:id", async (req, res) => {
  try {
    const data = await PharmacyModel.find({ _id: req.params.id });

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

pharmacy.post("/addDrug/:pharmacy/:drug", async (req, res) => {
  try {
    const data = await PharmacyModel.find({ _id: req.params.pharmacy });
    var drugList = data[0].drug;

    var isExsist = false;

    drugList.forEach((drug) => {
      if (drug == req.params.drug) {
        isExsist = true;
      }
    });

    if (!isExsist) {
      drugList.push(req.params.drug);

      await PharmacyModel.updateOne(
        { _id: req.params.pharmacy },
        {
          drug: drugList,
        }
      );
    }

    res.status(200).json(drugList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

pharmacy.post("/verify/:pharmacy", async (req, res) => {
  try {
    await PharmacyModel.updateOne(
      { _id: req.params.pharmacy },
      {
        isVerify: true,
      }
    );

    res.status(200).json({ message: "Updated Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

pharmacy.post("/removeDrug/:pharmacy/:drug", async (req, res) => {
  try {
    const data = await PharmacyModel.find({ _id: req.params.pharmacy });
    var drugList = data[0].drug;

    drugList.pop(req.params.drug);

    await PharmacyModel.updateOne(
      { _id: req.params.pharmacy },
      {
        drug: drugList,
      }
    );

    res.status(200).json(drugList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

pharmacy.get("/search/:district/:drug", async (req, res) => {
  try {
    const pharmacyList = await PharmacyModel.find({
      district: req.params.district,
    }); // search with drug name

    var selectedPharmacyList = [];

    pharmacyList.forEach((pharmacy) => {
      const drugList = pharmacy.drug;

      drugList.forEach((drug) => {
        if (drug == req.params.drug) {
          selectedPharmacyList.push(pharmacy);
        }
      });
    });

    res.status(200).json(selectedPharmacyList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

pharmacy.get("/district/:district", async (req, res) => {
  try {
    const pharmacyList = await PharmacyModel.find({
      district: req.params.district,
    });

    res.status(200).json(pharmacyList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = pharmacy;
