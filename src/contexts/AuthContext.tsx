import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SystemLog } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  logs: SystemLog[];
  addLog: (action: string, target: string, details?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const defaultAdmin: User = {
  id: 'admin-1',
  login: 'admin',
  password: 'admin',
  name: 'Administrador',
  cpf: '000.000.000-00',
  createdAt: new Date(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([defaultAdmin]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    const savedLogs = localStorage.getItem('logs');

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.login === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      addLogInternal(user.id, user.name, 'LOGIN', 'Sistema', 'Login realizado com sucesso');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addLogInternal(currentUser.id, currentUser.name, 'LOGOUT', 'Sistema', 'Logout realizado');
    }
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    if (currentUser) {
      addLogInternal(currentUser.id, currentUser.name, 'CREATE_USER', `Usuário ${newUser.name}`, `Usuário criado com login ${newUser.login}`);
    }
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    if (currentUser) {
      addLogInternal(currentUser.id, currentUser.name, 'UPDATE_USER', `Usuário ${id}`, 'Usuário atualizado');
    }
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    if (currentUser) {
      addLogInternal(currentUser.id, currentUser.name, 'DELETE_USER', `Usuário ${id}`, 'Usuário removido');
    }
  };

  const addLogInternal = (userId: string, userName: string, action: string, target: string, details?: string) => {
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      userId,
      userName,
      action,
      target,
      timestamp: new Date(),
      details,
    };
    const updatedLogs = [newLog, ...logs].slice(0, 1000); // Manter apenas os últimos 1000 logs
    setLogs(updatedLogs);
    localStorage.setItem('logs', JSON.stringify(updatedLogs));
  };

  const addLog = (action: string, target: string, details?: string) => {
    if (currentUser) {
      addLogInternal(currentUser.id, currentUser.name, action, target, details);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    logs,
    addLog,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};