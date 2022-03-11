import * as PDF from "pdf-parse";
import * as fs from "fs";
// import * as hummus from "hummus";
import * as muhammara from "muhammara"
// import { PDFDocument } from "pdf-lib"

function readPdfText(pdfPath: string): Promise<String> {
  return new Promise(async (resolve, reject) => {
    const file = fs.readFileSync(pdfPath);
    // const pdfDoc = await PDFDocument.load(pdfPath)

    const pdf = PDF(file);
    pdf
      .then((pdfResult) => {
        resolve(pdfResult.text);
      })
      .catch((err) => reject(err));
  });
}

/**
 * Returns a byteArray string
 *
 * @param {string} str - input string
 */
function strToByteArray(str: string) {
  var myBuffer = [];
  var buffer = new Buffer(str);
  for (var i = 0; i < buffer.length; i++) {
    myBuffer.push(buffer[i]);
  }
  return myBuffer;
}

function replaceText(
  sourceFile: string,
  targetFile: string,
  pageNumber: number,
  originText: string,
  destinationText: string
) {
  const writer = muhammara.createWriterToModify(sourceFile, {
    modifiedFilePath: targetFile,
  });

  const sourceParser = writer
    // @ts-ignore
    .createPDFCopyingContextForModifiedFile()
    .getSourceDocumentParser();

  const pageObject = sourceParser.parsePage(pageNumber);
  const textObjectId = pageObject
    .getDictionary()
    .toJSObject()
    .Contents.getObjectID();
  const textStream = sourceParser.queryDictionaryObject(
    pageObject.getDictionary(),
    "Contents"
  );

  //read the original block of text data
  let data = [];
  const readStream = sourceParser.startReadingFromStream(textStream);
  while (readStream.notEnded()) {
    Array.prototype.push.apply(data, readStream.read(10000));
  }
  let string = Buffer.from(data).toString();
  const characters = originText;
  const match = [];
  for (let a = 0; a < characters.length; a++) {
    match.push("(-?[0-9]+)?(\\()?" + characters[a] + "(\\))?");
  }

  string = string.replace(new RegExp(match.join("")), function (_, m1) {
    // m1 holds the first item which is a space
    return m1 + "( " + destinationText + ")";
  });

  //Create and write our new text object
  // @ts-ignore
  const objectsContext = writer.getObjectsContext();
  objectsContext.startModifiedIndirectObject(textObjectId);

  const stream = objectsContext.startUnfilteredPDFStream();
  stream.getWriteStream().write(strToByteArray(string));
  objectsContext.endPDFStream(stream);

  objectsContext.endIndirectObject();
  writer.end();
}

export { readPdfText, replaceText };
