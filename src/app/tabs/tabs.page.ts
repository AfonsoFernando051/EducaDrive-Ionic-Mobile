import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // necessário para routerLink e router-outlet
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon
  ]
})
export class TabsPage {}
