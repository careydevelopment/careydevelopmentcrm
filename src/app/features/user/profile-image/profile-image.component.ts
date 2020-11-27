import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { UploadFileService } from '../../service/file-upload.service';
import { UserService } from '../../service/user.service';
import { UploadedImage } from '../../ui/model/uploaded-image';
import { ImageService } from '../../ui/service/image-service';

const profileImageUploadUrl: string = 'http://localhost:8080/user/profileImage';

@Component({
    selector: 'app-profile-image',
    templateUrl: './profile-image.component.html',
    styleUrls: ['./profile-image.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileImageComponent implements OnInit {

  currentFileUpload: UploadedImage;
  changeImage: boolean = false;
  imageError: string = null;
  uploading: boolean = false;

  constructor(private uploadService: UploadFileService, private userService: UserService,
    private imageService: ImageService) { }

  ngOnInit() { }

  change($event) {
    this.changeImage = true;
  }

  upload() {
    this.uploading = true;

    this.uploadService.pushFileToStorage(this.currentFileUpload.file, profileImageUploadUrl)
        .subscribe(event => this.handleEvent(event),
            err => this.handleError(err));
  }

  handleEvent(event: HttpEvent<any>) {
    if (event instanceof HttpResponse) {
      let response: HttpResponse<any> = <HttpResponse<any>>event;
      if (response.status == 200) {
        this.handleGoodResponse();
      }
    }
  }

  handleGoodResponse() {
    this.currentFileUpload = undefined;
    this.uploading = false;
  }

  handleError(err: Error) {
    console.error("Error is", err);
    this.imageError = err.message;
    this.uploading = false;
  }

  onUploadedImage(image: UploadedImage) {
    this.imageError = this.imageService.validateImage(image);

    if (!this.imageError) {
        this.currentFileUpload = image;
    }
  }
}
