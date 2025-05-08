import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonInput,
  IonText,
  IonButton,
  IonCard,
  IonCardContent,
  IonFooter
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonText,
    IonButton,
    IonCard,
    IonCardContent,
    IonFooter
  ]
})
export class LoginPage implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {}

  onLogin(tipo: 'aluno' | 'professor') {
    this.router.navigate(['/tabs'], {
      queryParams: { role: tipo }
    });
  }
}




