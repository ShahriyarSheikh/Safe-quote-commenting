import { Service } from "typedi";
import * as SendMail from '@sendgrid/mail';
import { EmailTemplateKeyValues, Email } from "../model/DTO/email.model";
const fs = require('fs');
const path = require('path')

@Service()
export class EmailService {

    sendEmail(email: Email) {
        SendMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email.to,
            from: process.env.COMPANY_EMAIL,
            subject: email.subject,
            html: this.getEmailTemplate(email.templateName, email.templateKeyValues),
        };
        SendMail.send(msg);
    }

    public getEmailTemplate(emailTemplateName: string, keyValues: Array<EmailTemplateKeyValues>) {
        var relativePath = path.resolve(process.cwd(), `templates/${emailTemplateName}.html`);
        var data = fs.readFileSync(`${relativePath}`, 'utf8');
        if (keyValues != null) {
            keyValues.forEach(x => {
                var regexp = new RegExp('{{'+x.key+'}}','g')
                data = data.replace(regexp, x.value)
            //     data.replace(new RegExp(`{{${x.key}}}`,'g'), x.value);
            //    // data.replace(new RegExp(`{{${reg[0].key}}}`,'g'), "Working");
            });
        }
        return data;
    }

}