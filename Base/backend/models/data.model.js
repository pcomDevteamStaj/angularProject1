module.exports = class DataModel {
    USER_ID;
    USER_NAME;
    USER_PASS;
    USER_MAIL;
    USER_TITLE;
    USER_PHONE;
    USER_GENDER;
    //USER_RANK;

    constructor () {
        this.USER_ID = -1;
        this.USER_NAME = "";
        this.USER_PASS = "";
        this.USER_MAIL = "";
        this.USER_TITLE = "";
        this.USER_PHONE = "";
        this.USER_GENDER = "";
        this.USER_RANK = -1;    
    }
}