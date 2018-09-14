import { Component, OnInit } from '@angular/core';
import { NgForm } from '../../../../node_modules/@angular/forms';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public authService: AuthService) {

  }

  ngOnInit() {
  }

  loginControl(form: NgForm) {
    console.log ("loginControl() method!");
    
    if(form.invalid) {
      return;
    }

    this.authService.login (form.value.username, form.value.password);
  }
}
