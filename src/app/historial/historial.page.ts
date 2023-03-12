import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RealtimeDatabaseService } from '../services/realtime-database.service';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  data: any[] = [];
  fechas: any[] = [];


  constructor(private dataService: RealtimeDatabaseService) {}

  ngOnInit() {
    this.dataService.leerDatos2().subscribe((data) => {
      this.fechas = data.reverse();
    });

  }
  
}
