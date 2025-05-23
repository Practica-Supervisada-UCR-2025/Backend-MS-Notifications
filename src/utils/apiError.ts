export class UnauthorizedError extends Error {
    public status: number;
    public details: string[];

    constructor(message: string, details: string[] = []) {
        super(message);
        this.status = 401;
        this.details = details;
    }
}