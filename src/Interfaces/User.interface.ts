import React from "react";

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  refresh: string;
  access: string;
  login?: boolean;
}

export interface UserContextInterface {
  user: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
}

export interface Authentication {
  email: string;
  password: string;
}

export interface Registration {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface TokenDetails {
  exp: bigint;
  jti: string;
  token_type: string;
  user_id: number;
}
