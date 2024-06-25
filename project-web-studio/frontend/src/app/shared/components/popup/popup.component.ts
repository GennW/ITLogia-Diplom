import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupDataType } from 'src/types/popup-data.interface';


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
  name: string = '';
  phone: string = '';
  buttonText: string = '';

  
  // В конструкторе компонента используем MAT_DIALOG_DATA для получения данных и MatDialogRef для возможности закрытия попапа
  constructor(@Inject(MAT_DIALOG_DATA) public data: PopupDataType, 
  public dialogRef: MatDialogRef<PopupComponent>) {
    this.orderTitle = data.orderTitle;
    this.placeholder = data.placeholder;
    this.isCallMeBack = data.isCallMeBack;
    this.buttonText = data.buttonText;
    this.phone = data.phone;
   }
   

  ngOnInit(): void {
  }

  // Метод для закрытия попапа
  closeDialog(): void {
    this.dialogRef.close();
  }


openPopupThanks(orderTitle: string): void {

  this.showInputs = false;
  this.isOrder = false;
  this.orderTitle = orderTitle; 
}

 // проверка на заполненность полей
checkFields(): void {
 
}
areFieldsFilled(): boolean {
  return this.name.trim() !== '' && this.phone.trim() !== '';
}

  
}
