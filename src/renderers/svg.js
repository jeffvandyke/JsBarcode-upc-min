import merge from "../help/merge.js";
import {
  calculateEncodingAttributes,
  getTotalWidthOfEncodings,
  getMaximumHeightOfEncodings,
} from "./shared.js";

var svgns = "http://www.w3.org/2000/svg";

const setAttribute = (element, name, value) =>
  element.setAttribute(name, value);

function makeSVGRenderer(svg, encodings, options) {
  const document = window.document;

  function prepareSVG() {
    // Clear the SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    calculateEncodingAttributes(encodings, options);
    var totalWidth = getTotalWidthOfEncodings(encodings);
    var maxHeight = getMaximumHeightOfEncodings(encodings);

    var width = totalWidth + options.marginLeft + options.marginRight;
    setSvgAttributes(width, maxHeight);

    if (options.background) {
      setAttribute(
        drawRect(0, 0, width, maxHeight, svg),
        "style",
        "fill:" + options.background + ";",
      );
    }
  }

  function drawSvgBarcode(parent, encoding) {
    var binary = encoding.data;

    // Creates the barcode out of the encoded binary
    var yFrom;
    if (options.textPosition == "top") {
      yFrom = options.fontSize + options.textMargin;
    } else {
      yFrom = 0;
    }

    var barWidth = 0;
    var x = 0;
    for (var b = 0; b < binary.length; b++) {
      x = b * options.width + encoding.barcodePadding;

      if (binary[b] === "1") {
        barWidth++;
      } else if (barWidth > 0) {
        drawRect(
          x - options.width * barWidth,
          yFrom,
          options.width * barWidth,
          options.height,
          parent,
        );
        barWidth = 0;
      }
    }

    // Last draw is needed since the barcode ends with 1
    if (barWidth > 0) {
      drawRect(
        x - options.width * (barWidth - 1),
        yFrom,
        options.width * barWidth,
        options.height,
        parent,
      );
    }
  }

  function drawSVGText(parent, encoding) {
    var textElem = document.createElementNS(svgns, "text");

    // Draw the text if displayValue is set
    if (options.displayValue) {
      var x, y;

      setAttribute(
        textElem,
        "style",
        "font:" +
          options.fontOptions +
          " " +
          options.fontSize +
          "px " +
          options.font,
      );

      if (options.textPosition == "top") {
        y = options.fontSize - options.textMargin;
      } else {
        y = options.height + options.textMargin + options.fontSize;
      }

      // Draw the text in the correct X depending on the textAlign option
      if (options.textAlign == "left" || encoding.barcodePadding > 0) {
        x = 0;
        setAttribute(textElem, "text-anchor", "start");
      } else if (options.textAlign == "right") {
        x = encoding.width - 1;
        setAttribute(textElem, "text-anchor", "end");
      }
      // In all other cases, center the text
      else {
        x = encoding.width / 2;
        setAttribute(textElem, "text-anchor", "middle");
      }

      setAttribute(textElem, "x", x);
      setAttribute(textElem, "y", y);

      textElem.appendChild(document.createTextNode(encoding.text));

      parent.appendChild(textElem);
    }
  }

  function setSvgAttributes(width, height) {
    setAttribute(svg, "width", width + "px");
    setAttribute(svg, "height", height + "px");
    setAttribute(svg, "x", "0px");
    setAttribute(svg, "y", "0px");
    setAttribute(svg, "viewBox", "0 0 " + width + " " + height);

    setAttribute(svg, "xmlns", svgns);
    setAttribute(svg, "version", "1.1");

    setAttribute(svg, "style", "transform: translate(0,0)");
  }

  function createGroup(x, y, parent) {
    var group = document.createElementNS(svgns, "g");
    setAttribute(group, "transform", "translate(" + x + ", " + y + ")");

    parent.appendChild(group);

    return group;
  }

  function setGroupOptions(group) {
    setAttribute(group, "style", "fill:" + options.lineColor + ";");
  }

  function drawRect(x, y, width, height, parent) {
    var rect = document.createElementNS(svgns, "rect");

    setAttribute(rect, "x", x);
    setAttribute(rect, "y", y);
    setAttribute(rect, "width", width);
    setAttribute(rect, "height", height);

    parent.appendChild(rect);

    return rect;
  }

  return {
    render: () => {
      var currentX = options.marginLeft;

      prepareSVG();
      for (let i = 0; i < encodings.length; i++) {
        var encoding = encodings[i];

        var group = createGroup(currentX, options.marginTop, svg);

        setGroupOptions(group);

        drawSvgBarcode(group, encoding);
        drawSVGText(group, encoding);

        currentX += encoding.width;
      }
    },
  };
}

export default makeSVGRenderer;
