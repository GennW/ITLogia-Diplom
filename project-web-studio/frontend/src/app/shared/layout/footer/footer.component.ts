import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../components/popup/popup.component';
import { ArticleService } from '../../services/article.service';
import { DefaultResponseType } from 'src/types/default-response';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isOrder: boolean = false;
  isCallMeBack: boolean = true;
  phone: string = '';
  errorOccurred: boolean = false;


  constructor(private dialog: MatDialog, private articleService: ArticleService) { 
  

  }

  ngOnInit(): void {
  }

  // sendRequestOrder(): void {
  //   const requestData = {
  //     // name: this.name,
  //     phone: this.phone,
  //     type: 'order',
  //     // service: this.placeholder
  //   };
  
  //   this.articleService.addUserRequest(requestData)
  //     .subscribe({
  //       next: (response: DefaultResponseType) => {
  //         if (response.error) {
  //           this.errorOccurred = true;
  //         } else {
  //           this.openPopupThanks('Спасибо за вашу заявку!');
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Error sending user request:', error);
  //         this.errorOccurred = true;
  //       }
  //     });
  // }
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
