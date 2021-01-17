import { Component } from '@angular/core';

import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { TranslateService } from '@ngx-translate/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  darkMode:any = "light";
  darkModeBoolean:boolean = false;
  linterna:boolean = false;
  idioma:string = "es";
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authS:AuthService,
    private menu: MenuController,
    private nativeStorage: NativeStorage,
    private flashlight: Flashlight,
    private geolocation:Geolocation,
    private translateService: TranslateService,
    private qrScanner: QRScanner,
    private toastS:ToastService
  ) {
    this.initializeApp();
    this.cargarDarkMode();
    this.cargarIdioma();

    //Idioma
    this.translateService.setDefaultLang('es');
    this.translateService.use('es');
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
   * Funcion que muestra tu geolocalizacion usando el plugin de Geolocation de Ionic
   */
  public getGeolocation(){
    this.geolocation.getCurrentPosition()
    .then((geoposition:Geoposition)=>{
      let lat:number = geoposition.coords.latitude;
      let lon:number = geoposition.coords.longitude;
      this.toastS.presentToast("Latitud: "+lat+", Longitud: "+lon, "myToast", 2000, "primary");
    })
  }

  /**
   * Funcion que cambia el idioma y lo guarda en Native Storage
   */
  public async cambiarIdioma(){
    await this.nativeStorage.setItem("idioma", this.idioma);
    console.log(this.idioma);
    if(this.idioma=="es"){
      this.translateService.use("es");
    }else{
      this.translateService.use("en");
    }
  }

  /**
   * Carga el idioma de la aplicacion a traves del Native Storage
   */
  public async cargarIdioma(){
    this.idioma = await this.nativeStorage.getItem("idioma");
    this.translateService.use(this.idioma);
  }

  public cargarQR(){
    // Opcionalmente solicitamos los permisos antes de hacer nada
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // Los permisos están concedidos
        // Comenzamos a escanear
        this.qrScanner.show();
        window.document.querySelector('ion-app').classList.add('cameraView');
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.toastS.presentToast(text, "myToast", 2000, "primary");
          this.qrScanner.hide(); // Ocultamos el preview
          scanSub.unsubscribe(); // Dejamos de Scannear
          window.document.querySelector('ion-app').classList.remove('cameraView');
        })
      } else if (status.denied) {
        // Los permisos de la cámara están denegados permanentemente
        // Para poder volver a usar la cámara, el usaurio tendrá que abrir los ajustes de persmisos
        // Y dar permisos desde allí con la función "openSettings"
        this.toastS.presentToast("Permisos denegados", "myToast", 2000, "primary");
      } else {
        // Los permisos han sido denegados, pero no permanentemente. Si los solicitas otra vez volverá a aparecer la solicitud.
        this.toastS.presentToast("Permisos denegados", "myToast", 2000, "primary");
      }
    })
    .catch((e: any) => {
      console.log('Error is', e);
      this.toastS.presentToast("Error is" + e, "myToast", 2000, "primary");
    })
  }

}
