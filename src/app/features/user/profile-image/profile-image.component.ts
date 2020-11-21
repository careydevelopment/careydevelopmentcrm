import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse, HttpEventType, HttpEvent, HttpProgressEvent } from '@angular/common/http';
import { UploadFileService } from '../../service/file-upload.service';
import { UserService } from '../../service/user.service';
import { UploadedImage } from '../../ui/model/uploaded-image';
import { ImageService } from '../../ui/service/image-service';

const profileImageUploadUrl: string = 'http://localhost:8080/user/saveProfileImage';

@Component({
    selector: 'app-profile-image',
    templateUrl: './profile-image.component.html',
    styleUrls: ['./profile-image.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileImageComponent implements OnInit {

    currentFileUpload: UploadedImage;
    progress: { percentage: number } = { percentage: 0 };
    changeImage = false;
    clicked: boolean = false;
    imageError: string = null;

    private alertOptions = {
        autoClose: false,
        keepAfterRouteChange: false
    };

    constructor(private uploadService: UploadFileService, private userService: UserService,
        private imageService: ImageService) { }

    ngOnInit() { }

    change($event) {
        this.changeImage = true;
    }

    upload() {
        this.progress.percentage = 0;
        this.clicked = true;

        this.uploadService.pushFileToStorage(this.currentFileUpload.file, profileImageUploadUrl)
            .subscribe(event => this.handleEvent(event),
                err => this.handleError(err));
    }

    handleEvent(event: HttpEvent<{}>) {
        if (event.type === HttpEventType.UploadProgress) {
            this.handleUploadProgress(event);
        } else if (event instanceof HttpResponse) {
            let body = event.body;
            this.handleResponse(body);
        } else {
            //console.log(event);
        }

        this.currentFileUpload = undefined;
    }

    handleUploadProgress(event: HttpProgressEvent) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        //console.log(this.progress.percentage);
    }

    handleResponse(data: any) {
        console.log("Got a good response");
        console.log(data);
        this.currentFileUpload = undefined;
        this.clicked = false;
    }

    handleError(err: Error) {
        console.error("Error is", err);
        this.clicked = false;
    }

    onUploadedImage(image: UploadedImage) {
        this.imageError = this.imageService.validateImage(image);

        if (!this.imageError) {
            this.currentFileUpload = image;
        }
    }
}
