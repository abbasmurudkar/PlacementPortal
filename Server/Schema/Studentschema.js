import mongoose from "mongoose";

const StudentDetailsSchema = mongoose.Schema(
  {
    fullStudentName: {
      type: String,
      required: true
    },
    sapId: {
      type: String,
      required: true,
      unique: true 
    },
    defaultPassword: {
      type: String,
      required: true
    },
  }
);

mongoose.model("StudentCredentials", StudentDetailsSchema);
