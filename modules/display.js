
let pixels = null

export function createDisplay() {
    const size = 64
    const container = document.querySelector('.led-matrix')

    container.style.setProperty('--size', size)
    for (let i = 0; i < size * size; i++) {
        const div = document.createElement('div')
        div.classList.add('pixel')

        container.appendChild(div)
    }

    pixels = document.getElementsByClassName('pixel')
}


export function clearScreen(color) {
    const pixels = document.querySelectorAll('.pixel')
    pixels.forEach(p => {
        p.style.backgroundColor = color
    })
}


export function setRoundedPixels() {
    const pixels = document.querySelectorAll('.pixel')
    pixels.forEach(p => {
        p.style.borderRadius = (this.checked ? '4px' : '0')
    })
}


export function drawPixel(x, y, color) {
    let pos = (64 * y) + x;

    if (pos >= 4096 || pos < 0) return;

    //if (color == "#000000") color = "#3d3d3d";
    pixels[pos].style.backgroundColor = color
}

export function drawHLine(x, y, width, color) {
    for (let i = 0; i < width; i++) {
        drawPixel(x++, y, color);
    }
}

export function drawVLine(x, y, height, color) {
    for (let i = 0; i < height; i++) {
        drawPixel(x, y++, color);
    }
}

export function drawFillRect(x, y, width, height, color) {
    for (let i = 0; i < height; i++) {
        drawHLine(x, y++, width, color);
    }
}

export function drawRect(x, y, width, height, color) {
    drawHLine(x, y, width, color);
    drawHLine(x, y + height - 1, width, color);
    drawVLine(x, y, height, color);
    drawVLine(x + width - 1, y, height, color);
}

export function drawText(x, y, text, color, font) {
    // font = [width, height, space]

    if (!font) font = FONTS.default

    for (let i = 0; i < text.length; i++) {
        //if (text.charAt(i).match(/^[A-Za-z]+$/)) {
        if (text.charAt(i) != ' ') {
            drawRect(x, y - (font.anchor === 0 ? Math.ceil(font.height/2) : 0), font.width, font.height, color);
        }
        x += font.width + font.space;
    }
}


export function drawImage(x, y, image) {
    
    if (!image) return;

    let x_temp = x;
    let y_temp = y;

    const bin = atob(image)
    let uint8Image = new Uint8Array(bin.length);
    for (var i = 0, strLen = bin.length; i < strLen; i++) {
        uint8Image[i] = bin.charCodeAt(i);
    }

    png.fromImageData(uint8Image)
        .then(pngData => {

            let img = pngData.decodePixels()

            if (pngData.colorType === 6) {   //RGBA

                console.log('RGBA')

                for (let i = 0; i < img.length; i += Math.ceil(pngData.pixelBitlength / 8)) {
                    let color = ''
    
                    // little endian
                    let r = img[i];
                    let g = img[i + 1];
                    let b = img[i + 2];
                    color = "#" +
                        r.toString(16).padStart(2, '0') +
                        g.toString(16).padStart(2, '0') +
                        b.toString(16).padStart(2, '0');
    
                    drawPixel(x_temp++, y_temp, color);
                    if (x_temp >= pngData.width + x) {
                        x_temp = x
                        y_temp++
                    }
                }

            }  else if (pngData.colorType === 3) {   // Palette

                console.log('Color palette')

                let decodedPalette = pngData.decodePalette()
                let palette = []
                for (let i = 0; i < decodedPalette.length; i += 3) {
                    let color = ''
    
                    let r = decodedPalette[i];
                    let g = decodedPalette[i + 1];
                    let b = decodedPalette[i + 2];
                    color = "#" +
                        r.toString(16).padStart(2, '0') +
                        g.toString(16).padStart(2, '0') +
                        b.toString(16).padStart(2, '0');

                    palette.push(color)

                    console.log(`%c ${color} `, `background: ${color}; color: #fff'`);  
                }

                for (let i = 0; i < img.length; i++) {
                    let imgByte = img[i];

                    let pixels = []
                    // Split a single byte in chucks, based on the bit length.
                    for (let b=8; b>0; b=b-pngData.pixelBitlength) {
                        pixels.push((imgByte >> (b-pngData.pixelBitlength)) & (Math.pow(2, pngData.pixelBitlength)-1));
                    }

                    pixels.forEach(p => drawPixel(x_temp++, y_temp, palette[p]))

                    if (x_temp >= pngData.width + x) {
                        x_temp = x
                        y_temp++
                    }
                }
            } else {
                console.error(`PNG with colorType ${pngData.colorType} is not supported. Current supported types are 3 (indexed palette) or 6 (RGBA)`)
                return
            }
            
        });
}


export function showModal(title, msg) {
    document.getElementById("modal-title").textContent = title
    document.getElementById("modal-msg").textContent = msg
    document.getElementById('msgbox').style.display = 'block'

}

const Display = {
    createDisplay: createDisplay,
    clearScreen: clearScreen,
    setRoundedPixels: setRoundedPixels,
    showModal: showModal,
    drawPixel: drawPixel,
    drawHLine: drawHLine,
    drawVLine: drawVLine,
    drawFillRect: drawFillRect,
    drawRect: drawRect,
    drawText: drawText,
    drawImage: drawImage

};

export default Display; 
