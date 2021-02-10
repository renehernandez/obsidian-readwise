interface LogMessage {
    message: string
    context: object
}

export function debug(log: string | LogMessage) {
    if (isComplexLog(log)) {
        printComplexLog("debug", log)
    }
    else {
        print("debug", log);
    }
}

export function error(log: string | LogMessage) {
    if (isComplexLog(log)) {
        printComplexLog("error", log);
    }
    else {
        print("error", log);
    }
}

function isComplexLog(log: string | LogMessage): log is LogMessage {
    return (log as LogMessage).message !== undefined;
}

function printComplexLog(prefix: string, log: LogMessage) {
    print(prefix, log.message);
    print(prefix, log.context);
}

function print(prefix: string, message: any) {
    console.log(`obsidian-readwise|${prefix}: ${message}`);
}