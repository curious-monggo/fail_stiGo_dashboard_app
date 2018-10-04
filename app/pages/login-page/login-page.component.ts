import { AuthService } from '../../services/auth-service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
   
  }
  facebookLogin(){
    this.authService.facebookLogin();
  }
  googleLogin(){
    this.authService.googleLogin();
  }
}
