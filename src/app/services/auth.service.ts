import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate {

  public user:Usuario = {
    token: -1,
    name: '',
    avatar: '',
    email: ''
  }

  constructor(private storage: NativeStorage,
    private google: GooglePlus,
    private router:Router) {
  }

  async init() {
    let u = null;
    try {
      u = await this.storage.getItem("user");
    } catch (err) {
      u = null;
    }
    if (u != null) {
      this.user = u;
    }
  }

  public isLogged(): boolean {
    if (this.user.token == -1) {
      return false;
    } else {
      return true;
    }
  }

  public async logout(){
    let u = this.google.logout();
    this.user = {
      token: -1,
      name: '',
      avatar: '',
      email: ''
    }
    await this.storage.setItem("user",this.user);
  }

  public async login() {
    try {
      let u = await this.google.login({})
      console.log(u)
      if (u) {
        this.user = {
          token: u['accessToken'],
          name: u['displayName'],
          avatar: u['imageUrl'],
          email: u['email']
        }
        console.log(this.user);
      }
    } catch (err) {
      this.user = {
        token: -1,
        name: '',
        avatar: '',
        email: ''
      }
    }
    await this.storage.setItem("user",this.user);
    return this.user;
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.isLogged()) {
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }
}
