import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, CameraGroup } from '@/types';
import CameraCard from './CameraCard';
import GroupPanel from './GroupPanel';
import FenceEditor from './FenceEditor';
import ConfigurationModal from './ConfigurationModal';
import UserManagement from './UserManagement';
import SystemLogs from './SystemLogs';
import securiCamLogo from '@/assets/securicam-logo.png';
import { 
  Search, 
  Plus, 
  Settings, 
  Users, 
  FileText, 
  LogOut,
  Monitor,
  Shield
} from 'lucide-react';

const SecurityDashboard: React.FC = () => {
  const { currentUser, logout, addLog } = useAuth();
  const [activeTab, setActiveTab] = useState('equipments');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [groups, setGroups] = useState<CameraGroup[]>([]);
  const [showFenceEditor, setShowFenceEditor] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);

  // Dados mockados
  useEffect(() => {
    const mockCameras: Camera[] = [
      {
        id: 'cam-1',
        name: 'Câmera Entrada Principal',
        ip: '192.168.1.100',
        login: 'admin',
        password: 'pass123',
        status: 'online',
        analyticsActive: true,
        alarmEnabled: true,
      },
      {
        id: 'cam-2',
        name: 'Câmera Estacionamento',
        ip: '192.168.1.101',
        login: 'admin',
        password: 'pass123',
        status: 'online',
        analyticsActive: false,
        alarmEnabled: true,
        groupId: 'group-1',
      },
      {
        id: 'cam-3',
        name: 'Câmera Lateral Direita',
        ip: '192.168.1.102',
        login: 'admin',
        password: 'pass123',
        status: 'offline',
        analyticsActive: true,
        alarmEnabled: false,
        groupId: 'group-1',
      },
      {
        id: 'cam-4',
        name: 'Câmera Fundos',
        ip: '192.168.1.103',
        login: 'admin',
        password: 'pass123',
        status: 'online',
        analyticsActive: true,
        alarmEnabled: true,
      },
    ];

    const mockGroups: CameraGroup[] = [
      {
        id: 'group-1',
        name: 'Área Externa',
        cameraIds: ['cam-2', 'cam-3'],
        createdAt: new Date(),
      },
    ];

    setCameras(mockCameras);
    setGroups(mockGroups);
  }, []);

  const filteredCameras = cameras.filter(camera =>
    camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camera.ip.includes(searchTerm)
  );

  const handleEditFence = (camera: Camera) => {
    setEditingCamera(camera);
    setShowFenceEditor(true);
    addLog('OPEN_FENCE_EDITOR', `Câmera ${camera.name}`, 'Editor de cerca analítica aberto');
  };

  const handleConfigure = (camera?: Camera) => {
    if (camera) {
      setSelectedCameras([camera.id]);
    }
    setShowConfigModal(true);
    addLog('OPEN_CONFIG', camera ? `Câmera ${camera.name}` : 'Múltiplas câmeras', 'Configuração aberta');
  };

  const handleSelectCamera = (cameraId: string) => {
    setSelectedCameras(prev => 
      prev.includes(cameraId) 
        ? prev.filter(id => id !== cameraId)
        : [...prev, cameraId]
    );
  };

  const onlineCamerasCount = cameras.filter(c => c.status === 'online').length;
  const totalCameras = cameras.length;

  const menuItems = [
    { id: 'equipments', label: 'Equipamentos', icon: Monitor },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'logs', label: 'Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <img src={securiCamLogo} alt="SecuriCam Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold">SecuriCam</h1>
                <p className="text-xs text-sidebar-foreground/70">Sistema de Vigilância</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start gap-3 ${
                      activeTab === item.id 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                        : 'hover:bg-sidebar-accent'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-sidebar-accent rounded-lg p-4 mb-4">
              <p className="text-xs text-sidebar-foreground/80 mb-1">Usuário logado</p>
              <p className="font-medium text-sm">{currentUser?.name}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'equipments' && (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">Equipamentos</h2>
                    <p className="text-muted-foreground">Gerencie suas câmeras e grupos</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-sm">
                      {onlineCamerasCount}/{totalCameras} Online
                    </Badge>
                    {selectedCameras.length > 0 && (
                      <Button onClick={() => handleConfigure()}>
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar Selecionadas ({selectedCameras.length})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar câmeras por nome ou IP..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Groups Panel */}
                <div className="lg:col-span-1">
                  <GroupPanel 
                    groups={groups}
                    cameras={cameras}
                    onGroupChange={(updatedGroups) => setGroups(updatedGroups)}
                    onCameraMove={(cameraId, groupId) => {
                      setCameras(prev => prev.map(cam => 
                        cam.id === cameraId ? { ...cam, groupId } : cam
                      ));
                      addLog('MOVE_CAMERA', `Câmera ${cameraId}`, `Movida para grupo ${groupId}`);
                    }}
                  />
                </div>

                {/* Cameras Grid */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCameras.map((camera) => {
                      const group = groups.find(g => g.id === camera.groupId);
                      return (
                        <CameraCard
                          key={camera.id}
                          camera={camera}
                          group={group}
                          onEditFence={handleEditFence}
                          onConfigure={handleConfigure}
                          isSelected={selectedCameras.includes(camera.id)}
                          onSelect={handleSelectCamera}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'logs' && <SystemLogs />}
        </div>
      </div>

      {/* Modals */}
      {showFenceEditor && editingCamera && (
        <FenceEditor
          camera={editingCamera}
          isOpen={showFenceEditor}
          onClose={() => {
            setShowFenceEditor(false);
            setEditingCamera(null);
          }}
        />
      )}

      {showConfigModal && (
        <ConfigurationModal
          selectedCameraIds={selectedCameras}
          cameras={cameras}
          isOpen={showConfigModal}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedCameras([]);
          }}
          onSave={(config) => {
            addLog('SAVE_CONFIG', `${selectedCameras.length} câmeras`, 'Configurações salvas');
            setShowConfigModal(false);
            setSelectedCameras([]);
          }}
        />
      )}
    </div>
  );
};

export default SecurityDashboard;