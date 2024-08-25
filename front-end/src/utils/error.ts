import { AuthError } from 'next-auth'

// custom error system
export class CustomAuthError extends AuthError {
    static type: string;
    constructor(message?: any) {
        super();

        this.type = message;
    }
}

export class InvalidEmailPasswordError extends AuthError {
    static type = "Email/Password is in valid";
}

export class InactiveAccountError extends AuthError {
    static type = "Account is not active";
}