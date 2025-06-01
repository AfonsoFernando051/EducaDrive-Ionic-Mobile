import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userData: {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
    role: 'aluno' | 'professor';
  } | null = null;

  constructor() {}

  setUser(data: {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
    role: 'aluno' | 'professor';
  }) {
    this.userData = data;
  }

  getUser() {
    return this.userData;
  }

  clearUser() {
    this.userData = null;
  }
}

