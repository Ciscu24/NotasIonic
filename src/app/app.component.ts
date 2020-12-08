import { Component } from '@angular/core';

import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  darkMode:any = "light";
  darkModeBoolean:boolean = false;
  linterna:boolean = false;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authS:AuthService,
    private menu: MenuController,
    private nativeStorage: NativeStorage,
    private flashlight: Flashlight,
    public toastController: ToastController,
    private geolocation:Geolocation
  ) {
    this.initializeApp();
    this.cargarDarkMode();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authS.init();
    });
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  /**
   * Funcion para cambiar el tema de la aplicacion, ademas de guardarse en el Native Storage
   * @param event Evento para saber si se cambia el boton
   */
  async toggleTheme(event){
    if(event.detail.checked){
      this.darkMode = "dark";
      this.darkModeBoolean = true;
      document.body.setAttribute("color-theme", this.darkMode);
      await this.nativeStorage.setItem("darkMode", this.darkMode);
      await this.nativeStorage.setItem("darkModeBoolean", this.darkModeBoolean);
      console.log(this.darkMode);
    }else{
      this.darkMode = "light";
      this.darkModeBoolean = false;
      document.body.setAttribute("color-theme", this.darkMode);
      await this.nativeStorage.setItem("darkMode", this.darkMode);
      await this.nativeStorage.setItem("darkModeBoolean", this.darkModeBoolean);
      console.log(this.darkMode);
    }
  }

  /**
   * Carga el tema de la aplicacion a traves del Native Storage
   */
  public async cargarDarkMode(){
    this.darkMode = await this.nativeStorage.getItem("darkMode");
    this.darkModeBoolean = await this.nativeStorage.getItem("darkModeBoolean");
    document.body.setAttribute("color-theme", this.darkMode);
  }

  /**
   * Funcion que enciende o apaga la linterna del movil usando el plugin Flashlight de Ionic
   * @param event Evento para saber si se cambia el boton
   */
  public usarLinterna(event){
    if(event.detail.checked){
      this.flashlight.switchOn();
      this.linterna = true;
      console.log(this.linterna);
    }else{
      this.flashlight.switchOff();
      this.linterna = false;
      console.log(this.linterna);
    }
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

  /**
   * Funcion que muestra tu geolocalizacion usando el plugin de Geolocation de Ionic
   */
  public getGeolocation(){
    this.geolocation.getCurrentPosition()
    .then((geoposition:Geoposition)=>{
      let lat:number = geoposition.coords.latitude;
      let lon:number = geoposition.coords.longitude;
      this.presentToast("Latitud: "+lat+", Longitud: "+lon, "primary");
    })
  }

}
