import pino from "pino";

const logger = pino({
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },
    level: 'debug',
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },

})

export default logger