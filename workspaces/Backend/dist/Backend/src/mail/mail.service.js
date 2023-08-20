"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = exports.MailService = class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        }, {
            from: '"No Reply" <crunchypong42@gmail.com>',
        });
    }
    async sendUserConfirmation(email, code) {
        const codeFormated = code.substring(0, 4) + " - " + code.substring(4);
        console.log("code email: ", code);
        return this.transporter.sendMail({
            to: email,
            subject: 'Welcome to Crunchy Pong! Confirm your Email',
            html: `<p>Welcome to Crunchy Pong!</p><p>In order to finalize your registration,</p><p>Please enter this code to confirm your email:</p><p>${codeFormated}</p><p>If you did not request this email you can safely ignore it.</p>`,
        });
    }
    async sendUser2faVerification(email, code) {
        const codeFormated = code.substring(0, 4) + " - " + code.substring(4);
        console.log("code email: ", code);
        return this.transporter.sendMail({
            to: email,
            subject: 'Crunchy Pong, Verify your identity!',
            html: `<p>Securise your Crunchy account!</p><p>In order to activate the double authentification,</p><p>Please enter this code to first verify your identity:</p><p>${codeFormated}</p><p>If you did not request this email, you can safely ignore it.</p>`,
        });
    }
    async sendUserNewPassword(email, password) {
        console.log(password);
        return this.transporter.sendMail({
            to: email,
            subject: 'Crunchy Pong: here your new account access!',
            html: `<p>Your account settings have been updated!</p><p>Here is your new password,</p><p>Do not loose it!</p><p>${password}</p><p>You can change it in your profile settings, please update it as soon as you can for security reasons!</p><p>If you did not request this email, please change your password immediately in your account settings!</p>`,
        });
    }
    async sendMail(mailOptions) {
        return this.transporter.sendMail(mailOptions);
    }
};
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map