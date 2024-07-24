import {SQSClient} from '@aws-sdk/client-sqs'
export const instanceOfSQSAWS = new SQSClient({
    credentials: {
        accessKeyId: '',
        secretAccessKey:''
    },
    region: 'us-east-1'
})

