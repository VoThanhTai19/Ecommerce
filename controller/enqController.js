const Enquiry = require('../models/enqModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

//create Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    }catch(err) {
        throw new Error(err)
    }
})

//get all Enquiry
const getAllEnquiry = asyncHandler(async (req, res) => {
    try {
        const getAllEnquiry = await Enquiry.find()
        res.json(getAllEnquiry)
    }catch(err) {
        throw new Error(err)
    }
})

//get Enquiry
const getEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const getEnquiry = await Enquiry.findById(id)
        res.json(getEnquiry)
    }catch(err) {
        throw new Error(err)
    }
})

//update Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {new: true})
        res.json({
            message: 'Enquiry updated successfully',
            Enquiry: updateEnquiry
        })
    }catch(err) {
        throw new Error(err)
    }
})

//delete Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {   
        const deleteEnquiry = await Enquiry.findByIdAndDelete(id)
        res.json({
            message: 'Enquiry deleted successfully',
            Enquiry: deleteEnquiry
        })
    }catch(err) {
        throw new Error(err)
    }
})

module.exports = {
    createEnquiry,
    getAllEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry
}
