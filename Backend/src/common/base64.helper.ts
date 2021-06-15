
export class Base64Helper {
    public static encode(string: string): string {
        return Buffer.from(string).toString('base64');
    };

    public static decode(string: string): string {
        return Buffer.from(string, 'base64').toString('utf8');
    };
}