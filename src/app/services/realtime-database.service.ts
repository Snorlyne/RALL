import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeDatabaseService {
  constructor(private db: AngularFireDatabase) {}


  getData() {
    return this.db.object('Jardin').valueChanges();
  }
  leerDatos(ruta: string) {
    return this.db.object(ruta).valueChanges();
  }
  leerDatos2() {
    return this.db.list('Jardin/historial', ref => ref.orderByChild('dia')).valueChanges();
    
  }
  activar_riego(ruta: string, datos: any) {
    this.db.database.ref(ruta).set(datos);
  }
  enviar_hora(ruta: string, datos: any) {
    this.db.database.ref(ruta).set(datos);
  }
}
