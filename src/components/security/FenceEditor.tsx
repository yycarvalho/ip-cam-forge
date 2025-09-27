import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Point, AnalyticsFence } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Trash2, RotateCcw } from 'lucide-react';

interface FenceEditorProps {
  camera: Camera;
  isOpen: boolean;
  onClose: () => void;
}

const FenceEditor: React.FC<FenceEditorProps> = ({ camera, isOpen, onClose }) => {
  const { addLog } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedChannel, setSelectedChannel] = useState(1);
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);

  const canvasWidth = 640;
  const canvasHeight = 480;

  useEffect(() => {
    if (isOpen) {
      drawCanvas();
    }
  }, [isOpen, points, selectedChannel]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Desenhar grade
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Desenhar cerca analítica
    if (points.length > 0) {
      // Desenhar linhas da cerca
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      if (points.length > 2) {
        ctx.closePath();
      }
      ctx.stroke();

      // Desenhar área preenchida se for um polígono fechado
      if (points.length > 2) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fill();
      }

      // Desenhar pontos
      points.forEach((point, index) => {
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Contorno do ponto
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Número do ponto
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((index + 1).toString(), point.x, point.y - 10);
      });
    }

    // Texto de instruções
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Clique para adicionar pontos | Clique direito para remover | Arraste para mover', 10, 25);
    ctx.fillText(`Canal ${selectedChannel} | Pontos: ${points.length}`, 10, 45);
  };

  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const findPointAtPosition = (x: number, y: number): number | null => {
    const threshold = 10;
    for (let i = 0; i < points.length; i++) {
      const dx = points[i].x - x;
      const dy = points[i].y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= threshold) {
        return i;
      }
    }
    return null;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(event);
    const pointIndex = findPointAtPosition(coords.x, coords.y);

    if (pointIndex !== null) {
      // Clique em um ponto existente - iniciar arraste
      setDraggedPointIndex(pointIndex);
    } else {
      // Clique em área vazia - adicionar novo ponto
      setPoints(prev => [...prev, coords]);
    }
  };

  const handleCanvasRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const coords = getCanvasCoordinates(event);
    const pointIndex = findPointAtPosition(coords.x, coords.y);

    if (pointIndex !== null) {
      // Remover ponto
      setPoints(prev => prev.filter((_, index) => index !== pointIndex));
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedPointIndex !== null) {
      const coords = getCanvasCoordinates(event);
      setPoints(prev => prev.map((point, index) =>
        index === draggedPointIndex ? coords : point
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedPointIndex(null);
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const saveFence = () => {
    if (points.length < 3) {
      alert('É necessário pelo menos 3 pontos para criar uma cerca analítica');
      return;
    }

    // Simular salvamento
    const fence: AnalyticsFence = {
      id: `fence-${Date.now()}`,
      cameraId: camera.id,
      channel: selectedChannel,
      points,
      isActive: true,
    };

    addLog('SAVE_FENCE', `Câmera ${camera.name}`, `Cerca analítica salva no canal ${selectedChannel} com ${points.length} pontos`);
    
    // Simular carregamento
    setTimeout(() => {
      alert('Cerca analítica salva com sucesso!');
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editor de Cerca Analítica - {camera.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Select 
              value={selectedChannel.toString()} 
              onValueChange={(value) => setSelectedChannel(parseInt(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Canal 1</SelectItem>
                <SelectItem value="2">Canal 2</SelectItem>
                <SelectItem value="3">Canal 3</SelectItem>
                <SelectItem value="4">Canal 4</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearPoints}
                disabled={points.length === 0}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
              <Button
                onClick={saveFence}
                disabled={points.length < 3}
                className="bg-status-online hover:bg-status-online/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Cerca
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="w-full h-auto cursor-crosshair"
              onClick={handleCanvasClick}
              onContextMenu={handleCanvasRightClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Instruções:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Clique na imagem para adicionar pontos da cerca</li>
              <li>Clique e arraste um ponto para movê-lo</li>
              <li>Clique com o botão direito em um ponto para removê-lo</li>
              <li>Mínimo de 3 pontos necessários para salvar</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FenceEditor;