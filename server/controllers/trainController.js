const Train= require("../models/Train");

// CREATE Train - Admin only 

const createTrain= async (req,res)=>{
    try{
        const 
        {
            trainName,trainNumber, boardingPoint, destinationPoint, 
            intermediateStations, departureTime, arrivalTime, 
            totalCompartments, seatsPerCompartment, fare 
        } =req.body;

        if(!trainName||!trainNumber||!boardingPoint|| !destinationPoint|| !totalCompartments||!seatsPerCompartment||!fare)
            {
                return res.status(400).json({message:"All fields are required"})
            }

        const existingTrain= await Train.findOne({ trainNumber });
        if(existingTrain){
            return res.status(400).json({msg:"Train number already exists"});
        }

        const train= await Train.create({
            trainName,trainNumber, boardingPoint, destinationPoint, 
            intermediateStations, departureTime, arrivalTime, 
            totalCompartments, seatsPerCompartment, fare,
            createdBy: req.user.id,
        });
        return res.status(201).json({msg:"Train created successfully", train});
        }
        catch(error){
            res.status(500).json({error: error.message});
            // console.log(error);
        }
};




// GET ALL TRAINS (Public - users need to see this too)
const getAllTrains= async (req,res)=>{
    try{
        const trains= await Train.find().sort({ createdAt:-1 });
        res.status(200).json({msg:"all trains",trains});
    }
    catch(error){
        res.status(500).json({msg:"Server error", error:error.message});
    }
};




// GET SINGLE TRAIN BY ID
const getTrainById= async (req,res)=>{
  try { 
    const train = await Train.findById(req.params.id);

    if(!train){
        res.status(400).json({msg:"Train not Found"});
    }

    res.status(200).json({msg:"Train found",train});
    }catch(error){
        res.status(500).json({error: error.message});
        console.log(error);
    }
};




// UPDATE TRAIN (Admin only)
const updateTrain= async (req,res)=>{
    try{
        const train= await Train.findById(req.params.id);

    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    const updatedTrain = await Train.findByIdAndUpdate( req.params.id, req.body,
        {
            new:true,
            runValidators:true
        });

        if(!updatedTrain){
            return res.status(400).json({msg:"Train not updated"});
        }
        // console.log(updatedTrain.fare);
        res.status(200).json({msg:"Train Updated Succesfully",updatedTrain});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};




// DELETE TRAIN (Admin only)
const deleteTrain= async(req,res) =>{
    try{
        const train= await Train.findById(req.params.id);
        if(!train){
            res.status(400).json({msg:"Train not found"});
        }

        await train.deleteOne();
        res.status(200).json({ message: "Train deleted successfully" });
      }
    catch (error)
    {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
  createTrain,
  getAllTrains,
  getTrainById,
  updateTrain,
  deleteTrain,
};    




