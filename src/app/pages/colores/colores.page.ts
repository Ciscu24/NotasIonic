import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-colores',
  templateUrl: './colores.page.html',
  styleUrls: ['./colores.page.scss'],
})
export class ColoresPage{

  @Input('color') color:string;

  constructor(public modalController:ModalController) { }

  /**
   * Funcion que envia el color seleccionado
   * @param c el color de la nota, ejemplo -> #4B90FA
   */
  public seleccionarColor(c:string){
    this.modalController.dismiss(c);
  }

  public backButton(){
    this.modalController.dismiss(this.color);
  }

}
