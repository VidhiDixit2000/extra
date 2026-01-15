import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import fabricLib from '@salesforce/resourceUrl/fabric';
import myImage from '@salesforce/resourceUrl/imagewhiteteeshirt';
// Then use:
const src = myImage;

export default class FabricCanvas extends LightningElement {
    isFabricLoaded = false;
    canvas;

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

    loadFromUrl() {
    //const src = 'https://www.google.com/images/srpr/logo3w.png';
    const src = myImage;

     return new Promise((resolve, reject) => {
        fabric.Image.fromURL(src, (image) => {
            //if (image) {
                image.set({
                    id: 'abc',
                    alt: 'xyz',
                    originX: 'center',
                    originY: 'center'
                });
                //console.log('Image object before .then', image);
                resolve(image);
                console.log('image is there');
                //console.log('image the callback:'image);
                this.canvas.add(image);
             /*} else {
                reject('Image could not be loaded');
            }*/
        },{ crossOrigin: 'anonymous' });
    })
    .then((image) => {
        var text = new fabric.Text('Whats the tee?', {
                               fontSize: 30,
                fill: '#000000',
                originX: 'center',
                originY: 'center',
                left: 0,  // Relative to group center
                top: 0    // Relative to group center
                });
        var group = new fabric.Group([ image, text ], {
                               left: 0,
                               top: 0,
                               //angle: 0
                         });
                         this.canvas.add(group);
         console.log('Image object:1', image);
       
            //  const Filter = new window.fabric.group.filters.BlendColor({
            //         color: '#FF0000', // Solid red
            //         mode: 'tint',
            //         alpha: 0.5 // 50% opacity
            //     });

                
           //console.log('Image object:2',image);
            image.filters.push(Filter);
            image.applyFilters();

            this.canvas.add(group);
            console.log('Tint filter applied and image added to canvas');
       // } catch (err) {
           // throw new Error('Failed to apply filter: ' + err.message);
       // }
    })
    .catch((error) => {
    
        console.error('Error during image processing:', error.message);
    });
}


    save() {
        const json = this.canvas.toJSON();
        localStorage.setItem('canvas', JSON.stringify(json));
        console.log('Canvas saved to localStorage');
    }

    clear() {
        this.canvas.clear();
        console.log('Canvas cleared');
    }

    open() {
        const json = JSON.parse(localStorage.getItem('canvas'));
        if (json) {
            this.canvas.loadFromJSON(json, () => {
                this.canvas.renderAll();
                console.log('Canvas restored from localStorage');
            });
        } else {
            console.warn('No canvas data found in localStorage');
        }
    }
}


