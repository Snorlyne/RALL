import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';  
import { RealtimeDatabaseService } from '../services/realtime-database.service';
import { PickerController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import type { ToastOptions } from '@ionic/angular';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  data: any;
  data2: any;
  data3: any;
  data4: any;

  data5: any[] = [];
  fechas: any[] = [];

  data6: any;

  activo = false;
  riegoActivo = false;

  activo2 = false;

  riego_on_off: string = 'Apagado';

  rutaImg: string = './assets/images/Sun.png';

  imgSoleado = './assets/images/Sun.png';
  imgLluvia = './assets/images/llovizna.png';
  clima_sol_lluvia: string = 'Despejado';
  llovido = false;
  activar_tras_llovido: any;
  selectedTime: any;

  constructor(
    private alertController: AlertController,
    private dataService: RealtimeDatabaseService,
    private pickerCtrl: PickerController,
    private toastController: ToastController
  ) {}

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);

    await toast.present();
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
    //comparación e insertación de la imagen dinamica
    this.dataService.leerDatos('/Jardin/lluvia').subscribe((data) => {
      this.data3 = data;
      if (this.data3 <= 40) {
        this.rutaImg = this.imgSoleado;
        this.clima_sol_lluvia = 'Despejado';
        if (this.activar_tras_llovido == true) {
          this.llovido = false;
  
        }
      } else if (this.data3 > 40) {
        this.rutaImg = this.imgLluvia;
        this.clima_sol_lluvia = 'Está lloviendo!';
        this.llovido = true;
        this.activar_tras_llovido = true;
        this.riegoActivo = false;
        this.riego_on_off = 'Apagado';

      }
    });
    this.dataService.leerDatos('/Jardin/regado').subscribe((data4) => {
      this.selectedTime = data4;
    });
    this.dataService.leerDatos3().subscribe((data5) => {
      this.fechas = data5.reverse();
    });
    this.dataService.leerDatos('/Jardin/activar_tras_lluvia').subscribe((data6) => {
      this.activar_tras_llovido = data6;
    });
  }

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
            this.activo = true;
            this.enviarDatos();
          },
        },
      ],
    });

    await alert.present();
  }

  menuRiego() {
    if (this.activar_tras_llovido == false) {
      if (this.data.activar_riego == false) {
        this.riegoAlert();
      } else if (this.data.activar_riego == true) {
        this.activo = false;
        this.enviarDatos();
      }
    } else if (this.activar_tras_llovido == true && this.data3 > 40) {
      this.notificacionLluvia();
    } else if (this.activar_tras_llovido == true && this.data3 <= 40) {
      this.notificacionLluvia2();
    }
  }

  enviarDatos() {
    if (this.data.activar_riego == false) {
      const ruta = '/Jardin/activar_riego';
      const datos = true;
      this.riegoActivo = true;
      this.riego_on_off = 'Encendido';
      this.dataService.activar_riego(ruta, datos);
    } else if (this.data.activar_riego == true) {
      const ruta = '/Jardin/activar_riego';
      const datos = false; 
      this.dataService.activar_riego(ruta, datos);
    }
  }

  //Alerta de foco

 


  async notificacionRiego() {
    const alert = await this.alertController.create({
      header: 'Activado',
      message: 'Se ha activado el sistema de riego',
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

  async notificacionLluvia() {
    const alert = await this.alertController.create({
      header: 'Cuidado!',
      subHeader: 'Se ha detectado lluvia',
      message: 'El dispositivo de riego no se puede encender',
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
  async notificacionLluvia2() {
    const alert = await this.alertController.create({
      header: 'Cuidado!',
      message:
        'Debido a que se ha detectado lluvia, recomendamos no activar el sistema de riego durante las proximas 8hrs',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Continuar',
          cssClass: 'alert-button-cancel',
          handler: () => {
            this.activar_tras_llovido = false;
            this.enviarDatos();
          },
        },
        {
          text: 'Entendido',
          cssClass: 'alert-button-confirm',
        },
      ],
    });

    await alert.present();
  }
  async showTimePickerAlert() {
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'hours',
          options: this.generateHours(),
        },
        {
          name: 'minutes',
          options: this.generateMinutes(),
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            this.selectedTime = data.hours.text + ':' + data.minutes.text;
            const ruta = '/Jardin/regado';
            const datos = this.selectedTime;
            this.dataService.enviar_hora(ruta, datos);
            this.AlertaHora();
          },
        },
      ],
    });

    await picker.present();
  }

  generateHours() {
    let hours = [];
    for (let i = 0; i < 24; i++) {
      let hour = i < 10 ? '0' + i : i;
      hours.push({ text: hour.toString(), value: hour });
    }
    return hours;
  }

  generateMinutes() {
    let minutes = [];
    for (let i = 0; i < 60; i++) {
      let minute = i < 10 ? '0' + i : i;
      minutes.push({ text: minute.toString(), value: minute });
    }
    return minutes;
  }

  async riegoProgramado() {
    const alert = await this.alertController.create({
      header: 'Riego programado',
      message: `La hora seleccionada es: ${this.selectedTime}`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cerrar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Establecer',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.showTimePickerAlert();
          },
        },
      ],
    });

    await alert.present();
  }
  async AlertaHora() {
    await this.presentToast({
      duration: 3000,
      message: `Se ha establecido la hora a las: ${this.selectedTime}`,
      buttons: [
        {
          text: 'Cambiar',
          handler: () => {
            this.showTimePickerAlert();
          },
        },
      ],
    });
  }
}
