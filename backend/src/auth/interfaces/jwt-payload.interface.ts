export interface JwtPayload {
  sub: number;
  email: string;
  sid: string; // id da sessão (Session) que emitiu o token
}
