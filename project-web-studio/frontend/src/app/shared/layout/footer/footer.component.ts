import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../components/popup/popup.component';
import { ArticleService } from '../../services/article.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  isOrder: boolean = false;
  isCallMeBack: boolean = true;
  phone: string = '';
  errorOccurred: boolean = false;
  private subscription: Subscription | null = null;


  constructor(private dialog: MatDialog, private articleService: ArticleService) {


  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    console.log('unsubscribe footer dialog')
  }


  openPopupOrder(orderTitle: string, buttonText: string): void {
    this.isCallMeBack = true;
    this.isOrder = true;

    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        orderTitle: orderTitle,
        isCallMeBack: this.isCallMeBack,
        buttonText: buttonText
      }
    });
    this.subscription = dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
    });
  }
}
