import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// Определяем интерфейс для данных, которые будут передаваться в попап
interface PopupData {
  orderTitle: string;
  isOrder: boolean;
  placeholder: string;
  showInputs: boolean;
}

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
  // areFieldsFilled: boolean = false;
  name: string = '';
  phone: string = '';

  

  // В конструкторе компонента используем MAT_DIALOG_DATA для получения данных и MatDialogRef для возможности закрытия попапа
  constructor(@Inject(MAT_DIALOG_DATA) public data: PopupData, 
  public dialogRef: MatDialogRef<PopupComponent>, private dialog: MatDialog) {
    this.orderTitle = data.orderTitle;
    this.placeholder = data.placeholder;
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
  this.showInputs = false;
  
}

 // проверка на заполненность полей
checkFields(): void {
 
}
areFieldsFilled(): boolean {
  return this.name.trim() !== '' && this.phone.trim() !== '';
}

  
}
