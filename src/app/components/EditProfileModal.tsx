import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { X, Upload, MessageSquare, Mail, Phone, Check } from "lucide-react";
import { useState } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: any;
}

export function EditProfileModal({ isOpen, onClose, userData }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: userData?.name || "Juan Domínguez",
    role: userData?.role || "Product Manager Senior",
    email: userData?.email || "juan.dominguez@meetmind.io",
    bio: userData?.bio || "Apasionado por crear productos que impactan. 8 años de experiencia liderando equipos de producto en startups tecnológicas.",
    team: userData?.team || "Product & Design",
    currentProject: userData?.currentProject || "MeetMind v2.0 - AI Meeting Assistant",
    hierarchy: userData?.hierarchy || "Product Lead → VP of Product → CEO",
    isActive: userData?.status?.active ?? true,
  });

  const [preferredCommunication, setPreferredCommunication] = useState({
    slack: true,
    email: false,
    phone: false,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    // Save logic here
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <Card 
          className="w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Editar perfil</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Cambiar foto
                </Button>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG o GIF (max. 2MB)</p>
              </div>
            </div>

            <Separator />

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Información básica</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Rol
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Tu rol en la empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email corporativo
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Biografía
                </Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <p className="text-xs text-gray-500">{formData.bio.length}/200 caracteres</p>
              </div>
            </div>

            <Separator />

            {/* Professional Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Información profesional</h3>
              
              <div className="space-y-2">
                <Label htmlFor="team" className="text-sm font-medium">
                  Equipo
                </Label>
                <Input
                  id="team"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  placeholder="Nombre del equipo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project" className="text-sm font-medium">
                  Proyecto actual
                </Label>
                <Input
                  id="project"
                  value={formData.currentProject}
                  onChange={(e) => setFormData({ ...formData, currentProject: e.target.value })}
                  placeholder="Proyecto en el que trabajas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hierarchy" className="text-sm font-medium">
                  Jerarquía
                </Label>
                <Input
                  id="hierarchy"
                  value={formData.hierarchy}
                  onChange={(e) => setFormData({ ...formData, hierarchy: e.target.value })}
                  placeholder="Tu posición → Manager → Director"
                />
                <p className="text-xs text-gray-500">Usa → para separar los niveles</p>
              </div>
            </div>

            <Separator />

            {/* Communication Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Preferencias de comunicación</h3>
              <p className="text-sm text-gray-600">Selecciona tus métodos preferidos</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Slack</p>
                      <p className="text-xs text-gray-500">Mensajería instantánea</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {preferredCommunication.slack && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Preferido
                      </Badge>
                    )}
                    <Switch
                      checked={preferredCommunication.slack}
                      onCheckedChange={(checked) => 
                        setPreferredCommunication({ ...preferredCommunication, slack: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-xs text-gray-500">Correo electrónico</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {preferredCommunication.email && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Preferido
                      </Badge>
                    )}
                    <Switch
                      checked={preferredCommunication.email}
                      onCheckedChange={(checked) => 
                        setPreferredCommunication({ ...preferredCommunication, email: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Llamada</p>
                      <p className="text-xs text-gray-500">Teléfono o videollamada</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {preferredCommunication.phone && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Preferido
                      </Badge>
                    )}
                    <Switch
                      checked={preferredCommunication.phone}
                      onCheckedChange={(checked) => 
                        setPreferredCommunication({ ...preferredCommunication, phone: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Estado de disponibilidad</h3>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${formData.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                  <div>
                    <p className="font-medium text-sm">
                      {formData.isActive ? "Activo" : "Inactivo"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.isActive ? "Disponible para reuniones" : "No disponible"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSave}
              >
                <Check className="w-4 h-4" />
                Guardar cambios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}