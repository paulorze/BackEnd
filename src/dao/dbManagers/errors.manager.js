export class NotFoundError extends Error {
    constructor (msg) {
        super(msg)
        this.name = 'NotFoundError'
    };
};

export class TypeError extends Error {
    constructor (msg) {
        super(msg)
        this.name = 'NotFoundError'
    };
};


export class ServerError extends Error {
    constructor (msg) {
        super(msg)
        this.name = 'ServerError'
    };
};

export class ValidationError extends Error {
    constructor (msg) {
        super(msg)
        this.name = 'ValidationError'
    };
};