import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {

  @ViewChild('privacy', { static: true }) private privacy!: ElementRef<HTMLElement>;
  @ViewChild('personal', { static: true }) private personal!: ElementRef<HTMLElement>;

  private subscription: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe({
      next: (params => {
        console.log(params)
        if (params['section'] === 'privacy') {
          this.privacy.nativeElement.scrollIntoView({ behavior: 'smooth' })
        }
        if (params['section'] === 'personal') {
          this.personal.nativeElement.scrollIntoView({ behavior: 'smooth' })
        }
      })
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    console.log('unsubscribe')
  }
}
