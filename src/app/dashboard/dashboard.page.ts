import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RealtimeDatabaseService } from '../services/realtime-database.service';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  horas: number = 0;
  minutos: number = 0;
  horas2: number = 0;
  minutos2: number = 0;

  data: any;
  data2: any;
  data3: any;

  activo = false;
  riegoActivo = false;

  activo2 = false;

  riego_on_off: string = 'Apagado';
  foco_on_off: string = 'Apagado';

  constructor(
    private alertController: AlertController,
    private dataService: RealtimeDatabaseService
  ) {}

  //Alerta de riego
  async riegoAlert() {
    const alert = await this.alertController.create({
      header: '¿Estas seguro?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Si',
          cssClass: 'alert-button-confirm',
          handler: () => {
            console.log('Acción confirmada');
            // Aquí puedes llamar a la función que desees
            this.activo = true;
            this.enviarDatos();
          },
        },
      ],
    });

    await alert.present();
  }

  menuRiego() {
    if (this.data.activar_riego == false) {
      this.riegoAlert();
    } else if (this.data.activar_riego == true) {
      this.activo = false;
      this.enviarDatos();
    }
  }
  menuFoco() {
    if (this.data2.activar_foco == false) {
      this.focoAlert();
    } else if (this.data2.activar_foco == true) {
      this.activo2 = false; 
      this.enviarDatos2();
    }
  }

  enviarDatos() {
    if (this.data.activar_riego == false) {
      const ruta = '/Jardin/activar_riego';
      const datos = true;
      this.riegoActivo = true;
      this.riego_on_off = 'Encendido';
      this.dejar();
      this.dataService.activar_riego(ruta, datos);
    } else if (this.data.activar_riego == true) {
      const ruta = '/Jardin/activar_riego';
      const datos = false;
      this.dataService.activar_riego(ruta, datos);
      this.riegoActivo = false;
      this.riego_on_off = 'Apagado';
      this.regar();
    }
  }

  enviarDatos2() {
    if (this.data2.activar_foco == false) {
      const ruta = '/Jardin/activar_foco';
      const datos = true;
      this.foco_on_off = 'Encendido';
      this.dataService.activar_foco(ruta, datos);
    } else if (this.data2.activar_foco == true) {
      const ruta = '/Jardin/activar_foco';
      const datos = false;
      this.foco_on_off = 'Apagado';
      this.dataService.activar_foco(ruta, datos);
    }
  }

  //Alerta de foco
  async focoAlert() {
    const alert = await this.alertController.create({
      header: '¿Estas seguro?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Si',
          cssClass: 'alert-button-confirm',
          handler: () => {
            console.log('Acción confirmada');
            // Aquí puedes llamar a la función que desees
            this.activo2 = true;
            this.enviarDatos2();
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnInit(): void {
    this.dataService.getData().subscribe((data) => {
      this.data = data;
      console.log(this.data);
    });
    this.dataService.getData().subscribe((data2) => {
      this.data2 = data2;
      console.log(this.data2);
    });
    this.dataService.leerDatos('/Jardin/activar_riego').subscribe((data) => {
      if (data == false) {
        this.activo = false;
        this.riego_on_off = 'Apagado';
      } else if (data == true) {
        this.activo = true;
        this.riego_on_off = 'Encendido';
        this.notificacionRiego();
      }
    });
    this.dataService.leerDatos('/Jardin/activar_foco').subscribe((data) => {
      if (data == false) {
        this.activo2 = false;
        this.foco_on_off = 'Apagado';
      } else if (data == true) {
        this.activo2 = true;
        this.foco_on_off = 'Encendido';
        this.notificacionFoco();
      }
    });
    this.dataService.leerDatos('/Jardin/sensor_luz').subscribe((data3) => {
      this.data3 = data3;
    });
  }

  //cambio de color foco

  dejar() {
    this.horas = 0;
    this.minutos = 0;
  }

  //cronometro
  regar() {
    if (this.riegoActivo == false) {
      setTimeout(() => {
        this.minutos = this.minutos + 1;
        if (this.minutos == 60) {
          this.minutos = 0;
          this.horas = this.horas + 1;
        }
        this.horas2 = this.horas;
        this.minutos2 = this.minutos;
        this.regar();
      }, 60000);
    }
  }
 async notificacionFoco(){
    const alert = await this.alertController.create({
      header: 'Se ha activado la luz artificial',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Entendido',
          cssClass: 'alert-button-confirm',
        },
      ],
    });
  
    await alert.present();
  }
 async notificacionRiego(){
    const alert = await this.alertController.create({
      header: 'Se ha activado el sistema de riego',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Entendido',
          cssClass: 'alert-button-confirm',
        },
      ],
    });
  
    await alert.present();
  }
}

