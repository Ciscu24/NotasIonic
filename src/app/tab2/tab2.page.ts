import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { ColoresPage } from '../pages/colores/colores.page';
import { LoadService } from '../services/load.service';
import { NotasService } from '../services/notas.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public tasks:FormGroup;
  public color:string = "";

  constructor(
    private formBuilder:FormBuilder,
    private notasS:NotasService,
    private load:LoadService,
    public toastS:ToastService,
    public modalController: ModalController
  ) {
    this.tasks=this.formBuilder.group({
      title:['',Validators.required],
      description:['']
    })
  }

  /**
   * Funcion que se ejecuta cuando pulsamos el boton del formulario,
   * el cual guarda la nota
   */
  public async sendForm(){
    await this.load.cargarLoading();
    
    let data:Nota={
      titulo:this.tasks.get('title').value,
      texto:this.tasks.get('description').value,
      color:this.color
    }
    this.notasS.agregaNota(data)
    .then((respuesta)=>{
      this.tasks.setValue({
        title:'',
        description:'',
      })
      this.color = "";
      this.load.pararLoading();
      this.toastS.presentToast("Nota guardada", "myToast", 2000, "primary");
    })
    .catch((err)=>{
      this.load.pararLoading();
      this.toastS.presentToast("Error al guardar la nota", "myToast", 2000, "danger");
      console.log(err);
    })
  }

  /**
   * Funcion que crea una pagina para seleccionar el color de la nota
   */
  public async seleccionarColor(){
    const modal = await this.modalController.create({
      component: ColoresPage,
      cssClass: 'my-custom-class',
      componentProps:{
        color:this.color
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        this.color = data.data;
    });
    return await modal.present();
  }

}
