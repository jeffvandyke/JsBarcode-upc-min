// Encoding documentation:
// https://en.wikipedia.org/wiki/Universal_Product_Code#Encoding

import encode from './encoder';
import Barcode from "../Barcode.js";

class UPC extends Barcode{
	constructor(data, options = {}){
		// Add checksum if it does not exist
		if(data.search(/^[0-9]{11}$/) !== -1){
			data += checksum(data);
		}

		super(data, options);

		this.displayValue = options.displayValue;

        this.fontSize = options.fontSize;
	}

	valid(){
		return this.data.search(/^[0-9]{12}$/) !== -1 &&
			this.data[11] == checksum(this.data);
	}

	encode(){
        // Force flat encoding
		var result = "";

		result += "101";
		result += encode(this.data.substr(0, 6), "LLLLLL");
		result += "01010";
		result += encode(this.data.substr(6, 6), "RRRRRR");
		result += "101";

		return {
			data: result,
			text: this.text
		};
	}
}

// Calulate the checksum digit
// https://en.wikipedia.org/wiki/International_Article_Number_(EAN)#Calculation_of_checksum_digit
export function checksum(number){
	var result = 0;

	var i;
	for(i = 1; i < 11; i += 2){
		result += parseInt(number[i]);
	}
	for(i = 0; i < 11; i += 2){
		result += parseInt(number[i]) * 3;
	}

	return (10 - (result % 10)) % 10;
}

export default UPC;
