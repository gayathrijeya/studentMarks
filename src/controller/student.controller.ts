import { validationResult } from "express-validator"
import * as async from 'async';
import { StudentDocument, Student} from '../models/student.model'
import { response } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";

var activity = 'Student';

/**
 * @author Viveka S
 * @date 16-07-2022
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create Student
 */
// export const saveStudent = async (req,res,next)=>{
//     console.log('sssssssss');
    
//     const errors = validationResult(req)
//     if(errors.isEmpty()){  
//         try{
//             const studentData = req.body
//             console.log('studentDataaaa');
//             console.log(studentData);
            
//             async.eachSeries(studentData,function(element,callBack){

//             })
//         }catch{

//         }
//     }
// }


export let getAllStudent = async (req, res, next) => {
    try {
        const data = await Student.find({ isDeleted: false });
        response(req, res, activity, true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export const saveStudent = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const EmailSettingsDetails: StudentDocument = req.body;
            const createEmailSettings = new Student(EmailSettingsDetails);
            const data = await createEmailSettings.save();
            response(req, res, activity, true, 200, data, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
};



export let updateStudent= async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails: StudentDocument = req.body;
                const updateStudent = new Student(studentDetails)
                let insertStudent = await updateStudent.updateOne({
                    $set: {
                        dateOfBirth: studentDetails.dateOfBirth,
                        age: studentDetails.age,
                        address: studentDetails.address,
                        modifiedOn: studentDetails.modifiedOn,
                        modifiedBy: studentDetails.modifiedBy
                    }
                });
                
                response(req, res, activity, true, 200, insertStudent, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let deleteStudent = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await Student.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        response(req, res, activity, true, 200, data, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, true, 500, {}, errorMessage.internalServer, err.message)
    }
};



export let getSingleStudent = async (req, res,next) => {
    try {
        const data = await Student.findById({ _id: req.query._id });
        response(req, res, activity, true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, false, 500, {}, errorMessage.internalServer, err.message);
    }
}