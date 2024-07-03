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
