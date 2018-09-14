import { Injectable } from '@angular/core';
import { CanActivate, Router } from '../../../../node_modules/@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable ({ providedIn: 'root' })
export class AuthService implements CanActivate {
    private isAllowed;
    constructor (private router:Router, private http:HttpClient) {
        //this.isAllowed = false;
        /*
        if(localStorage.getItem ("isAllowed") == null)
            localStorage.setItem ("isAllowed", "false");
        else
            this.isAllowed = localStorage.getItem ("isAllowed") == "true";
            */
    }
    
    canActivate ():boolean {
        console.log ("AuthService canActivate() method");

        if (!localStorage.getItem("isAllowed")) {
            console.log (" :You shall not pass!");
            this.router.navigate(['/auth']);
            return false;
        }
        
        console.log (" :You can pass!");
        return true;
    }

    login (username:string, unhashedPassword:string) {
        console.log ("AuthService login() method");
        // Encrypt
        var hashedPassword;
        var salt;
      
        hashedPassword = unhashedPassword;

        // GET Data
        var params = new HttpParams ()
            .set ('USER', username)
            .set ('PASS', hashedPassword);
        this.http.get <LoginResponse> ('http://localhost:3000/', {params}).subscribe (res => {
            console.log ('Password is ' + res.isAllowed);
            if (res.isAllowed) {
                //this.isAllowed = true;
                localStorage.setItem ("isAllowed", "true");
                localStorage.setItem ("USERNAME", username);
                this.router.navigate(['/user']);
            }
        });
    }

    signUp (username:string, unhashedPassword:string, mail:string, title:string | null, phone:string | null, gender:string | null) {
        console.log ("AuthService signUp() method");
        // Encrypt
        var hashedPassword;
        var salt;
      
        hashedPassword = unhashedPassword;

        // POST Data
        //var data = JSON.stringify ({USER: username, PASS: hashedPassword, MAIL: mail, TITLE: title, PHONE: phone, GENDER: gender});
        var params = new HttpParams ()
            .set ('USER', username)
            .set ('PASS', hashedPassword)
            .set ('MAIL', mail)
            .set ('TITLE', title)
            .set ('PHONE', phone)
            .set ('GENDER', gender);
        this.http.post ("http://localhost:3000/", null, {params}).subscribe (r => {console.log ("r: " + r)});
    }

    logout () {
        console.log ("AuthService logout() method");
        localStorage.setItem ("isAllowed", "false");
        localStorage.clear ();
        this.router.navigate(['/login']);
    }

    getIndvInfo ():any {
        console.log ("AuthService getIndvInfo() method");

        // GET Data
        var params = new HttpParams ()
            .set ('USER', "getIndvInfo");
        this.http.get <InfoResponse> ('http://localhost:3000/user', {params}).subscribe (res => {
            console.log ('Individual Info is ' + res);
            return res;
        });

        return null;
    }
}

interface LoginResponse {
    isAllowed: boolean;
}

interface InfoResponse {
    user_id: number;
    user_name: string;
    user_mail: string;
    user_title: string;
    user_phone: string;
    user_gender: string;
    user_rank: number;
}