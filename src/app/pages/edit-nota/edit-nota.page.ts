import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Nota } from 'src/app/model/nota';
import { LoadService } from 'src/app/services/load.service';
import { NotasService } from 'src/app/services/notas.service';
import { ColoresPage } from '../colores/colores.page';

@Component({
  selector: 'app-edit-nota',
  templateUrl: './edit-nota.page.html',
  styleUrls: ['./edit-nota.page.scss'],
})

export class EditNotaPage{

  @Input('nota') nota:Nota;

  public tasks:FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    private notasS:NotasService,
    private load:LoadService,
    public toastController: ToastController,
    private modalController:ModalController
  ) {
    this.tasks=this.formBuilder.group({
      title:['',Validators.required],
      description:['']
    })
  }
  
  ionViewDidEnter(){
    this.tasks.get('title').setValue(this.nota.titulo);
    this.tasks.get('description').setValue(this.nota.texto);
  }

  /**
   * Funcion que se ejecuta cuando pulsamos el boton del formulario,
   * el cual edita la nota
   */
  public async sendForm(){
    await this.load.cargarLoading();
    
    let data:Nota={
      titulo:this.tasks.get('title').value,
      texto:this.tasks.get('description').value,
      color:this.nota.color
    }
    this.notasS.actualizaNota(this.nota.id,data)
    .then((respuesta)=>{
      this.load.pararLoading();
      this.presentToast("Nota guardada","primary");
      this.modalController.dismiss();
    })
    .catch((err)=>{
      this.load.pararLoading();
      this.presentToast("Error guardando nota","danger");
      console.log(err);
    })
  }

  /**
   * Funcion que muestra un Toast
   * @param msg el mensaje del Toast
   * @param col el color del Toast
   */
  async presentToast(msg:string,col:string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "myToast",
      duration: 2000,
      position:"bottom",
      color: col
    });
    toast.present();
  }

  public backButton(){
    this.modalController.dismiss();
  }

  /**
   * Funcion que crea una pagina para seleccionar el color de la nota
   */
  public async seleccionarColor(){
    const modal = await this.modalController.create({
      component: ColoresPage,
      cssClass: 'my-custom-class',
      componentProps:{
        color:this.nota.color
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        this.nota.color = data.data;
    });
    return await modal.present();
  }

}
