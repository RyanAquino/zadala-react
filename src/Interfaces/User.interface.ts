import React from "react";

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  refresh: string;
  access: string;
}

export interface UserContextInterface {
  user: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
}

export interface Authentication {
  email: string;
  password: string;
}
