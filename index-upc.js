import UPC from "./src/barcodes/EAN_UPC/UPC.js";
import makeSVGRenderer from "./src/renderers/svg.js";


function applyJsBarcodeUpc(svgElement, upcNumberText, options) {
  const barcodeEncoder = new UPC(upcNumberText);
  if (!barcodeEncoder.valid()) {
    console.error(`Invalid UPC "${upcNumberText}"`);
    return;
  }

  const encoding = barcodeEncoder.encode();
  console.log(encoding)

  // ---- Render ----

  if (
    !svgElement ||
    !svgElement.nodeName ||
    svgElement.nodeName.toLowerCase() !== "svg"
  ) {
    console.error("Target needs to be an <svg> element");
    return;
  }

  const svgRenderer = makeSVGRenderer(svgElement, [encoding], {
    width: 2,
    height: 100,
    displayValue: true,
    fontOptions: "",
    font: "monospace",
    textMargin: 2,
    fontSize: 20,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    ...options,
  });
  svgRenderer.render();
}

export default applyJsBarcodeUpc;
