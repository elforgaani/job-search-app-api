interface User {
    id: string,
    email: string,
    token: string,
    iat: number,
    exp: number,
}
declare namespace Express {
    interface Request {
        user: User
    }
}

