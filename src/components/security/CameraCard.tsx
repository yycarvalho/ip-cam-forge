import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, CameraGroup } from '@/types';
import StatusIndicator from './StatusIndicator';
import { Settings, MoreVertical, Video } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CameraCardProps {
  camera: Camera;
  group?: CameraGroup;
  onEditFence?: (camera: Camera) => void;
  onConfigure?: (camera: Camera) => void;
  onRemoveFromGroup?: (cameraId: string) => void;
  isSelected?: boolean;
  onSelect?: (cameraId: string) => void;
  className?: string;
}

const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  group,
  onEditFence,
  onConfigure,
  onRemoveFromGroup,
  isSelected = false,
  onSelect,
  className,
}) => {
  return (
    <Card 
      className={`relative transition-smooth hover:shadow-medium cursor-pointer ${
        isSelected ? 'ring-2 ring-primary shadow-medium' : ''
      } ${className}`}
      onClick={() => onSelect?.(camera.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            {camera.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onConfigure?.(camera)}>
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditFence?.(camera)}>
                <Video className="w-4 h-4 mr-2" />
                Editar Cerca Analítica
              </DropdownMenuItem>
              {group && onRemoveFromGroup && (
                <DropdownMenuItem 
                  onClick={() => onRemoveFromGroup(camera.id)}
                  className="text-destructive"
                >
                  Remover do Grupo
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-xs text-muted-foreground">
          IP: {camera.ip}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <StatusIndicator 
              status={camera.status} 
              label={camera.status === 'online' ? 'Online' : 'Offline'}
              showPulse={camera.status === 'online'}
            />
            <Badge variant={camera.status === 'online' ? 'default' : 'destructive'}>
              {camera.status === 'online' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <StatusIndicator 
                status={camera.analyticsActive ? 'online' : 'offline'} 
                size="sm"
              />
              <span className="text-muted-foreground">Analítico</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusIndicator 
                status={camera.alarmEnabled ? 'online' : 'offline'} 
                size="sm"
              />
              <span className="text-muted-foreground">Alarme</span>
            </div>
          </div>

          {group && (
            <Badge variant="outline" className="text-xs">
              Grupo: {group.name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCard;