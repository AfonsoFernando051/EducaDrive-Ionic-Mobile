import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { query, collection, where, getDocs } from 'firebase/firestore';

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
import { db } from '../../../main';
import { UserService } from '../../services/user.service';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'aluno' | 'professor';
  photoURL: string;
}

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  async onLogin() {
    try {
      const userCredential = await this.authService.login(this.email, this.senha);
      const user = userCredential; // Firebase User

      const profile = await this.getUserProfileByUid(user.uid);
      if (profile) {
        // ✅ salva perfil com uid
        await this.userService.setUserProfile({
          ...profile,
          uid: user.uid
        });

        this.router.navigate(['/tabs/agenda']);
      } else {
        alert('Perfil não encontrado no banco.');
      }
    } catch (error: any) {
      alert('Erro ao fazer login: ' + error.message);
    }
  }

  async getUserProfileByUid(uid: string): Promise<Omit<UserProfile, 'uid'> | null> {
    const q = query(collection(db, 'user'), where('userID', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const rawData = doc.data();

      return {
        name: rawData['nome'],
        email: rawData['email'],
        role: rawData['papel'],
        photoURL: rawData['imagem']
      };
    } else {
      console.error('Perfil não encontrado no Firestore');
      return null;
    }
  }
}
