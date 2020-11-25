import { Injectable } from '@angular/core';
import { UploadedImage } from '../model/uploaded-image';

const maxUploadSize: number = 524288;
const allowedExtensions: string[] = ['png', 'jpg', 'jpeg'];

@Injectable({ providedIn: 'root' })
export class ImageService {

    constructor() { }

    validateImage(image: UploadedImage): string {
        let imageError: string = null;
        console.log("image file name is " + image.file.name);

        if (image.file.size > maxUploadSize) {
            imageError = "Image file is too large (Max 500k)";
        } else if (image.height / image.width < 0.95 || image.height / image.width > 1.05) {
            imageError = "Please upload a square image";
        } else if (image.height > 1200) {
            imageError = "Maximum image height is 1200 pixels";
        } else if (!this.validExtension(image)) {
            imageError = "Only .jpg and .png images are allowed";
        } 

        return imageError;
    }

    validExtension(image: UploadedImage): boolean {
        let valid: boolean = false;

        for (let i = 0; i < allowedExtensions.length; i++) {
            if (image.file.name.endsWith(allowedExtensions[i])) {
                valid = true;
                break;
            }
        }

        return valid;
    }
}
