import mongoose from "mongoose";

const companyApplicationSchema = new mongoose.Schema({
  sapId: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  appliedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Applied', 'Accepted', 'Rejected'],
    default: 'Applied',
  },
});

mongoose.model('CompanyApplication', companyApplicationSchema);