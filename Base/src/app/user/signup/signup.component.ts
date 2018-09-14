import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public authService: AuthService, public userService: UserService) {}

  username;
  password;
  repassword;
  showPassErr;
  emailFormControl = new FormControl ('', [Validators.required, Validators.email, ]);
  email;
  phone;
  title;
  titles = ["A", "B", "C"];
  gender;
  genders = ["Male", "Female"];
  submitted = false;
  available;

  comparePass (event: any) {

  }

  onSubmit() { this.submitted = true; }

  signUpControl(form: NgForm) {
    console.log ("signUpControl() method!");
    
    if(form.invalid) {
      return;
    }

    this.authService.signUp (form.value.username, form.value.pass, this.emailFormControl.value, form.value.title, form.value.phone, form.value.gender);
  }


  ngOnInit() {
  }

}