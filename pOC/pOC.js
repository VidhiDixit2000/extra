import { LightningElement, api } from 'lwc';

export default class KickflipEmbed extends LightningElement {
    @api productId; // passed from parent or builder

    get customizerUrl() {
        return `https://customizer.go-kickflip.com/customizer/${this.productId}`;
    }
}
