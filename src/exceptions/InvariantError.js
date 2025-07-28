const ClientError = require('./ClientError');

export class InvariantError extends ClientError{
    constructor(message) {
        super(message);
        this.name = 'Invariant Error'
    }
}