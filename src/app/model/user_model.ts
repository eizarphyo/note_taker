export interface TokenResponse {
    status: string,
    token: string
}

export interface Guest {
    _id: string;
    token: string;
}

export interface User {
    _id: string;
    username: string;
    password: string;
}