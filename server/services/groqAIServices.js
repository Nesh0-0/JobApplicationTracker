// resumeScanner.js
const Groq = require("groq-sdk");
require("dotenv").config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function analyzeResume(resumeText, jobDescription) {
    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",   // Updated model

            messages: [
                {
                    role: "system",
                    content: `
                    You are a professional resume reviewer.
                    Compare the candidate's resume against the job description.
                    Always respond in **valid JSON** with the following fields:

                    {
                    "matchedSkills": [string],
                    "missingSkills": [string],
                    "relevanceScore": number,   // 0-100
                    "strengths": [string],
                    "suggestions": [string],
                    "summary": string
                    }
                   `
                },
                {
                    role: "user",
                    content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
                }
            ],
            temperature: 0.3,
            max_tokens: 600
        });

        let content = completion.choices[0].message.content.trim();

        // Remove Markdown code block formatting if present
        if (content.startsWith("```")) {
            content = content.replace(/```json|```/g, "").trim();
        }

        try {
            content = JSON.parse(content);
        } catch (e) {
            console.warn("Model returned non-JSON, wrapping it");
            content = { raw: content };
        }

        return { success: true, message: 'Generated summary successfully!', details: content };
    }
    catch (err) {
        console.log(err);
        return { success: false, message: 'Could not generate summary!', error: err};
    }
};

module.exports = { analyzeResume };
