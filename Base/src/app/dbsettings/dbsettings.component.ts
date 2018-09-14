import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, NgForm} from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-dbsettings',
  templateUrl: './dbsettings.component.html',
  styleUrls: ['./dbsettings.component.css']
})
export class DbSettingsComponent implements OnInit {
  
  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  changeDatabase (form:NgForm) {
    var username = form.value.username;
    var password = form.value.password;
    var connectString = form.value.host + ":" + form.value.port + "/" + form.value.sid;

    console.log ("Username: " + username);
    console.log ("Password: " + password);
    console.log ("connectString: " + connectString);

    var params = new HttpParams ()
      .set ('USER', username)
      .set ('PASS', password)
      .set ('CONN_STR', connectString);
    
    this.http.get ('http://localhost:3000/settings', {params}).subscribe (res => {
      console.log ("Change Database Response: " + res);
    });
  }

}
