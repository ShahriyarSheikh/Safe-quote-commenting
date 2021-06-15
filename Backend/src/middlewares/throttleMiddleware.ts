export class RateLimiter {
    static removeTokens: any;
};

export async function ThrottleMiddleware(request: any, response: any, next?: (err?: any) => any): Promise<any> {
    let rateLimit = await RateLimiter.removeTokens(1);
    if (rateLimit <= -1) {
        response.writeHead(429);
        response.end('');
        return;
    }
    next();
}

// Doc: https://www.npmjs.com/package/limiter#usage