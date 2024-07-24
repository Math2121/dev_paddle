export class ServiceException extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'ServiceException';
    }
}
export class ModelException extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'ModelException';
    }
}


export class RepositoryException extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'RepositoryException';
    }
}

export class ControllerExcetption extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'ControllerExcetption';
        this.statusCode = statusCode;
    }
}

export class RouterException extends Error {
    statusCode: number = 403;

    constructor(message: string) {
        super(message);
        this.name = 'RouterException';
        this.statusCode = this.statusCode;
    }
}