import { Component } from '@angular/core';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { EditNotaPage } from '../pages/edit-nota/edit-nota.page';
import { NotasService } from '../services/notas.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadService } from '../services/load.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

  public listaNotas = [];
  public listaNotasBusqueda = [];

  constructor(private notasS: NotasService,
    private modalController:ModalController,
    private load:LoadService,
    public alertController: AlertController) { }


  ionViewWillEnter(){
    this.cargaDatos();
    this.notasS.cargarMyCollection();
  }

  initializeItems(){
    this.listaNotasBusqueda = this.listaNotas;
  }

  getItems(ev:any){
    this.initializeItems();
    let val = ev.target.value;

    if(val && val.trim() != ""){
      this.listaNotasBusqueda = this.listaNotasBusqueda.filter((item)=>{
        return (item.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  public async cargaDatos($event=null){
    try {
      await this.load.cargarLoading();
      this.notasS.leeNotas()
        .subscribe((info:firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
          //Ya ha llegado del servidor
          this.listaNotas=[];
          info.forEach((doc)=>{
            let nota={
              id:doc.id,
              ...doc.data()
            }
            this.listaNotas.push(nota);
          });
          this.load.pararLoading();
          this.listaNotasBusqueda = this.listaNotas;
          console.log(this.listaNotas);
          if($event){
            $event.target.complete();
          }
        })
    } catch (err) {
      console.log(err);
      this.load.pararLoading();
    }
  }

  public async borraNota(id:any){
    await this.load.cargarLoading();
    this.notasS.borraNota(id)
    .then(()=>{
      let tmp=[];
      this.listaNotasBusqueda.forEach((nota)=>{
        if(nota.id!=id){
         tmp.push(nota);
        }
      })
      this.listaNotasBusqueda=tmp;
      this.load.pararLoading();
    })
    .catch(err=>{
      console.log(err);
      this.load.pararLoading();
    })
  }
  
  public async editaNota(nota:Nota){
    const modal = await this.modalController.create({
      component: EditNotaPage,
      cssClass: 'my-custom-class',
      componentProps:{
        nota:nota
      }
    });
    modal.present();

    return modal.onDidDismiss()
    .then(()=>{
      this.cargaDatos();
    });
  }

  /**
   * Funcion que nos muestra una alerta cuando intentamos borrar una nota
   * @param id El id de la nota que deseamos borrar
   */
  async alertBorrarNota(id:any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Borrar Nota',
      message: 'Esta usted seguro de <strong>borrar la nota</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Confirmar',
          handler: () => {
            this.borraNota(id);
          }
        }
      ]
    });

    await alert.present();
  }

}
