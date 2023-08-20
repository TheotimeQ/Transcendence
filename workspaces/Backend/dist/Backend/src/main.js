"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: nest_winston_1.WinstonModule.createLogger({
                transports: [
                    new winston_1.transports.File({
                        filename: process.env.ERROR_LOG_PATH || `logs/error.log`,
                        level: 'error',
                        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf((info) => {
                            return `${info.timestamp} ${info.level}: ${info.message}`;
                        })),
                    }),
                    new winston_1.transports.File({
                        filename: process.env.COMBINED_LOG_PATH || `logs/combined.log`,
                        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
                    }),
                    new winston_1.transports.Console({
                        format: winston_1.format.combine(winston_1.format.cli(), winston_1.format.splat(), winston_1.format.timestamp(), winston_1.format.printf((info) => {
                            return `${info.timestamp} ${info.level}: ${info.message}`;
                        })),
                    }),
                ],
                exceptionHandlers: [
                    new winston_1.transports.File({
                        filename: process.env.EXCEPTION_LOG_PATH || 'logs/exceptions.log',
                        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.metadata(), winston_1.format.printf((info) => {
                            if (info.metadata && info.metadata.stack) {
                                return `${info.timestamp} ${info.level}: ${info.message}\n${info.metadata.stack}`;
                            }
                            return `${info.timestamp} ${info.level}: ${info.message}`;
                        })),
                    }),
                ],
            }),
        });
        app.enableCors({
            origin: `http://${process.env.HOST_IP}:3000`,
            credentials: true,
        });
        app.setGlobalPrefix('api');
        app.use(cookieParser());
        app.useGlobalPipes(new common_1.ValidationPipe());
        await app.listen(parseInt(process.env.PORT_NESTJS));
        console.log(`Application is running on port ${process.env.PORT_NESTJS}`);
    }
    catch (error) {
        console.error('Error during bootstrap:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map