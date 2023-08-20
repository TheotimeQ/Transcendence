/// <reference types="node" />
export declare class CryptoService {
    private key;
    private init;
    getKey(): Promise<Buffer>;
    private initialize;
    encrypt(data: string | null): Promise<string>;
    decrypt(data: string | null): Promise<string>;
}
