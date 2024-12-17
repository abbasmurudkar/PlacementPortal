import mongoose from "mongoose";

const OptoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  program: { type: String, required: true },
  branch: { type: String, required: true },
  sapId: { type: String, required: true },
  reasons: { 
    furtherStudies: { type: Boolean, default: false },
    startup: { type: Boolean, default: false },
    familyBusiness: { type: Boolean, default: false },
    other: { type: Boolean, default: false }
  }
});

mongoose.model('Optout', OptoutSchema);

