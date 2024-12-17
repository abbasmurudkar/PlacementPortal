import express from "express";
import { requireLogin } from "../Middleware/requireLogin.js";
import mongoose from "mongoose";
import "../Schema/Studentschema.js"
import "../Schema/StudentMasterData.js"
import "../Schema/CompanyApplication.js"
import "../Schema/OptOutStudent.js"
const StudentRouter = express.Router();
const Student = mongoose.model("StudentCredentials")
const Master = mongoose.model("StudentForm")
const CompanyApplication = mongoose.model("CompanyApplication")
const Optout = mongoose.model("Optout")
  StudentRouter.post("/StudentsCredentials", requireLogin, async (req, res) => {
    try {
      const students = req.body;
      if (!Array.isArray(students) || !students.length) {
        return res.status(400).json({ message: "Invalid data format" });
      }
  
      for (const student of students) {
        if (!student.fullStudentName || !student.sapId || !student.defaultPassword) {
          return res.status(400).json({ message: "Missing required fields" });
        }
      }
  
      await Student.insertMany(students);
      res.status(201).json({ message: "Data saved successfully" });
    } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).json({ message: "Data Already Saved In Database!", error: error.message });
    }
  });
  StudentRouter.get("/StudentsCredentials", requireLogin, async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Error fetching data", error: error.message });
    }
  });

  StudentRouter.post("/StudentsCredentials/Insert",requireLogin, async (req, res) => {
    const student = req.body; 
  
    if (!student || !student.fullStudentName || !student.sapId || !student.defaultPassword) {
      return res.status(400).json({ message: "Invalid data format or missing required fields" });
    }
  
    try {
      const existingStudent = await Student.findOne({ sapId: student.sapId });
  
      if (existingStudent) {
        return res.status(400).json({
          message: "Duplicate SAP ID detected"
        });
      }
  
      const newStudent = new Student(student);
      await newStudent.save();
      return res.status(201).json(newStudent);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
    
  StudentRouter.get('/StudentsCredentials/:id', requireLogin, async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  StudentRouter.put('/StudentsCredentials/:id', requireLogin, async (req, res) => {
    try {
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  StudentRouter.get('/StudentMasterData',requireLogin,async(req,res)=>{
    try{
      const StudentData = await Master.find();
      res.status(200).json(StudentData);
      console.error(StudentData)
    }catch(error){
      res.status(500).json({ message: error.message });
    }
  })
  
  StudentRouter.get('/applications',requireLogin, async (req, res) => {
    try {
      const applications = await CompanyApplication.find();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  StudentRouter.get('/optoutstudents',requireLogin, async (req, res) => {
    try {
      const optoutStudents = await Optout.find();
      res.json(optoutStudents);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching opt-out students' });
    }
  });
export default StudentRouter;
