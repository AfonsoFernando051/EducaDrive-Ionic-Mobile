import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

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
    IonLabel
  ]
})

export class TabsPage implements OnInit {
  role = '';
  name = '';
  email = '';
  photoURL = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'];
      this.name = params['name'];
      this.email = params['email'];
      this.photoURL = params['photoURL'];

      console.log('Dados recebidos:', this.role, this.name, this.email, this.photoURL);
    });
  }
}
