export interface UserPayload {
  sub: string;
  login: string;
  email: string;
  iat?: number;
  exp?: number;
}
