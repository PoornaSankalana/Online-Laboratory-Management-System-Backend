const Report = require("../models/reportModel");
const { reportValidation } = require("../validations/reportValidation");

//add report function
const addReport = async(req, res) => {
    //validate the report input fields
    const { error } = reportValidation(req.body);
    if(error) {
        res.send({ message: error["details"][0]["message"] });
    }

    // checking the data in the console
    // console.log(req.body);

    //to check report already exist
    const reportExist = await Report.findOne({
        nic: req.body.nic,
        date: req.body.date,
        testName: req.body.testName,
    });

    if(reportExist) {
        // console.log(nicExist);
        return res.status(400).send({ message: "Report already exist" });
    }

    //assign data to the model
    const report = new Report({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        date: req.body.date,
        age: req.body.age,
        nic: req.body.nic,
        phoneNumber: req.body.phoneNumber,
        testName: req.body.testName,
        test: req.body.test,
        result: req.body.result,
        normalValues: req.body.normalValues,
    });

    try {
        //save the data in the database
        console.log("Report Saved Successfully");
        const savedReport = await report.save();
        res.send(savedReport);
        console.log(savedReport);
    } catch(error) {
        //error handling
        res.status(400).send({ message: error });
    }
};

const getreports = async (req, res) => {
	try {
		// taking all the report data
		const allReports = await Report.find();
		res.send(allReports); // sending the taken data
	} catch (err) {
		res.status(400).json(err.message); // error handling
	}
};

const getOneReport = async (req, res) => {
	try {
		// taking the relavent report
		const takenReport = await Report.findOne({ _id: req.params.id });

		// checking whether is there that report in the DB
		if (!takenReport) {
			res.status(404).json("Report not found !"); // if not found report
		} else {
			res.status(200).json(takenReport); // if found sending display report
		}
	} catch (err) {
		res.status(400).json(err.message); // error handling
	}
};

const deleteReport = async (req, res) => {
	const reportID = req.params.id;
	try {
		// taking report id to a variable
		const report = await Report.findById(reportID);

		// checking whether is there that report in the DB
		if (!report) {
			res.status(404).json("Report not found !"); // if not found report
		} else {
			const deletedReport = await Report.findByIdAndDelete(
				reportID,
			); // if found delete report
			res.status(200).json(deletedReport);
			console.log("Report Deleted Successfully !");
		}
	} catch (err) {
		res.status(400).json(err.message); // error handling
	}
};

const updateReport = async (req, res) => {
	
	try {
		// setting the updated details of the specific user and update database
		const updatedReport = await Report.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true },
		);

		// checking whether is there any updated report
		if (!updatedReport) {
			res.status(500).json("Report Not Found !");
			console.log("Report Not Found !");
		} else {
			// sending the updated user when it is successfull
			res.status(200).json(updatedReport);
			console.log("Report Updated Successfully !");
		}
	} catch (err) {
		// if there is any error in updating this will catch it and send
		res.status(400).json(err);
		console.log("Report Update Error !");
	}
};

module.exports = {
    addReport,
    getreports,
	getOneReport,
	deleteReport,
	updateReport,
}; //export functions