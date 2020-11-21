import { Component, ViewEncapsulation, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { UploadedImage } from '../model/uploaded-image';
import { ImageService } from '../service/image-service';

@Component({
  selector: 'app-image-uploader',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent {
    public image: any;

    @Output() uploadedImage = new EventEmitter<UploadedImage>();
    @ViewChild('input') inputFile: ElementRef;

    constructor(private imageService: ImageService) { }

    fileChange(input) {
        const reader = new FileReader();
        let uploadImage = {} as UploadedImage;

        if (input.files.length) {
            const file = input.files[0];
            uploadImage.file = file;

            let emitter = this.uploadedImage;

            reader.onload = (event) => {
                let img = new Image();

                img.onload = function (scope) {
                    uploadImage.height = img.height;
                    uploadImage.width = img.width;

                    emitter.emit(uploadImage);
                }

                img.src = <string>event.target.result;
                this.image = reader.result;
            }

            if (this.imageService.validExtension(uploadImage)) {
                //console.log("Reading file");
                reader.readAsDataURL(file);
            } else {
                emitter.emit(uploadImage);
                this.removeImage();
            }
        }
    }

    removeImage():void{
        this.image = '';
    }

    clickFileInput() {
        let el: HTMLElement = this.inputFile.nativeElement;
        el.click();
    }
}
