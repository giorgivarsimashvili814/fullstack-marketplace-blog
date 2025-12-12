export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  authUser: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  signOut: () => void;
};

export interface NavbarItem {
  children: React.ReactNode;
  href: string;
  className: string;
}

