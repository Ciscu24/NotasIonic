import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  constructor(public loadingController: LoadingController) { }

  /**
   * Funcion que ejecuta el Loading
   */
  public async cargarLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: '',
      spinner:'crescent'
    });
    await loading.present();
  }

  /**
   * Funcion que detiene el Loading
   */
  public pararLoading(){
    this.loadingController.dismiss();
  }
}
