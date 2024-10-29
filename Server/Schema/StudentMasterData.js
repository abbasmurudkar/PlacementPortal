import mongoose from "mongoose";

const StudentFormSchema = new mongoose.Schema({
  campus: { type: String, required: true },
  program: { type: String, required: true },
  branch: { type: String, required: true },
  sapId: { type: String, required: true, unique: true },
  studentFullName: { type: String, required: true },
  mailId: { type: String, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  dob: { type: String, required: true },

  tenthSchool: { type: String, required: true },
  tenthPercent: { type: String, required: true },
  twelfthCollege: { type: String, required: false },
  twelfthPercent: { type: String, required: false },
  diplomaBoard: { type: String, required: false },
  diplomaCollege: { type: String, required: false },
  diplomaSpecialization: { type: String, required: false },
  graduationPercent: { type: String, required: false },
  gapYears: { type: String, required: true },
  cgpaSem5: { type: String, required: true },
  cgpaSem6: { type: String, required: true },
  deadKTs: { type: String, required: true },
  liveKTs: { type: String, required: true },
});

mongoose.model("StudentForm", StudentFormSchema);
