import express from "express";
import { requireLogin } from "../Middleware/requireLogin.js";
import mongoose from "mongoose";
const routerPost = express.Router();
import "../Schema/Companyschema.js";
const Company = mongoose.model("Company");


routerPost.post("/createCompany", requireLogin, async (req, res) => {
  const {
    CompanyName,
    OfferType,
    StartDate,
    EndDate,
    Description,
    CTC,
    Branch,
    CGPA,
    Tenth,
    Twelfth,
    KT,
    Backlog,
    Document,
  } = req.body;

  if (
    (!CompanyName,
    !OfferType,
    !StartDate,
    !EndDate,
    !Description,
    !CTC,
    !Branch,
    !CGPA,
    !Tenth,
    !Twelfth,
    !KT,
    !Backlog,
    !Document)
  ) {
    return res.status(422).json({ error: "Please add all required fields" });
  }
  try {
    const existingCompany = await Company.findOne({ CompanyName });
    if (existingCompany) {
      return res.status(422).json({ error: "Company already exists" });
    }
    const startDate = new Date(StartDate);
    const endDate = new Date(EndDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(422).json({ error: "Invalid date format" });
    }

    const company = new Company({
      CompanyName,
      OfferType,
      StartDate: startDate,
      EndDate: endDate,
      Description,
      CTC,
      Branch,
      CGPA,
      Tenth,
      Twelfth,
      KT,
      Backlog,
      Document,
      postedBy: req.user,
    });

    company
      .save()
      .then((result) => {
        res.json({ company: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

routerPost.get("/allCompany", requireLogin, async (req, res) => {
  try {
    await Company.find()
      .populate("postedBy", "_id email")
      .then((Companies) => {
        res.json({ Companies });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
routerPost.get("/company/:id",requireLogin,async(req,res)=>{
  try{
    const companyId = req.params.id;
    const company = await Company.findById(companyId).populate("postedBy","_id email")

    if(!company){
      res.status(404).json({error:"Company not found"})
    }else{
      return res.json({company})
    }    

  } catch(err){
      console.error(err);
      res.status(500).json({ error: "Internal Server error" });
  }
})

routerPost.put("/company/:id",requireLogin,async (req, res)=>{
  const companyId = req.params.id;
  const updateCompany = req.body;
try{
  const updatedCompany =await Company.findByIdAndUpdate(
    companyId,
    updateCompany,
    {new:true}
  );
  if (!updatedCompany) {
    return res.status(404).json({ error: "Company Not Found" });
  }
  res.json({ company: updatedCompany });
}catch(err){
  console.error(err);
  res.status(500).json({ error: "Internal Server error" });
}
})
export default routerPost;
