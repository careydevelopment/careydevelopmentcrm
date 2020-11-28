import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { UploadFileService } from '../../service/file-upload.service';
import { UserService } from '../../service/user.service';
import { UploadedImage } from '../../ui/model/uploaded-image';
import { ImageService } from '../../ui/service/image-service';
import { AlertService} from '../../../ui/alert/alert.service';

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
  uploading: boolean = false;

  constructor(private uploadService: UploadFileService, private userService: UserService,
    private imageService: ImageService, private alertService: AlertService) { }

  ngOnInit() { }

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
