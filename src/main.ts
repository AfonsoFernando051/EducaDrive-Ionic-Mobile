import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';
import { IonicStorageModule } from '@ionic/storage-angular';

// ✅ AngularFire: forma correta de inicializar com injeção
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideAuth } from '@angular/fire/auth';

// 🔁 Inicialização de app, auth e db para exportação — MAS só uma vez
const firebaseApp: FirebaseApp = initializeApp(environment.firebaseConfig);
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // ✅ Fornece os serviços AngularFire baseados nas MESMAS instâncias exportadas
    provideFirebaseApp(() => firebaseApp),
    provideAuth(() => auth),
    provideFirestore(() => db),

    ...(IonicStorageModule.forRoot().providers || [])
  ],
});
