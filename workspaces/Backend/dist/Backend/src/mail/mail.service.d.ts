import * as nodemailer from 'nodemailer';
export declare class MailService {
    private transporter;
    constructor();
    sendUserConfirmation(email: string, code: string): Promise<any>;
    sendUser2faVerification(email: string, code: string): Promise<any>;
    sendUserNewPassword(email: string, password: string): Promise<any>;
    sendMail(mailOptions: nodemailer.SendMailOptions): Promise<any>;
}
