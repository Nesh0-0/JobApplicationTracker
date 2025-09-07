// utils/textExtractor.js
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(file) {
  if (file.mimetype === "application/pdf") {
    // PDF from buffer
    const data = await pdfParse(file.buffer);
    return data.text;
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // DOCX from buffer
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  } else {
    throw new Error("Unsupported file type. Please upload PDF or DOCX.");
  }
}

module.exports = { extractText };
