const ClientError = require('./ClientError');

export class AuthorizationError extends ClientError{
    constructor(message) {
        super(message, 403);
        this.name = 'Authorization Error'
    }
}
