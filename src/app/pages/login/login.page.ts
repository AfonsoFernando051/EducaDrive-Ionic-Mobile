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

import { AuthService } from '../../services/auth.service';

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
  email = '';
  senha = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  async onLogin(tipo: 'aluno' | 'professor') {
    try {
      const user = await this.authService.login(this.email, this.senha);
      console.log('Usuário autenticado:', user);
      // Redireciona após login bem-sucedido
      this.router.navigate(['/tabs'], {
        queryParams: { role: tipo }
      });
    } catch (error: any) {
      alert('Erro ao fazer login: ' + error.message);
    }
  }
}
