import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { UploadFileService } from '../../service/file-upload.service';
import { UserService, User } from 'carey-user';
import { UploadedImage } from '../../ui/model/uploaded-image';
import { ImageService } from 'carey-image-uploader';
import { AlertService } from 'carey-alert';
import { environment } from '../../../../environments/environment';

const profileImageUploadUrl: string = `${environment.baseUserServiceUrl}/user/profileImage`;

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileImageComponent implements OnInit {

  currentFileUpload: UploadedImage;
  changeImage: boolean = false;
  uploading: boolean = false;
  imageToShow: any = null;
  user: User = null;
  showSpinner: boolean = true;

  constructor(private uploadService: UploadFileService, private userService: UserService,
    private imageService: ImageService, private alertService: AlertService) { }

  ngOnInit() {
    this.user = this.userService.user;

    this.userService.fetchProfileImage(this.user.id)
      .subscribe(image => this.createImage(image),
        err => this.handleImageRetrievalError(err));
  }

  private handleImageRetrievalError(err: Error) {
    console.error(err);
    this.showSpinner = false;
    this.alertService.error("Problem retrieving profile photo.");
  }

  private createImage(image: Blob) {
    if (image && image.size > 0) {
      let reader = new FileReader();

      reader.addEventListener("load", () => {
        this.imageToShow = reader.result;
        this.showSpinner = false;
      }, false);

      reader.readAsDataURL(image);
    } else {
      this.showSpinner = false;
    }
  }

  change($event) {
    this.changeImage = true;
  }

  upload() {
    this.alertService.clear();
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
    this.displaySuccess();
  }

  handleError(err: Error) {
    console.error("Error is", err);
    this.uploading = false;
    this.displayError(err.message);
  }

  onUploadedImage(image: UploadedImage) {
    this.alertService.clear();
    let imageError: string = this.imageService.validateImage(image);

    if (!imageError) {
      this.currentFileUpload = image;
    } else {
      this.displayError(imageError);
    }
  }

  private displayError(message: string) {
    this.alertService.error(message,
      { autoClose: false }
    );
  }

  private displaySuccess() {
    this.alertService.success("Profile photo successfully uploaded!",
      { autoClose: false }
    );
  }
}
