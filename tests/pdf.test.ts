import * as assert from "assert"
import * as PDFManager from "../src/libs/pdf_manager/pdf_manager"

// Obscure characters
// ⬛⬛⬛⬛⬛⬛⬛
// ■■■■■■■■■■■■■

test('Read PDF', async () => {
    const path  = __dirname + '/assets/cv.pdf'
    const text = await PDFManager.readPdfText(path)
    console.log(text)
    assert(text.length > 0)
    return true
})
