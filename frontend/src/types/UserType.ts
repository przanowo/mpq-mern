export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface UserState {
  userInfo: User;
  loading: boolean;
  error: string;
}

export interface UserAppState {
  auth: UserState;
}
