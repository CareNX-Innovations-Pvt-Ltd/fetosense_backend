debugLogging =  true;
function debugLog() {
    if (debugLogging) {
        var logstr = "";
        for (i = 0; i < arguments.length; i++) {
            obj = arguments[i];
            if (obj instanceof Object || obj instanceof Array || obj === null || obj === undefined) {
                logstr += JSON.stringify(obj) + "  ";
            }
            else {
                logstr += obj.toString() + "  ";
            }
        }
        console.log(logstr);
    }
    return true;
}

exports.debugLog = debugLog;