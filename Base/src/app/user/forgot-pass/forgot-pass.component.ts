import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email, ]);
  constructor() { }

  ngOnInit() {
  }

  reserPass() {

  }

}
