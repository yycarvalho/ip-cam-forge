import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { SystemLog } from '@/types';
import { Search, FileText, Download, Calendar } from 'lucide-react';

const SystemLogs: React.FC = () => {
  const { logs } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterAction === '' || log.action === filterAction;

    return matchesSearch && matchesFilter;
  });

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return 'default';
      case 'LOGOUT':
        return 'secondary';
      case 'CREATE_USER':
      case 'SAVE_CONFIG':
      case 'SAVE_FENCE':
        return 'default';
      case 'DELETE_USER':
        return 'destructive';
      case 'UPDATE_USER':
      case 'MOVE_CAMERA':
        return 'secondary';
      case 'OPEN_FENCE_EDITOR':
      case 'OPEN_CONFIG':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      'LOGIN': 'Login',
      'LOGOUT': 'Logout',
      'CREATE_USER': 'Criar Usuário',
      'UPDATE_USER': 'Atualizar Usuário',
      'DELETE_USER': 'Excluir Usuário',
      'SAVE_CONFIG': 'Salvar Config',
      'SAVE_FENCE': 'Salvar Cerca',
      'MOVE_CAMERA': 'Mover Câmera',
      'OPEN_FENCE_EDITOR': 'Abrir Editor',
      'OPEN_CONFIG': 'Abrir Config',
    };
    return labels[action] || action;
  };

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  const exportLogs = () => {
    const csvContent = [
      ['Data/Hora', 'Usuário', 'Ação', 'Alvo', 'Detalhes'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toLocaleString('pt-BR'),
        log.userName,
        getActionLabel(log.action),
        log.target,
        log.details || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_sistema_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Logs do Sistema</h2>
          <p className="text-muted-foreground">Histórico de ações realizadas no sistema</p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Registros de Atividade ({filteredLogs.length})
            </CardTitle>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nos logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm"
            >
              <option value="">Todas as ações</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>
                  {getActionLabel(action)}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Alvo</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm || filterAction ? 'Nenhum log encontrado com os filtros aplicados' : 'Nenhum log registrado ainda'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {log.timestamp.toLocaleString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.userName}</TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {getActionLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={log.target}>
                      {log.target}
                    </TableCell>
                    <TableCell className="max-w-md text-sm text-muted-foreground">
                      {log.details && (
                        <div className="truncate" title={log.details}>
                          {log.details}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{logs.length}</div>
                <div className="text-sm text-muted-foreground">Total de Logs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-status-online">
                  {logs.filter(l => l.action === 'LOGIN').length}
                </div>
                <div className="text-sm text-muted-foreground">Logins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {logs.filter(l => l.action.includes('CONFIG')).length}
                </div>
                <div className="text-sm text-muted-foreground">Configurações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-light">
                  {new Set(logs.map(l => l.userId)).size}
                </div>
                <div className="text-sm text-muted-foreground">Usuários Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemLogs;