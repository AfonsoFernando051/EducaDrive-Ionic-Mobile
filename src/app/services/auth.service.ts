import { Injectable } from '@angular/core';
import { auth } from '../../main'; // importa do main.ts
import { signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  async login(email: string, senha: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    console.log('Usuário logado:', userCredential.user);
    return userCredential.user;
  }

  async logout(): Promise<void> {
    await signOut(auth);
    console.log('Usuário deslogado');
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}
