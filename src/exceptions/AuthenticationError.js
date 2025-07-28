const ClientError = require('./ClientError');

export class AuthenticationError extends ClientError {
    constructor(message) {
        super(message, 401);
        this.name = 'Authentication Error'
    }
}