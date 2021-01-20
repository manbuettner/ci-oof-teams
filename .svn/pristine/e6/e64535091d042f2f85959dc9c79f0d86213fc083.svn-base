class CIUser {
    constructor(data) {
        
        this.givenName = data["givenName"];
        this.sn = data["surname"];
        this.title = data["jobTitle"];
        this.email = data["mail"];
        this.telephoneNumber = "";

        if(this.email !== null && this.email !== "" ) {
            this.login = this.email;            
        }
    }

    givenName() {
        return this.givenName;
    }

    sn() {
        return this.sn;
    }

    title() {
        return this.title;
    }

    email() {
        return this.email;
    }

    telephoneNumber() {
        return this.telephoneNumber;
    }

    login() {
        return this.login;
    }
}


export default CIUser;