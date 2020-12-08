import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private google:GooglePlus,
    private authS:AuthService,private router:Router) { }

  ngOnInit() {
    if(this.authS.isLogged()){
      this.router.navigate(['/'])
    }
  }

  public async login(){
    let u=await this.authS.login();
    if(u.token!=-1){
      this.router.navigate(['/'])
    }
  }

}
