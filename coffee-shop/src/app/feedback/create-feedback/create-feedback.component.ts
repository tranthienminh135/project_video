import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FeedbackService} from "../service/feedback.service";
import {AngularFireStorage} from "@angular/fire/storage";
import {formatDate} from "@angular/common";
import {finalize} from "rxjs/operators";
import {Feedback} from "../model/feedback";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-create-feedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.css']
})
export class CreateFeedbackComponent implements OnInit {
  currentDate = new Date();
  rating: number[] = [1, 2, 3, 4, 5];
  value: number = 0;
  feedbackFrom: FormGroup;
  selectedImage: any = null;
  isLoading: Boolean = false;

  constructor(private feedbackService: FeedbackService,
              private angularFireStorage: AngularFireStorage,
              private toastr: ToastrService) {
    this.getFeedbackForm();
  }

  ngOnInit(): void {
    this.getFeedbackForm();
  }

  /**
   * Created by: DiepTT
   * Date created: 11/08/2022
   * Function: Get value of "rating" from Feedback Form
   * @param rating
   */
  getValue(rating: number) {
    this.value = rating;
  }

  /**
   * Created by: DiepTT
   * Date created: 11/08/2022
   * Date updated: 12-14/08/2022
   * Function: Get Feedback Form with validation for form-controls
   */
  getFeedbackForm() {
    this.feedbackFrom = new FormGroup({
      creator: new FormControl("",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30),
          Validators.pattern("^([A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẬẪÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]" +
            "[a-záàảãạăắằẳẵặâấầẩậẫéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]*( )){0,14}" +
            "([A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẬẪÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]" +
            "[a-záàảãạăắằẳẵặâấầẩậẫéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]*)$")]),
      email: new FormControl("", [Validators.email,
        Validators.minLength(5)]),
      content: new FormControl("", [Validators.required, Validators.minLength(2)]),
      rating: new FormControl(this.value),
      image: new FormControl("",
        [Validators.pattern("^.+((.jpg)|(.png)|(.jpeg)|(.heic))$")])
    })
  }

  /**
   * Created by: DiepTT
   * Date created: 11/08/2022
   * Date updated: 12-14/08/2022
   * Function: Actions when user click button "Gửi phản hồi"
   */
  save() {
    if (this.feedbackFrom.valid) {
      this.toggleLoading();
      const feedback = this.feedbackFrom.value;
      feedback.rating = this.value;
      feedback.email = feedback.email.trim();
      feedback.content = feedback.content.trim();

      if (feedback.image == null || feedback.image == "") {
        feedback.image = "";
        this.saveFeedbackToDB(feedback);
      } else {
        const imgName = this.getCurrentDateTime() + this.selectedImage.name;
        const fileRef = this.angularFireStorage.ref(imgName);
        this.angularFireStorage.upload(imgName, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              feedback.image = url;
              this.saveFeedbackToDB(feedback);
            })
          })
        ).subscribe();
      }
    } else {
      this.showToastrWarning();
    }
  }

  /**
   * Created by: DiepTT
   * Date created: 17/08/2022
   * Function: Save feedback to Database
   */
  saveFeedbackToDB(feedback: Feedback) {
    this.feedbackService.createFeedback(feedback).subscribe(
      () => {
        this.showToastrSuccess();
        this.feedbackFrom.reset();
        this.value = 0;
        //@ts-ignore
        $('#staticBackdropFeedback').modal('hide');
      }, error => {
        console.log(error.error);
        let errs = error.error;
      })
  }

  /**
   * Created by: DiepTT
   * Date created: 11/08/2022
   * Function: Get current date-time to concatenate with image name
   */
  private getCurrentDateTime(): string {
    return formatDate(new Date(), 'ddMMyyyy_hh:mm:ssa_', 'en-US');
  }

  /**
   * Created by: DiepTT
   * Date created: 11/08/2022
   * Function: Get information of uploaded image
   * @param event
   */
  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }

  /**
   * Created by: DiepTT
   * Date created: 13/08/2022
   * Function: Get information of uploaded image
   */
  toggleLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 3000)
  }

  /**
   * Created by: DiepTT
   * Date created: 13/08/2022
   * Function: Show notification when creating feedback successfully
   */
  showToastrSuccess() {
    this.toastr.success('Cảm ơn quý khách đã gửi phản hồi về cho quán!', 'Gửi thành công.');
  }

  /**
   * Created by: DiepTT
   * Date created: 13/08/2022
   * Function: Show notification when required input fields are not filled but submitting
   */
  showToastrWarning() {
    this.toastr.warning("Vui lòng nhập đầy đủ thông tin!")
  }

  /**
   * Created by: DiepTT
   * Date created: 16/08/2022
   * Function: Reset form when clicking button "Hủy"
   */
  reset() {
    this.feedbackFrom.reset();
    this.value = 0;
  }
}
