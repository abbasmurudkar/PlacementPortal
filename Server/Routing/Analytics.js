import mongoose from "mongoose";
import "../Schema/Companyschema.js";
import express from "express";
import { requireLogin } from "../Middleware/requireLogin.js";
import "../Schema/OptOutStudent.js"
import "../Schema/Studentschema.js"
const AnalyticsRouter = express.Router();
const Company = mongoose.model("Company");
const Optout = mongoose.model("Optout");
const StudentCredentials = mongoose.model("StudentCredentials")
const CompanyApplication = mongoose.model("CompanyApplication")
AnalyticsRouter.get("/analytics", requireLogin, async (req, res) => {
  try {
    const placementCompanies = await Company.countDocuments({
      OfferType: "Placement",
    });
    const placementPpoCompanies = await Company.countDocuments({
      OfferType: "Placement + PPO",
    });

    res.json({
      placementCompanies,
      placementPpoCompanies,
    });
  } catch (error) {
    console.error("Error fetching analytics ", error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
});

AnalyticsRouter.get('/average-ctc-by-branch', async (req, res) => {
    try {
      const avgCtcByBranch = await Company.aggregate([
        {
          $group: {
            _id: "$Branch",
            avgCTC: { $avg: "$CTC" }  //calculates the average ctc
          }
        }
      ]);

      res.json(avgCtcByBranch);
    } catch (error) {
      console.error("Error fetching average CTC by branch", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

AnalyticsRouter.get('/optoutanalysis', async (req, res) => {
    try {
      const totalStudents = await StudentCredentials.countDocuments({});
  
      const totalOptOuts = await Optout.countDocuments({});
  
      const remainingStudents = totalStudents - totalOptOuts;
  
      res.json({
        totalStudents,
        totalOptOuts,
        remainingStudents,
      });
    } catch (error) {
      console.error("Error fetching opt-out analysis", error);
      res.status(500).json({ message: "Error fetching opt-out analysis data" });
    }
  });

AnalyticsRouter.get('/companyapplicationanalysis', async (req, res) => {
    const { companyName } = req.query; // Get the company name from query params
  
    if (!companyName) {
      return res.status(400).json({ message: "Company name is required" });
    }
  
    try {
      // Count the number of students who applied to the specific company
      const totalApplications = await CompanyApplication.countDocuments({
        companyName: companyName,
        status: 'Applied',
      });
  
      // Get the details of students who applied (you can modify the fields to match your need)
      const appliedStudents = await CompanyApplication.aggregate([
        { $match: { companyName: companyName, status: 'Applied' } },
        { $group: { _id: "$companyName", totalApplications: { $sum: 1 } } }
      ]);
  
      res.json({
        companyName,
        totalApplications: appliedStudents.length > 0 ? appliedStudents[0].totalApplications : 0,
      });
    } catch (error) {
      console.error("Error fetching company application analysis", error);
      res.status(500).json({ message: "Error fetching company application analysis" });
    }
  });

export default AnalyticsRouter;
