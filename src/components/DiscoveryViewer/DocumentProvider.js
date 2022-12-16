/**
 * This is an example implementation of the `DocumentProvider` interface. This will return the PDF
 * contents for the "Art Effects" doc.
 *
 * To see this in action, create a new collection in your project and upload
 * "/examples/discovery-search-app/public/documents/Art Effects.pdf". Then, when running the
 * example app against this collection, if you search and find this document, when you click
 * "View passage in document" (or similar) to open the document view, you will see the PDF
 * itself rendered, instead of HTML or text.
 */
export class ExampleDocumentProvider {
  async provides(document) {
    return document.extracted_metadata.filename === "test3.pdf";
  }

  async get(document) {
    if (document.extracted_metadata.filename === "test3.pdf") {
      const res = await fetch("http://localhost:3000/test3.pdf");
      return await res.arrayBuffer();
    }
  }
}
