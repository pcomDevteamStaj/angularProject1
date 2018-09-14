import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, NgForm } from '../../../../node_modules/@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {
  data: [any];
  tables: [any];
  columns: [any];
  finded: [any];
  newColumns: [any];
  empty: string;
  user_rank: number;
  menuSelect: number;
  dataFormControl: FormControl;
  
  private types = ["NUMBER", "VARCHAR2", "DATE","CLOB","CHAR"];

  dataSource = new MatTableDataSource<Array<any>> (this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private authService:AuthService, private http:HttpClient) {
    this.dataFormControl = new FormControl();
    this.getTables ();

    //this.test ();

    // Build Environment
    console.log ("[LOCAL] TABLE_NAME: " + localStorage.getItem ("TABLE_NAME"));
  }
  
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.finded = [[]];
    this.newColumns = [""];
    this.empty = "";
    this.user_rank = 0;
    this.menuSelect = 3;
  }

  test (form:NgForm) {
    this.getColumns ();

    console.log ("UserPanel test() method");

    /*var params = new HttpParams ()
      .set ("USER", localStorage.getItem ("USERNAME"));
    this.http.get <Response> ("http://localhost:3000/user", {params}).subscribe (res => {
      this.data = res.rows;
      this.dataSource = new MatTableDataSource<Array<string>> (this.data);
      this.dataSource.paginator = this.paginator;
      this.user_rank = res.rows [0][6];
    });*/

    console.log(form.value.size);
    console.log(form.value.notnull);
    console.log(form.value.kind);

  }

  applyFilter (value:string) {
    this.dataSource.filter = value.trim ().toLowerCase ();
  }

  getData (count:number | null) {
    console.log ("Selected table is " + this.dataFormControl.value);
    localStorage.setItem ("TABLE_NAME", this.dataFormControl.value);
    this.getColumns ();

    console.log ("UserPanel getData() method");

    // Set Parameters
    var params = new HttpParams ()
      .set ("COUNT", count + "");
    
    // Send Method
    this.http.get <Response> ("http://localhost:3000/user", {params}).subscribe (res => {
      this.data = res.rows;
      this.dataSource = new MatTableDataSource<Array<string>> (this.data);
      this.dataSource.paginator = this.paginator;
    });
  }
  
  getTables () {
    console.log ("UserPanel getTables() method");
    
    this.http.get <Response> ("http://localhost:3000/database").subscribe (res => {
      this.tables = res.rows;

      if (!localStorage.getItem ("TABLE_NAME")) {
        localStorage.setItem ("TABLE_NAME", this.tables [0]);
      }

      this.dataFormControl.setValue (localStorage.getItem ("TABLE_NAME"));
    });
  }
  
  getColumns () {
    console.log ("UserPanel getColumns() method");
    
    var params = new HttpParams ()
    .set ("TABLE_NAME", localStorage.getItem ("TABLE_NAME"));
    
    this.http.get <Response> ("http://localhost:3000/database", {params}).subscribe (res => {
      this.columns = res.rows;
    });
  }

  searchData (keyword:any, clmn:string) {
    console.log ("UserPanel search() method");
    console.log ("keyword: " + keyword);
    console.log ("clmn: " + clmn);

    var params = new HttpParams ()
      .set ("KEYWORD", keyword)
      .set ("CLMN", clmn);
    this.http.get <Response> ("http://localhost:3000/data", {params}).subscribe (res => {
      this.finded = res.rows;
    });
  }

  updateData (form:NgForm) {
    console.log ("UserPanel updateData() method");
    console.log (" :[" + form.value.USER_ID + ", " + form.value.USER_NAME + "]");

    var clmns = JSON.stringify (this.columns);
    var data = JSON.stringify (form.value);

    var params = new HttpParams ()
      .set ("ID", form.value.USER_ID)
      .set ("CLMN", clmns)
      .set ("DATA", data);
    this.http.post <Response> ("http://localhost:3000/data", null, {params}).subscribe (res => {
      console.log ("updateData: " + res);
    });
  }

  deleteData () {
    console.log ("UserPanel deleteData() method");
    console.log ("[" + this.finded [0] + "] " + this.finded [1]);

    var params = new HttpParams ()
      .set ("ID", this.finded [0]);
    this.http.post <Response> ("http://localhost:3000/data", {params}).subscribe (res => {
      console.log ("deleteData: " + res);
    });
  }

  insertData () {
    //backend
  }

  createTable (form:NgForm, TABLE_NAME:string) {
    console.log ("UserPanel createTable() method");

    /*var clmnNames= [];
    var types=  [];
    var sizes = [];
    var nn = [];
    var pk = [];
    */

    var params = new HttpParams ()
      .set ("TABLE_NAME", TABLE_NAME)
      .set ("CLMNS", JSON.stringify(this.newColumns));
      //.set ("SET", "");
    this.http.post <Response> ("http://localhost:3000/table", {params}).subscribe (res => {
      console.log ("createTable: " + res);
    });
  }

  addNewClmn (value:string) {
    console.log ("UserPanel addNewClmn() method");
    console.log ("value: " + value);

    if (this.newColumns [0] == "") {
      this.newColumns [0] = value;
    } else {
      this.newColumns [this.newColumns.length] = value;
    }

    //this.newColumns [this.newColumns.length||0] = value;
  }

  changeMenu (select:number) {
    this.menuSelect = select;
  }
}

interface Response {
  rows: [any];
}