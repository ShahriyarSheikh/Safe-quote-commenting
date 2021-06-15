export class Email {
    to: string;
    subject: string;
    templateName: string;
    templateKeyValues?: Array<EmailTemplateKeyValues>;
}

export class EmailTemplateKeyValues {
    key: string;
    value: string;
}