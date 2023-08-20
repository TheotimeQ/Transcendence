import { Logger } from '@nestjs/common';
export declare class ColoredLogger extends Logger {
    private getColorPrefix;
    log(message: any, context?: string): void;
    error(message: any, context?: string, trace?: string): void;
    warn(message: any, context?: string): void;
}
