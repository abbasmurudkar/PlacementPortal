import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const Companyschema = mongoose.Schema(
    {
        CompanyName:{
            type:String,
            require:true
        },
        OfferType:{
            type:String,
            require:true
        },
        StartDate:{
            type:Date,
            require:true
        },
        EndDate:{
            type:Date,
            require:true
        },
        Description:{
            type:String,
            require:true
        },
        CTC:{
            type:Number,
            require:true
        },
        Branch:{
            type:String,
            require:true
        },
        CGPA:{
            type:Number,
            require:true
        },
        Tenth:{
            type:Number,
            require:true
        },
        Twelfth:{
            type:Number,
            require:true
        },
        KT:{
            type:String,
            require:true
        },
        Backlog:{
            type:String,
            require:true,
        },
        Document: {
            type: String, 
            required: false 
        },
        postedBy:{
            type:ObjectId,
            ref:"User"
        }
    });
mongoose.model("Company", Companyschema);
