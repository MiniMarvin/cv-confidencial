import * as PdfReader from "pdfreader";
function readPdfText(pdfPath) {
    return new Promise((resolve, reject) => {
        (new PdfReader.PdfReader()).parseFileItems(pdfPath, function (err, item) {
            if (err)
                reject(err);
            else if (!item)
                reject();
            else if (item.text)
                resolve(item.text);
        });
    });
}
export { readPdfText };
//# sourceMappingURL=pdf_manager.js.map