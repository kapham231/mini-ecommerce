/**
 * Logger Utility
 *
 * Simple logger for consistent logging across the application.
 * Supports different log levels: debug, info, warn, error.
 */

enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
}

class Logger {
    private isDevelopment = process.env.NODE_ENV !== "production";

    private log(level: LogLevel, message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level}]`;

        if (data) {
            console.log(`${prefix} ${message}`, data);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }

    public debug(message: string, data?: any): void {
        if (this.isDevelopment) {
            this.log(LogLevel.DEBUG, message, data);
        }
    }

    public info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }

    public warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }

    public error(message: string, error?: any): void {
        if (error instanceof Error) {
            this.log(LogLevel.ERROR, message, {
                message: error.message,
                stack: error.stack,
            });
        } else {
            this.log(LogLevel.ERROR, message, error);
        }
    }
}

export const logger = new Logger();
export default Logger;
