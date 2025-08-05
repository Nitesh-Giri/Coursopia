import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { v2 as cloudinary } from 'cloudinary';

export const createCourse = async (req, res) => {
    const adminId = req.adminId;

    const { title, description, price } = req.body;
    try {

        if (!title || !description || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const {image} = req.files

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const allowedFormate = ["image/png", "image/jpeg", "image/jpg"];

        if (!allowedFormate.includes(image.mimetype)) {
            return res.status(400).json({ message: "Invalid file type" });
        }

        // Cloudinary code

        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if(!cloud_response || cloud_response.error){
            return res.status(500).json({ message: "Error uploading image" });
        }

        const courseData = { 
            title, 
            description, 
            price,
            image:{
                public_id: cloud_response.public_id,
                url: cloud_response.url
            },
            creatorId: adminId
         };

        const course =await Course.create(courseData);

        res.json({
            message: "Courese created successfully",
            course
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating course" });
    }
}
export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price, image } = req.body;
    try {
        const courseSeaeched = await Course.findById(courseId);
        if(!courseSeaeched){
            return res.status(404).json({ message: "Course not found" });
        }
        
        const course = await Course.findOneAndUpdate({
            _id:courseId,
            creatorId:adminId
        }, {
            title,
            description,
            price,
            image:{
                public_id:image?.public_id,
                url:image?.url
            }
        });

        if(!course){
            return res.status(404).json({ message: "Course not found coz you are not the creator" });
        }

        res.json({
            message: "Courese updated successfully",
            course
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating course" });
    }
};

export const deleteCourse = async (req, res) => {
        const adminId = req.adminId;
        const {courseId} = req.params;
        try {
            const course = await Course.findOneAndDelete({
                _id: courseId, 
                creatorId: adminId,
            });            

            if(!course){
                return res.status(404).json({ message: "Course not found coz you are not the creator" });
            }

            res.json({
                message: "Courese deleted successfully",
                course
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error deleting course" });
        }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json({
            message: "Courese fetched successfully",
            courses
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching courses" });
    }
};

export const courseDetails = async (req, res) => {
    const {courseId} = req.params;    
    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({ message: "Course not found" });
        }
        
        res.json({
            // message: "Courese fetched successfully",
            course
        })
    } catch (error) {
        console.log(error);        
        res.status(500).json({ message: "Error fetching course" }); 
    }
};

export const buyCourses = async (req, res) =>{
    const {userId} = req;
    const {courseId} = req.params;

    try {
        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({ message: "Course not found" });
        }

        const existingPurchase = await Purchase.findOne({userId, courseId});

        if(existingPurchase){         
            return res.status(400).json({ message: "Course already purchased" });
        }


        const newPurchase = await Purchase.create({userId, courseId});
        await newPurchase.save();

        res.json({
            message: "Course purchased successfully",
            newPurchase
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error purchasing course" });
    }
};

