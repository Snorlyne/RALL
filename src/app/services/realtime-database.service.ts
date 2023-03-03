import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class RealtimeDatabaseService {
  constructor(private db: AngularFireDatabase) {}
  private myData = new Subject<any>();

  getData() {
    return this.db.object('Jardin').valueChanges();
  }
  leerDatos(ruta: string) {
    return this.db.object(ruta).valueChanges();
  }
  activar_riego(ruta: string, datos: any) {
    this.db.database.ref(ruta).set(datos);
  }
  activar_foco(ruta: string, datos: any) {
    this.db.database.ref(ruta).set(datos);
  }
} 

