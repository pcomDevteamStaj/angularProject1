export class Singleton {
    private static _instance:Singleton = new Singleton ();

    private _login:boolean = false;
    private _cookie:string = "singleton-default-cookie";
    private _username:string = "singleton-default-username";

    constructor () {
        if (Singleton._instance) {
            throw new Error ("Error: USE getInstance() method");
        }

        Singleton._instance = this;
    }

    public static getInstance():Singleton {
        return Singleton._instance;
    }

    public setLogin (value:boolean):void {
        this._login = value;
    }

    public setUsername (value:string):void {
        this._username = value;
    }

    public test () {
        console.log ("--- Singleton Table ---");
        console.log ("Login: " + this._login + "\nCookie: " + this._cookie + "\nUsername: " + this._username);
        console.log ("-----------------------");
    }
}