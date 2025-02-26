/**
 * @file logger.js
 * @description Logging configuration for the Fetosense backend using Winston and Daily Rotate File.
 */

require('winston-daily-rotate-file');
var config = require('./config.js');
var winston = require('winston');
configValue = config.configValue;

/**
 * Logger instance using Winston.
 * - Logs info messages to the console.
 * - Creates daily rotating log files for debug and error messages.
 * - Logs are stored in the `logs/` directory with a date-based file naming pattern.
 */

if(configValue.logging){
winston.loggers.add('logger', {
    transports: [

        /**
             * Console Transport
             * - Logs messages to the console.
             * - Logs at `info` level with colorized output.
             */

new (winston.transports.Console)(
            {
                level: "info",
                colorize: true
            }),

            /**
             * Daily Rotate File - Debug Log
             * - Stores logs at `info` level.
             * - Generates a new log file daily.
             * - Stores logs in `logs/mongo_insert_log`.
             * - Retains up to 10,000 log files.
             */

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

        /**
             * Daily Rotate File - Error Log
             * - Stores logs at `error` level.
             * - Generates a new log file daily.
             * - Stores logs in `logs/mongo_insert_error_log`.
             * - Retains up to 10,000 log files.
             */

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

/**
     * Logger instance retrieved from Winston.
     * @constant {Object} logger
     */


var logger = winston.loggers.get('logger');
Object.defineProperty(exports, "LOG", {value: logger});
}
else{

    /**
     * Fallback Logger (Disabled Logging)
     * - If logging is disabled in `config.js`, this empty logger is used.
     */
    
    logger = {};
    logger.info = function(){};
    logger.error = function(){};
    Object.defineProperty(exports, "LOG", {value: logger});
}