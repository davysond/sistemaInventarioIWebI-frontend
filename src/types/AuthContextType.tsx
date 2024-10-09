export interface AuthContextType {
    token: string | null; //
    setToken: (token: string | null) => void;
    login: (email: string, password: string) => Promise<void>; 
    logout: () => void; 
    restoreSession: (token: string) => void;
    isAuthenticated: boolean; // Estado de autenticação
    isAdmin: boolean;
}
