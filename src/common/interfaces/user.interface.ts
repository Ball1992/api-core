export interface JwtPayload {
  sub: string;
  email: string;
  role_id: string;
  login_method: string;
}

export interface RequestUser {
  id: string;
  email: string;
  role_id: string;
  login_method: string;
  first_name?: string;
  last_name?: string;
}
