import * as PDFManager from "../src/libs/pdf_manager/pdf_manager";
test('Read PDF', async () => {
    const path = __dirname + '/assets/cv.pdf';
    const text = await PDFManager.readPdfText(path);
    console.log(text);
    return true;
});
//# sourceMappingURL=pdf.test.js.map