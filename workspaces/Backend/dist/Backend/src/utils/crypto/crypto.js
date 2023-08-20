"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const util_1 = require("util");
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
let CryptoService = exports.CryptoService = class CryptoService {
    constructor() {
        this.key = null;
        this.init = null;
    }
    async getKey() {
        if (this.key)
            return this.key;
        if (!this.init)
            this.init = this.initialize();
        await this.init;
        return this.key;
    }
    async initialize() {
        this.key = (await (0, util_1.promisify)(crypto_1.scrypt)(process.env.CRYPTO_KEY, 'salt', 32));
    }
    async encrypt(data) {
        if (!data)
            return '';
        const iv = (0, crypto_1.randomBytes)(16);
        const key = await this.getKey();
        const cipher = (0, crypto_1.createCipheriv)('aes-256-cbc', key, iv);
        const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
        return iv.toString('hex') + encryptedData.toString('hex');
    }
    async decrypt(data) {
        if (!data)
            return '';
        const iv = Buffer.from(data.slice(0, 32), 'hex');
        const key = await this.getKey();
        data = data.slice(32);
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', key, iv);
        const result = Buffer.concat([
            decipher.update(Buffer.from(data, 'hex')),
            decipher.final(),
        ]);
        return result.toString();
    }
};
exports.CryptoService = CryptoService = __decorate([
    (0, common_1.Injectable)()
], CryptoService);
//# sourceMappingURL=crypto.js.map