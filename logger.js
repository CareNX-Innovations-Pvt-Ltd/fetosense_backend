require('winston-daily-rotate-file');
var config = require('./config.js');
var winston = require('winston');
configValue = config.configValue;
if(configValue.logging){
winston.loggers.add('logger', {
    transports: [
new (winston.transports.Console)(
            {
                level: "info",
                colorize: true
            }),

        //new files will be generated each day, the date patter indicates the frequency of creating a file.
        new winston.transports.DailyRotateFile({
                name: 'debug-log',
                filename: 'logs/mongo_insert_log',
                level: 'info',
                prepend: true,
                datePattern: 'YYYY-MM-DD',
                maxFiles: 10000
            }
        ),
        new (winston.transports.DailyRotateFile)({
            name: 'error-log',
            filename: 'logs/mongo_insert_error_log',
                level: 'error',
                prepend: true,
                datePattern: 'YYYY-MM-DD',
                maxFiles: 10000
        })
    ]
});

var logger = winston.loggers.get('logger');
Object.defineProperty(exports, "LOG", {value: logger});
}
else{
    logger = {};
    logger.info = function(){};
    logger.error = function(){};
    Object.defineProperty(exports, "LOG", {value: logger});
}