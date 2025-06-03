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
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../main';
import { UserService } from '../../services/user.service';

interface UserProfile {
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
      const user = await this.authService.login(this.email, this.senha);
      console.log('Usuário autenticado:', user);

      const profile = await this.getUserProfileByUid(user.uid);
      if (profile) {
        await this.userService.setUserProfile(profile);
       this.router.navigate(['/tabs/agenda'], {
       
});

      } else {
        alert('Perfil não encontrado no banco.');
      }
    } catch (error: any) {
      alert('Erro ao fazer login: ' + error.message);
    }
  }

  async getUserProfileByUid(uid: string): Promise<UserProfile | null> {
  const q = query(collection(db, 'user'), where('userID', '==', uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const rawData = doc.data();
    const data: UserProfile = {
      name: rawData['nome'],
      email: rawData['email'],
      role: rawData['papel'],
      photoURL: rawData['imagem']
    };
    console.log('Perfil do usuário:', data);
    return data;
  } else {
    console.error('Perfil não encontrado no Firestore');
    return null;
  }
}
}
