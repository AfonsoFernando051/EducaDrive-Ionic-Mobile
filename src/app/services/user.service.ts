import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfile: any = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  setUserProfile(profile: any) {
    this.userProfile = profile;
    this.storage.set('userProfile', profile);
  }

  getUserProfile(): any {
    return this.userProfile;
  }

  async loadUserProfileFromStorage() {
    const storedProfile = await this.storage.get('userProfile');
    this.userProfile = storedProfile;
    return storedProfile;
  }

  clearUserProfile() {
    this.userProfile = null;
    this.storage.remove('userProfile');
  }
}
