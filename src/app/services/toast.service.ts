import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  /**
   * Funcion que muestra un toast
   * @param msg Mensaje del toast
   * @param css CSS aplicable al toast
   * @param time tiempo activado el toast
   * @param col color del toast
   */
  async presentToast(msg:string, css:string, time:number, col:string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: css,
      duration: time,
      position: "bottom",
      color: col
    });
    toast.present();
  }
}
