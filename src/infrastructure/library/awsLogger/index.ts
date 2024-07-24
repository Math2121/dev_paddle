
import { Logger } from '@aws-lambda-powertools/logger';

export const awsLogger = new Logger({
    serviceName: 'paddle-service',
});
