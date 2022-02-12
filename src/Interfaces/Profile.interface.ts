export interface ProfileInterface {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  last_login: string;
  auth_provider: string;
  date_joined: string;
}

export interface ProfileDetailsInterface {
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}
