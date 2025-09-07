const textExtractor = require('../utils/textExtractor');
const groqServices = require('../services/groqAIServices');

const processResume = async (req, res) => {

    try {

        const resume = req.file;
        const { jobDescription } = req.body;

        console.log(jobDescription);
        console.log(resume);

        if (!resume || !jobDescription) {
            return res.status(400).json({ success: false, message: "Resume file and job description required" });
        }

        console.log("Received JD:", jobDescription);
        console.log("Uploaded Resume:", resume.originalname);
        // console.log(resume.path)

        // Step 1: Extract text from resume
        const resumeText = await textExtractor.extractText(resume);

        // Step 2: Send text + job description to AI for analysis
        const analysis = await groqServices.analyzeResume(resumeText, jobDescription);

        // Step 3: Respond with results
        if (analysis.success) {

            return res.json({
                success: true,
                file: resume.originalname,
                details: analysis.details
            });
        }
        else 
            throw new Error(analysis.message);

    } catch (err) {
        console.error("Resume Processing Error:", err);
        res.status(500).json({ success: false, message: "Failed to process resume" });
    }
};

module.exports = { processResume };