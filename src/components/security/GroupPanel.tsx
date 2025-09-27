import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CameraGroup, Camera } from '@/types';
import { Plus, Folder, FolderOpen, Trash2 } from 'lucide-react';

interface GroupPanelProps {
  groups: CameraGroup[];
  cameras: Camera[];
  onGroupChange: (groups: CameraGroup[]) => void;
  onCameraMove: (cameraId: string, groupId?: string) => void;
}

const GroupPanel: React.FC<GroupPanelProps> = ({
  groups,
  cameras,
  onGroupChange,
  onCameraMove,
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const createGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup: CameraGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      cameraIds: [],
      createdAt: new Date(),
    };

    onGroupChange([...groups, newGroup]);
    setNewGroupName('');
  };

  const deleteGroup = (groupId: string) => {
    // Mover câmeras do grupo para "sem grupo"
    const group = groups.find(g => g.id === groupId);
    if (group) {
      group.cameraIds.forEach(cameraId => {
        onCameraMove(cameraId, undefined);
      });
    }

    onGroupChange(groups.filter(g => g.id !== groupId));
  };

  const toggleGroupExpanded = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const ungroupedCameras = cameras.filter(camera => !camera.groupId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Grupos de Câmeras</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create New Group */}
        <div className="space-y-2">
          <Input
            placeholder="Nome do novo grupo"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createGroup()}
          />
          <Button
            onClick={createGroup}
            disabled={!newGroupName.trim()}
            className="w-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Grupo
          </Button>
        </div>

        {/* Groups List */}
        <div className="space-y-2">
          {groups.map((group) => {
            const isExpanded = expandedGroups.includes(group.id);
            const groupCameras = cameras.filter(camera => camera.groupId === group.id);

            return (
              <div key={group.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => toggleGroupExpanded(group.id)}
                  >
                    {isExpanded ? (
                      <FolderOpen className="w-4 h-4 text-primary" />
                    ) : (
                      <Folder className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-sm">{group.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {groupCameras.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGroup(group.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {isExpanded && (
                  <div className="pl-6 space-y-1">
                    {groupCameras.map((camera) => (
                      <div 
                        key={camera.id}
                        className="text-xs p-2 bg-muted rounded flex items-center justify-between"
                      >
                        <span>{camera.name}</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            camera.status === 'online' ? 'bg-status-online' : 'bg-status-offline'
                          }`} />
                        </div>
                      </div>
                    ))}
                    {groupCameras.length === 0 && (
                      <div className="text-xs text-muted-foreground italic pl-2">
                        Nenhuma câmera neste grupo
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ungrouped Cameras */}
        {ungroupedCameras.length > 0 && (
          <div className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm text-muted-foreground">Sem Grupo</span>
              <Badge variant="outline" className="text-xs">
                {ungroupedCameras.length}
              </Badge>
            </div>
            <div className="pl-6 space-y-1">
              {ungroupedCameras.map((camera) => (
                <div 
                  key={camera.id}
                  className="text-xs p-2 bg-muted/50 rounded flex items-center justify-between"
                >
                  <span>{camera.name}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    camera.status === 'online' ? 'bg-status-online' : 'bg-status-offline'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupPanel;