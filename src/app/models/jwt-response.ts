import { User } from './user';

export interface JwtResponse {
    token: string;
    expirationDate: number;
    user: User;
}
