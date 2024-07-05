import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupDataType } from 'src/types/popup-data.interface';
import { ArticleService } from '../../services/article.service';
import { DefaultResponseType } from 'src/types/default-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  orderTitle: string = '';
  isOrder: boolean = true;
  placeholder: string = '';
  showInputs: boolean = true;
  isCallMeBack: boolean = false;

  buttonText: string = '';
  errorOccurred: boolean = false;
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  private subscription: Subscription = new Subscription;

  // В конструкторе компонента используем MAT_DIALOG_DATA для получения данных и MatDialogRef для возможности закрытия попапа
  constructor(@Inject(MAT_DIALOG_DATA) public data: PopupDataType,
    private articleService: ArticleService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PopupComponent>) {
    this.orderTitle = data.orderTitle;
    this.placeholder = data.placeholder;
    this.isCallMeBack = data.isCallMeBack;
    this.buttonText = data.buttonText;
  }


  ngOnInit(): void {
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    console.log('unsubscribe popup.component');
  }


  // Метод для закрытия попапа
  closeDialog(): void {
    this.dialogRef.close();
  }

  sendRequestOrder(): void {
    const requestData = {
      name: this.form.get('name')?.value,
      phone: this.form.get('phone')?.value,
      type: 'order',
      service: this.placeholder
    };
    if (this.isCallMeBack) {
      requestData['type'] = 'consultation';
    } else {
      requestData['type'] = 'order';
    }

    this.subscription?.add(this.articleService.addUserRequest(requestData)
      .subscribe({
        next: (response: DefaultResponseType) => {
          if (response.error) {
            this.errorOccurred = true;
          } else {
            this.openPopupThanks('Спасибо за вашу заявку!');
          }
        },
        error: (error) => {
          console.error('Error sending user request:', error);
          this.errorOccurred = true;
        }
      }));
  }


  openPopupThanks(orderTitle: string): void {

    this.showInputs = false;
    this.isOrder = false;
    this.orderTitle = orderTitle;
  }

  // // проверка на заполненность полей
  // checkFields(): void {

  // }
  // areFieldsFilled(): boolean {
  //   return this.name.trim() !== '' && this.phone.trim() !== '';
  // }


}
