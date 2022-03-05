import * as PDF from "pdf-parse";
import * as fs from "fs";

function readPdfText(pdfPath: string): Promise<String> {
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(pdfPath);
    const pdf = PDF(file);
    pdf
      .then((pdfResult) => {
        resolve(pdfResult.text);
      })
      .catch((err) => reject(err));
  });
}

export { readPdfText };
