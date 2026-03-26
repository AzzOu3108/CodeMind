export interface JwtPayload {
  userId: number;
  id: number;
  email: string | undefined;
  name: string | undefined;
}