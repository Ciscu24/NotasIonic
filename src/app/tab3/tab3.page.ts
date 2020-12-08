import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Usuario } from '../model/usuario';
import { AuthService } from '../services/auth.service';
import { LoadService } from '../services/load.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  usuario:Usuario;
  
  tamanoFuente:string = "Pequeno";
  pantallaPredeterm:string = "Notas";
  ordenacion:string = "Titulo";
  guardarAutomatico:boolean = true;

  constructor(private authS:AuthService, private router:Router, private storage: NativeStorage, private load:LoadService) {
    this.usuario = authS.user;
  }

  ngOnInit(){
    //console.log(this.usuario);
    this.cargarDatos();
  }

  public async logout(){
    await this.authS.logout();
    if(!this.authS.isLogged()){
      this.router.navigate(['/login'])
    }
  }

  /**
   * Funcion para guardar el tamaño de fuente usando el Native Storage
   */
  public async guardarTamanoFuente(){
    await this.storage.setItem("tamanoFuente", this.tamanoFuente);
    console.log(this.tamanoFuente);
  }

  /**
   * Funcion para guardar la pantalla de inicio usando el Native Storage
   */
  public async guardarPantallaPredeterm(){
    await this.storage.setItem("pantallaPredeterm", this.pantallaPredeterm);
    console.log(this.pantallaPredeterm);
  }

  /**
   * Funcion para guardar el criterio de ordenacion usando el Native Storage
   */
  public async guardarOrdenacion(){
    await this.storage.setItem("ordenacion", this.ordenacion);
    console.log(this.ordenacion);
  }

  /**
   * Funcion para guardar el guardado automatico usando el Native Storage
   */
  public async guardarGuardarAutomatico(){
    await this.storage.setItem("guardarAutomatico", this.guardarAutomatico);
    console.log(this.guardarAutomatico);
  }

  /**
   * Funcion para cargar los datos guardados del Native Storage
   */
  public async cargarDatos(){
    this.tamanoFuente = await this.storage.getItem("tamanoFuente");
    this.pantallaPredeterm = await this.storage.getItem("pantallaPredeterm");
    this.ordenacion = await this.storage.getItem("ordenacion");
    this.guardarAutomatico = await this.storage.getItem("guardarAutomatico");
  }

}
