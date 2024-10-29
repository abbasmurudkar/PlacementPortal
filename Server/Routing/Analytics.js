import mongoose from "mongoose";
import "../Schema/Companyschema.js";
import express from "express";
import { requireLogin } from "../Middleware/requireLogin.js";
import "../Schema/OptOutStudent.js"
const AnalyticsRouter = express.Router();
const Company = mongoose.model("Company");
const Optout = mongoose.model("Optout");

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

export default AnalyticsRouter;
