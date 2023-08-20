import { ArgumentsHost, ExceptionFilter, UnauthorizedException } from "@nestjs/common";
export declare class UnauthorizedExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost): void;
}
