
export function convert16To24Bits(color565) {

    const redMask   = 0b1111100000000000;
    const greenMask = 0b0000011111100000;
    const blueMask  = 0b0000000000011111;

    //String color565 = "0xFFE0";
    //int colorAsInteger = Integer.parseInt(color.substring(2,color.length()), 16); // convert the Hex value to int

    const R = ((((color565 >> 11) & 0x1F) * 527) + 23) >> 6;
    const G = ((((color565 >> 5) & 0x3F) * 259) + 33) >> 6;
    const B = (((color565 & 0x1F) * 527) + 23) >> 6;

    const color = "#" + R.toString(16).padStart(2, '0') + G.toString(16).padStart(2, '0') + B.toString(16).padStart(2, '0')
    return color;
}


export function convert24To16Bits(rgbColor) {

    let RGB888 = parseInt(rgbColor.replace(/^#/, ''), 16);
    let r = (RGB888 & 0xFF0000) >> 16;
    let g = (RGB888 & 0xFF00) >> 8;
    let b = RGB888 & 0xFF;
    
    r = (r * 249 + 1014) >> 11;
    g = (g * 253 + 505) >> 10;
    b = (b * 249 + 1014) >> 11;
    let RGB565 = 0;
    RGB565 = RGB565 | (r << 11);
    RGB565 = RGB565 | (g << 5);
    RGB565 = RGB565 | b;
    
    return RGB565;
}


export function formatDateTime(content) {
    const oneChar = /(N|w|B)/g;
    const twoChars = /(d|j|S|m|n|t|y|a|A|g|G|h|H|i|s|W)/g;
    const threeChars = /(D|M|v|z)/g;

    //l 7 chars
    //F 8
    //Y 4
    //T
    //e
    //O 5
    //P 6

    let result = content.replace(oneChar, '1')
    result = result.replace(twoChars, '12')
    result = result.replace(threeChars, 'Tue')
    return result 
}



export function getInputValue(input) {
    if (input.type === 'number') {
        return parseInt(input.value)
    } else if (input.type === 'color') {
        return convert24To16Bits(input.value)
    } else {
        return input.value
    }

}

export function getMethod(elementId) {
    return elementId.split('-')[0]
}


export function generateUID() {
    var firstPart = (Math.random() * 46656) | 0
    var secondPart = (Math.random() * 46656) | 0
    firstPart = ("000" + firstPart.toString(36)).slice(-3)
    secondPart = ("000" + secondPart.toString(36)).slice(-3)
    return firstPart + secondPart
}


export function getIndexById(array, id) {
    return array.map(x => x.id).indexOf(id);
}

export function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const Utils = {
    convert16To24Bits: convert16To24Bits,
    convert24To16Bits: convert24To16Bits,
    formatDateTime: formatDateTime,
    getInputValue: getInputValue,
    getMethod: getMethod,
    generateUID: generateUID,
    getIndexById: getIndexById,
    slugify: slugify

};

export default Utils; 
