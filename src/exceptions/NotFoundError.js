const ClientError = require('./ClientError');

export class NotFoundError extends ClientError {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFound Error'
    }
}