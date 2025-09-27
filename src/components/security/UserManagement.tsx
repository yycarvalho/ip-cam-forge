import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { UserPlus, Edit, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    name: '',
    cpf: '',
  });

  const resetForm = () => {
    setFormData({
      login: '',
      password: '',
      name: '',
      cpf: '',
    });
  };

  const handleAdd = () => {
    if (!formData.login || !formData.password || !formData.name || !formData.cpf) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o login já existe
    if (users.some(user => user.login === formData.login)) {
      toast({
        title: "Erro",
        description: "Este login já está em uso",
        variant: "destructive",
      });
      return;
    }

    addUser(formData);
    toast({
      title: "Sucesso",
      description: "Usuário criado com sucesso",
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      login: user.login,
      password: user.password,
      name: user.name,
      cpf: user.cpf,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingUser) return;

    if (!formData.login || !formData.password || !formData.name || !formData.cpf) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o login já existe (exceto para o usuário atual)
    if (users.some(user => user.login === formData.login && user.id !== editingUser.id)) {
      toast({
        title: "Erro",
        description: "Este login já está em uso",
        variant: "destructive",
      });
      return;
    }

    updateUser(editingUser.id, formData);
    toast({
      title: "Sucesso",
      description: "Usuário atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você não pode excluir seu próprio usuário",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
      deleteUser(user.id);
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
    }
  };

  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-login">Login</Label>
                <Input
                  id="add-login"
                  value={formData.login}
                  onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                  placeholder="Digite o login"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-password">Senha</Label>
                <Input
                  id="add-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Digite a senha"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-name">Nome Completo</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-cpf">CPF</Label>
                <Input
                  id="add-cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAdd}>
                  Criar Usuário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuários do Sistema ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>{formatCpf(user.cpf)}</TableCell>
                  <TableCell>{user.createdAt.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={user.id === currentUser?.id ? 'default' : 'secondary'}>
                      {user.id === currentUser?.id ? 'Logado' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        disabled={user.id === currentUser?.id}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-login">Login</Label>
              <Input
                id="edit-login"
                value={formData.login}
                onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Senha</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cpf">CPF</Label>
              <Input
                id="edit-cpf"
                value={formData.cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate}>
                Atualizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;