import { CanActivate } from "@nestjs/common";
import { Repository } from "typeorm";
import { SocketToken } from "@/utils/typeorm/SocketToken.entity";
import { CryptoService } from "@/utils/crypto/crypto";
export declare class WsJwtGuard implements CanActivate {
    private readonly socketTokenRepository;
    private readonly cryptoService;
    constructor(socketTokenRepository: Repository<SocketToken>, cryptoService: CryptoService);
    canActivate(context: any): Promise<boolean>;
    private findSocketTokenByBearerToken;
}
