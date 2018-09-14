import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './../user/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, NgForm } from './../../../node_modules/@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  data: [any];
  tables: [any];
  columns: [any];
  finded: [any];
  newColumns: [any];
  findedFeatures: [any];
  isLocked: [number];
  empty: string;
  user_name: string;
  tableNameFeatures: string;
  user_rank: number;
  menuSelect: number;
  dataFormControl: FormControl;
  checked= false;
  
  private types = ["NUMBER", "VARCHAR2", "DATE","CLOB","CHAR"];
  private features = ["NAME", "TYPE", "SIZE (byte)", "NOT NULL", "Primary Key"];

  dataSource = new MatTableDataSource<Array<any>> (this.data);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private authService:AuthService, private http:HttpClient) {
    this.dataFormControl = new FormControl();
    

    // Build Environment
    console.log ("[LOCAL] TABLE_NAME: " + localStorage.getItem ("TABLE_NAME"));
  }
  
  ngOnInit() {
    
    
    this.dataSource.paginator = this.paginator;
    this.finded = [[]];
    this.newColumns = [""];
    this.findedFeatures = [[]];
    this.isLocked = [0];
    this.empty = "";
    this.user_name = "";
    this.user_rank = 0;
    this.menuSelect = 0;
    

    this.test ();
    this.getTables ();
  }

  test () {
    this.getColumns ();

    console.log ("UserPanel test() method");

    var params = new HttpParams ()
      .set ("USER", localStorage.getItem ("USERNAME"));
    this.http.get <Response> ("http://localhost:3000/user", {params}).subscribe (res => {
      this.data = res.rows;
      this.dataSource = new MatTableDataSource<Array<string>> (this.data);
      this.dataSource.paginator = this.paginator;
      this.user_name = res.rows [0][1];
      this.user_rank = res.rows [0][6];
      console.log(res.rows[0][1]);
      console.log(res.rows[0][6]);
    });
  }

  applyFilter (value:string) {
    this.dataSource.filter = value.trim ().toLowerCase ();
  }

  getData () {
    console.log ("UserPanel getData() method");

    console.log ("Selected table is " + this.dataFormControl.value);
    localStorage.setItem ("TABLE_NAME", this.dataFormControl.value);
    this.getColumns ();

    // Set Parameters
    var params = new HttpParams ()
      .set ("COUNT", "");
    
    // Send Method
    this.http.get <Response> ("http://localhost:3000/user", {params}).subscribe (res => {
      this.data = res.rows;
      this.dataSource = new MatTableDataSource<Array<string>> (this.data);
      this.dataSource.paginator = this.paginator;
    });
  }
  
  getTables () {
    console.log ("UserPanel getTables() method");
    console.log(this.user_rank);
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

    var schema = "TT_STAJYER";
    //console.log(this.findedFeatures[0]);
    //console.log(this.findedFeatures[1][1]);
    var params = new HttpParams ()
      .set("SCHEMA",schema)
      .set ("TABLE_NAME", TABLE_NAME)
      .set ("CLMNS", JSON.stringify(this.newColumns))
      .set ("SET", JSON.stringify(this.findedFeatures));
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

    this.findedFeatures [this.newColumns.length - 1] = [,,false,false];
    //this.newColumns [this.newColumns.length||0] = value;
  }

  getTableFeatures (form:NgForm, TABLE_NAME:string) {
    console.log ("UserPanel getTableFeatures() method");

    this.tableNameFeatures = TABLE_NAME;

    for (var i = 0; i < 5; i++) {
      this.newColumns [i] = "column #" + i;
    }
  
    for (var i = 0; i < 5; i++) {
      this.findedFeatures [i] = [this.types[i%3], (i + 1), (i%2 == 0)?true:false, (i%2 != 0)?true:false];
    }
  }

  saveTable (form:NgForm) {
    console.log ("UserPanel saveTable() method");

    for (var i in form.value) {
      console.log (" :" + i + " = " + form.value [i]);
    }

    var sqlCommand = "ALTER TABLE " + this.tableNameFeatures + " (";

    for (var k = 0; k < this.newColumns.length; k++) {
      sqlCommand += "MODIFY " + this.newColumns [k] + " ";

      //
      sqlCommand += form.value ["type" + k] + "(" + form.value ["size" + k] + ")";
      sqlCommand += (form.value ["notNull" + k])?" NOT NULL":"";
      //
      
      if (k < this.newColumns.length - 1) {
        sqlCommand += ", ";
      }
    }

    sqlCommand += ");";

    console.log ("SQL: " + sqlCommand);
  }

  deleteColumn (index:number) {
    console.log ("UserPanel deleteColumn() method");

    for (var i = 0; i < this.newColumns.length; i++) {
      if (i >= index) {
        this.newColumns [i] = this.newColumns [i + 1];
        this.findedFeatures [i] = this.findedFeatures [i + 1];
      }
    }

    this.findedFeatures.pop ();
    this.newColumns.pop ();

    console.log (this.findedFeatures);
  }

  changeMenu (select:number) {
    this.menuSelect = select;
  }
}

interface Response {
  rows: [any];
}
