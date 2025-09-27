import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, DetectionConfig } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Settings } from 'lucide-react';

interface ConfigurationModalProps {
  selectedCameraIds: string[];
  cameras: Camera[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: DetectionConfig) => void;
}

const daysOfWeek = [
  { id: 'monday', label: 'Segunda' },
  { id: 'tuesday', label: 'Terça' },
  { id: 'wednesday', label: 'Quarta' },
  { id: 'thursday', label: 'Quinta' },
  { id: 'friday', label: 'Sexta' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
];

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  selectedCameraIds,
  cameras,
  isOpen,
  onClose,
  onSave,
}) => {
  const { addLog } = useAuth();
  const [config, setConfig] = useState<DetectionConfig>({
    motionDetection: {
      enabled: false,
      sensitivity: 50,
      schedule: {
        monday: { start: '08:00', end: '18:00', enabled: true },
        tuesday: { start: '08:00', end: '18:00', enabled: true },
        wednesday: { start: '08:00', end: '18:00', enabled: true },
        thursday: { start: '08:00', end: '18:00', enabled: true },
        friday: { start: '08:00', end: '18:00', enabled: true },
        saturday: { start: '08:00', end: '18:00', enabled: false },
        sunday: { start: '08:00', end: '18:00', enabled: false },
      },
    },
    analyticsFence: {
      enabled: false,
    },
    lineCrossing: {
      enabled: false,
    },
    notifications: {
      email: false,
      flash: false,
      sound: false,
      central: false,
    },
  });

  const selectedCameras = cameras.filter(camera => selectedCameraIds.includes(camera.id));

  const handleSave = () => {
    onSave(config);
    addLog('SAVE_CONFIG', `${selectedCameraIds.length} câmeras`, 'Configurações de detecção salvas');
  };

  const updateMotionDetection = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      motionDetection: {
        ...prev.motionDetection,
        [field]: value,
      },
    }));
  };

  const updateSchedule = (day: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      motionDetection: {
        ...prev.motionDetection,
        schedule: {
          ...prev.motionDetection.schedule,
          [day]: {
            ...prev.motionDetection.schedule[day],
            [field]: value,
          },
        },
      },
    }));
  };

  const updateNotifications = (field: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração em Lote ({selectedCameras.length} câmeras)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Cameras */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Câmeras Selecionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedCameras.map(camera => (
                  <div key={camera.id} className="bg-muted px-3 py-1 rounded-md text-sm">
                    {camera.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="motion" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="motion">Detecção de Movimento</TabsTrigger>
              <TabsTrigger value="analytics">Cerca Analítica</TabsTrigger>
              <TabsTrigger value="crossing">Cruzamento de Linha</TabsTrigger>
            </TabsList>

            <TabsContent value="motion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detecção de Movimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="motion-enabled">Ativar detecção de movimento</Label>
                    <Switch
                      id="motion-enabled"
                      checked={config.motionDetection.enabled}
                      onCheckedChange={(checked) => updateMotionDetection('enabled', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sensibilidade: {config.motionDetection.sensitivity}%</Label>
                    <Slider
                      value={[config.motionDetection.sensitivity]}
                      onValueChange={(value) => updateMotionDetection('sensitivity', value[0])}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Agendamento</h4>
                    {daysOfWeek.map((day) => (
                      <div key={day.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${day.id}-enabled`}
                            checked={config.motionDetection.schedule[day.id].enabled}
                            onCheckedChange={(checked) => updateSchedule(day.id, 'enabled', checked)}
                          />
                          <Label htmlFor={`${day.id}-enabled`} className="w-20">
                            {day.label}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Início:</Label>
                          <input
                            type="time"
                            value={config.motionDetection.schedule[day.id].start}
                            onChange={(e) => updateSchedule(day.id, 'start', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                            disabled={!config.motionDetection.schedule[day.id].enabled}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Fim:</Label>
                          <input
                            type="time"
                            value={config.motionDetection.schedule[day.id].end}
                            onChange={(e) => updateSchedule(day.id, 'end', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                            disabled={!config.motionDetection.schedule[day.id].enabled}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cerca Analítica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics-enabled">Ativar cerca analítica</Label>
                    <Switch
                      id="analytics-enabled"
                      checked={config.analyticsFence.enabled}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({
                          ...prev,
                          analyticsFence: { ...prev.analyticsFence, enabled: checked }
                        }))
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A cerca analítica deve ser configurada individualmente para cada câmera através do editor de cerca.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crossing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cruzamento de Linha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="crossing-enabled">Ativar cruzamento de linha</Label>
                    <Switch
                      id="crossing-enabled"
                      checked={config.lineCrossing.enabled}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({
                          ...prev,
                          lineCrossing: { ...prev.lineCrossing, enabled: checked }
                        }))
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detecta quando objetos cruzam uma linha virtual configurada na câmera.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-email">Enviar e-mail</Label>
                  <Switch
                    id="notify-email"
                    checked={config.notifications.email}
                    onCheckedChange={(checked) => updateNotifications('email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-flash">Ativar flash</Label>
                  <Switch
                    id="notify-flash"
                    checked={config.notifications.flash}
                    onCheckedChange={(checked) => updateNotifications('flash', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-sound">Emitir som</Label>
                  <Switch
                    id="notify-sound"
                    checked={config.notifications.sound}
                    onCheckedChange={(checked) => updateNotifications('sound', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-central">Notificar central</Label>
                  <Switch
                    id="notify-central"
                    checked={config.notifications.central}
                    onCheckedChange={(checked) => updateNotifications('central', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-status-online hover:bg-status-online/90">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;