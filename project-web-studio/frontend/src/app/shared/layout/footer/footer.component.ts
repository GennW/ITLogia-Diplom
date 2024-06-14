import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../components/popup/popup.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isOrder: boolean = false;
  isCallMeBack: boolean = true;

  constructor(private dialog: MatDialog, ) { 
  

  }

  ngOnInit(): void {
  }


  openPopupOrder(orderTitle: string,buttonText: string): void {
    this.isCallMeBack = true;
    this.isOrder = true;

    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        orderTitle: orderTitle,
        isCallMeBack: this.isCallMeBack,
        buttonText: buttonText
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
    });
  }
}
