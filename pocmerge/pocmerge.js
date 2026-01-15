import { LightningElement, track,wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import fabricLib from '@salesforce/resourceUrl/fabric';
import getColorOptions from '@salesforce/apex/poc3.getColourOptions';
import lens from '@salesforce/resourceUrl/lensimage';
import frame from '@salesforce/resourceUrl/Frameimage';

//const src1 = 'https://image.s11.sfmc-content.com/lib/fe3b15717564047b711676/m/1/b1a2c913-c74d-4dfc-b920-03ebd2391ad2.png';
//const src2 = 'https://image.s11.sfmc-content.com/lib/fe3b15717564047b711676/m/1/69561f11-adbb-4a03-ac87-3f82e7b7a376.png';
const staticframesrc=frame;
const staticslenssrc=lens;

export default class FabricCanvas extends LightningElement {
    @track framestyledColors = [];
    @track lensstyledColors=[];
    @track currentColors;
    isFabricLoaded = false;
    canvas;
    frameImage = null;
    lensImage = null;

    renderedCallback() {
        if (this.isFabricLoaded) return;

        loadScript(this, fabricLib)
            .then(() => {
                this.isFabricLoaded = true;
                const canvasElement = this.template.querySelector('canvas');
                this.canvas = new fabric.Canvas(canvasElement);
                console.log('Fabric.js loaded and canvas initialized');
            })
            .catch(error => {
                console.error('Error loading Fabric.js', error);
            });
    }

    @wire (getColorOptions,{metadataName:'Frame__mdt'})
    frameWire({data,error}){
        if(data){
            console.log('framedata >>> '+data);
            
            this.framestyledColors = data.map(color => ({
            colorValue: color,
            style: `background-color: ${color};`
        }));
        }else if(error){
            console.log('Error >>> '+JSON.stringify(error));
        }
    }

    @wire (getColorOptions,{metadataName:'Lens__mdt'})
    lensWire({data,error}){
        if(data){
            console.log('lensdata >>> '+data);
            this.lensstyledColors = data.map(color => ({
            colorValue: color,
            style: `background-color: ${color};`
        }));
        }else if(error){
            console.log('Error 2 >>> '+JSON.stringify(error));
        }
    }

    handleColorClick(event){
        
        console.log('event >>> '+event.target.dataset.color);
        const color = event.target.dataset.color;
        console.log('inside handleColorClick >>> '+color);
    const isFrame = event.target.classList.contains('color-circle-frames');
    const isLens = event.target.classList.contains('color-circle-lens');
    console.log('hey error');

     let imgSrc;
    if (isFrame) {
        imgSrc = frame; // Frame image
    } else if (isLens) {
        imgSrc = lens; // Lens image
    } else {
        console.error('Unknown button type');
        return;
    }

    if (!this.canvas) {
        console.error('Canvas not initialized');
        return;
    }
console.log("hey");

     return new Promise((resolve, reject) => {

        fabric.Image.fromURL(imgSrc, (image) => {
            //img.scaleToWidth(200);
                image.set({
                    id: 'abc',
                    alt: 'xyz'
                });
                resolve(image);
                console.log('image is there');
               this.canvas.clear();
                this.canvas.add(image);

        },{ crossOrigin: 'anonymous' });
    })
    .then((image) => {
         console.log('Image object:1', image);
       //try {
          //const Filter = new fabric.Image.filters.Grayscale();
            //     color: '#FF00FF',
             const Filter = new window.fabric.Image.filters.BlendColor({
                    color: color, // Solid red
                    mode: 'tint',
                    alpha: 0.5 // 50% opacity
                });
           //console.log('Image object:2',image);
            image.filters.push(Filter);
            image.applyFilters();
 this.canvas.clear();
            this.canvas.add(image);
            console.log('Tint filter applied and image added to canvas');
            
            if (isFrame) {
                this.frameImage = image;
            } else if (isLens) {
                this.lensImage = image;
            }
       
    })
    .catch((error) => {
    
        console.error('Error during image processing:', error.message);
    });
     
     
}
seefullimage() {
    if (!this.canvas) return;

    this.canvas.clear();

    if (this.lensImage && this.frameImage) {
        // Reset position of both images before grouping (optional)
        // this.lensImage.set({
        //     left: 0,
        //     top: 0,
        //     originX: 'center',
        //     originY: 'center'
        // });

        // this.frameImage.set({
        //     left: 0,
        //     top: 0,
        //     originX: 'center',
        //     originY: 'center'
        // });

        // Create group
        const group = new fabric.Group([this.frameImage, this.lensImage], {
            left: this.canvas.getWidth() / 2,
            top: this.canvas.getHeight() / 2,
            originX: 'center',
            originY: 'center'
        });

        this.canvas.add(group);
        this.canvas.renderAll();
    } else {
        // Fallback: if only one image exists, add it alone
        if (this.lensImage) {
            this.lensImage.set({
                left: this.canvas.getWidth() / 2,
                top: this.canvas.getHeight() / 2,
                originX: 'center',
                originY: 'center'
            });
            this.canvas.add(this.lensImage);
        }

        if (this.frameImage) {
            this.frameImage.set({
                left: this.canvas.getWidth() / 2,
                top: this.canvas.getHeight() / 2,
                originX: 'center',
                originY: 'center'
            });
            this.canvas.add(this.frameImage);
        }

        this.canvas.renderAll();
    }
}

}

  
//     seefullimage() {
//     const layer1 = this.template.querySelector('.layer1');
//     const layer2 = this.template.querySelector('.layer2');

//     if (layer1 && layer2) {
//         layer1.style.display = 'block';
//         layer2.style.display = 'block';
//     }
// }
    // getColorStyle(color) {
    // return `background-color: ${color};`;
    // }

