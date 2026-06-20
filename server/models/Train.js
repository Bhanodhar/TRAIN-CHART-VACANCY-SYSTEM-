const mongoose=require("mongoose");

const trainSchema=new mongoose.Schema(
    {
        trainName:{
            type:String,
            required:true,
            unique:true,
            trim:true,
        },
        trainNumber:{
            type:String,
            required:true,
            unique:true,
            trim:true,
        },
        boardingPoint:{
            type:String,
            required:true,
            trim:true,
        },
        destinationPoint:{
            type:String,
            required:true,
            trim:true,
        },
        intermediateStations:[
            {
                stationName:{
                    type:String,
                    required:true,
                    trim:true,
                },
                arrivalTime:{
                    type:String,
                    required:true,
                    trim:true,
                },
                departureTime:{
                    type:String,
                    required:true,
                    trim:true,
                }
            }],
        departureTime:{
            type:String,
            required:true,
            trim:true,
        },
        arrivalTime:{
            type:String,
            required:true,
            trim:true,
        },
        totalCompartments:{
            type:Number,
            required:true,
        },
        seatsPerCompartment:{
            type:Number,
            required:true,
        },
        totalSeats:{
            type:Number,
        },
        fare:{
            type:Number,
            required:true,
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Admin",
            required:true,
        },
        
    },
    { timestamps:true, }
);

trainSchema.pre('save', function(){
    this.totalSeats=this.totalCompartments * this.seatsPerCompartment;
});

module.exports=mongoose.model('Train', trainSchema);