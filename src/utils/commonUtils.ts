import { ServiceException } from "./customExceptions";

export function throwServiceException(error: Error, statusCode: number = 500): never {
    throw new ServiceException(error.message);
}

export function generateCurrentTimestamp() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}


export function formatForTimeStamp(time: string) {
    return new Date(time).toISOString().slice(0, 10);
}

export function formatCurrencie(currency: string | number) {
    return parseFloat((+currency / 100).toFixed(2))
}