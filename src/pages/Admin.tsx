import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, ExternalLink, Image, MapPin, Users, Link2, ChevronDown, LogOut, Loader2, Building, UserCircle, Headset, MessageCircle } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { DebouncedInput } from '@/components/admin/DebouncedInput';
import { SortableList } from '@/components/admin/SortableList';
import { useAuth } from '@/hooks/useAuth';
import { useBanners, useQuickLinks, useLocations, useTeamMembers, useProjects, useCustomerService } from '@/hooks/useFirestore';
import { settingsCollection } from '@/lib/firestore-helpers';
import { LoginForm } from '@/components/admin/LoginForm';
import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import type { BannerData, QuickLink, Location, TeamMember, Project } from '@/types/firebase';

const AdminPanel = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: banners, loading: bannersLoading, add: addBanner, update: updateBanner, remove: removeBanner, refresh: refreshBanners } = useBanners({ realtime: true });
  const { data: links, loading: linksLoading, add: addLink, update: updateLink, remove: removeLink } = useQuickLinks({ realtime: true });
  const { data: locs, loading: locsLoading, add: addLocation, update: updateLocation, remove: removeLocation } = useLocations({ realtime: true });
  const { data: team, loading: teamLoading, add: addTeamMember, update: updateTeamMember, remove: removeTeamMember } = useTeamMembers({ realtime: true });
  const { data: projects, loading: projectsLoading, add: addProject, update: updateProject, remove: removeProject } = useProjects({ realtime: true });
  const { data: customerServices, loading: servicesLoading, add: addService, update: updateService, remove: removeService } = useCustomerService({ realtime: true });
  
  const [settings, setSettings] = useState({
    whatsappPhone: '',
    whatsappMessage: '',
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await settingsCollection.get();
        if (settingsData) {
          setSettings({
            whatsappPhone: settingsData.whatsappPhone || '',
            whatsappMessage: settingsData.whatsappMessage || 'Olá! Gostaria de mais informações.',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar settings:', error);
      } finally {
        setSettingsLoading(false);
      }
    };

    if (user) {
      loadSettings();
    }
  }, [user]);

  // Mostrar login se não autenticado
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const iconOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'website', label: 'Website' },
    { value: 'document', label: 'Documento' },
    { value: 'default', label: 'Link Externo' },
  ];

  // Banner handlers
  const handleAddBanner = async () => {
    try {
      const newBanner = {
        imageDesktop: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
        imageMobile: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&q=80',
        buttonText: 'Saiba Mais',
        buttonLink: 'https://',
        order: (banners?.length || 0) + 1,
      };
      const id = await addBanner(newBanner);
      setEditingId(id);
      toast({ title: 'Banner adicionado!' });
    } catch (error: any) {
      toast({ title: 'Erro ao adicionar banner', description: error.message, variant: 'destructive' });
    }
  };

  const handleReorderBanners = async (reorderedBanners: BannerData[]) => {
    try {
      const updates = reorderedBanners.map((banner, index) => 
        updateBanner(banner.id, { order: index + 1 })
      );
      await Promise.all(updates);
    } catch (error: any) {
      toast({ title: 'Erro ao reordenar banners', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateBanner = async (id: string, field: keyof BannerData, value: string | number) => {
    try {
      await updateBanner(id, { [field]: value });
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este banner?')) return;
    try {
      await removeBanner(id);
      if (editingId === id) setEditingId(null);
      toast({ title: 'Banner deletado!' });
    } catch (error: any) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    }
  };

  // Link handlers
  const handleAddLink = async () => {
    try {
      const newLink = {
        title: 'Novo Link',
        description: '',
        url: 'https://',
        icon: 'default',
        order: (links?.length || 0) + 1,
      };
      const id = await addLink(newLink);
      setEditingId(id);
      toast({ title: 'Link adicionado!' });
    } catch (error: any) {
      toast({ title: 'Erro ao adicionar link', description: error.message, variant: 'destructive' });
    }
  };

  const handleReorderLinks = async (reorderedLinks: QuickLink[]) => {
    try {
      const updates = reorderedLinks.map((link, index) => 
        updateLink(link.id, { order: index + 1 })
      );
      await Promise.all(updates);
    } catch (error: any) {
      toast({ title: 'Erro ao reordenar links', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateLink = async (id: string, field: keyof QuickLink, value: string) => {
    try {
      await updateLink(id, { [field]: value });
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;
    try {
      await removeLink(id);
      if (editingId === id) setEditingId(null);
      toast({ title: 'Link deletado!' });
    } catch (error: any) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    }
  };

  // Location handlers
  const handleAddLocation = async () => {
    try {
      const newLoc = {
        name: 'Nova Localização',
        address: '',
        wazeLink: 'https://waze.com/ul?ll=',
        mapsLink: 'https://maps.google.com/?q=',
        lat: -16.7056,
        lng: -49.2647,
        order: (locs?.length || 0) + 1,
      };
      const id = await addLocation(newLoc);
      setEditingId(id);
      toast({ title: 'Localização adicionada!' });
    } catch (error: any) {
      toast({ title: 'Erro ao adicionar localização', description: error.message, variant: 'destructive' });
    }
  };

  const handleReorderLocations = async (reorderedLocs: Location[]) => {
    try {
      const updates = reorderedLocs.map((loc, index) => 
        updateLocation(loc.id, { order: index + 1 })
      );
      await Promise.all(updates);
    } catch (error: any) {
      toast({ title: 'Erro ao reordenar localizações', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateLocation = async (id: string, field: keyof Location, value: string) => {
    try {
      await updateLocation(id, { [field]: value });
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta localização?')) return;
    try {
      await removeLocation(id);
      if (editingId === id) setEditingId(null);
      toast({ title: 'Localização deletada!' });
    } catch (error: any) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    }
  };

  // Team handlers
  const handleAddTeamMember = async () => {
    try {
      const newMember = {
        name: 'Novo Membro',
        role: 'Cargo',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
        whatsapp: '5511999999999',
        order: (team?.length || 0) + 1,
      };
      const id = await addTeamMember(newMember);
      setEditingId(id);
      toast({ title: 'Membro adicionado!' });
    } catch (error: any) {
      toast({ title: 'Erro ao adicionar membro', description: error.message, variant: 'destructive' });
    }
  };

  const handleReorderTeam = async (reorderedTeam: TeamMember[]) => {
    try {
      const updates = reorderedTeam.map((member, index) => 
        updateTeamMember(member.id, { order: index + 1 })
      );
      await Promise.all(updates);
    } catch (error: any) {
      toast({ title: 'Erro ao reordenar equipe', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateTeamMember = async (id: string, field: keyof TeamMember, value: string) => {
    try {
      await updateTeamMember(id, { [field]: value });
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este membro?')) return;
    try {
      await removeTeamMember(id);
      if (editingId === id) setEditingId(null);
      toast({ title: 'Membro deletado!' });
    } catch (error: any) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    }
  };

  // Project handlers
  const handleAddProject = async () => {
    try {
      const newProject = {
        name: 'Novo Empreendimento',
        location: 'Cidade, UF',
        status: 'launch' as const,
        statusLabel: 'Lançamento',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        driveLink: '',
        order: (projects?.length || 0) + 1,
      };
      const id = await addProject(newProject);
      setEditingId(id);
      toast({ title: 'Projeto adicionado!' });
    } catch (error: any) {
      toast({ title: 'Erro ao adicionar projeto', description: error.message, variant: 'destructive' });
    }
  };

  const handleReorderProjects = async (reorderedProjects: Project[]) => {
    try {
      const updates = reorderedProjects.map((project, index) => 
        updateProject(project.id, { order: index + 1 })
      );
      await Promise.all(updates);
    } catch (error: any) {
      toast({ title: 'Erro ao reordenar projetos', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateProject = async (id: string, field: keyof Project, value: string | number) => {
    try {
      await updateProject(id, { [field]: value });
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este projeto?')) return;
    try {
      await removeProject(id);
      if (editingId === id) setEditingId(null);
      toast({ title: 'Projeto deletado!' });
    } catch (error: any) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    }
  };

  // Customer Service handlers
  const handleReorderCustomerService = async (reorderedServices: any[]) => {
    try {
      const updates = reorderedServices.map((service, index) =>
        updateService(service.id, { order: index + 1 })
      );
      await Promise.all(updates);
    } catch (error: any) {
      toast({ title: 'Erro ao reordenar atendimentos', description: error.message, variant: 'destructive' });
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      console.log('Salvando configurações...', settings);
      await settingsCollection.update({
        whatsappPhone: settings.whatsappPhone,
        whatsappMessage: settings.whatsappMessage,
      });
      console.log('Configurações salvas com sucesso!');
      toast({ title: 'Configurações salvas!' });
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Generic item card component
  const ItemCard = ({ 
    id, 
    icon, 
    title, 
    subtitle, 
    onDelete, 
    children 
  }: { 
    id: string; 
    icon: React.ReactNode; 
    title: string; 
    subtitle?: string; 
    onDelete: () => void; 
    children: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 pl-8 sm:pl-4 bg-card rounded-xl border transition-colors ${
        editingId === id ? 'border-foreground/30' : 'border-border/50'
      }`}
    >
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setEditingId(editingId === id ? null : id)}
      >
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${editingId === id ? 'rotate-180' : ''}`} />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-muted-foreground hover:text-destructive flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {editingId === id && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t border-border/30 space-y-4"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );

  const isLoading = bannersLoading || linksLoading || locsLoading || teamLoading || settingsLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="banners" className="w-full">
            <TabsList className="w-full flex flex-wrap items-center justify-start gap-2 mb-6 h-auto p-1">
              <TabsTrigger value="banners" className="flex items-center gap-1.5 px-3 py-2">
                <Image className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-xs whitespace-nowrap">Banners</span>
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-1.5 px-3 py-2">
                <Link2 className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-xs whitespace-nowrap">Links</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-1.5 px-3 py-2">
                <Building className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-xs whitespace-nowrap">Empreendimentos</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-1.5 px-3 py-2">
                <Users className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-xs whitespace-nowrap">Equipe</span>
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-1.5 px-3 py-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-xs whitespace-nowrap">Locais</span>
              </TabsTrigger>
              <TabsTrigger value="customer-service" className="flex items-center gap-1.5 px-3 py-2">
                <Headset className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-xs whitespace-nowrap">Atendimento</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-1.5 px-3 py-2">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-xs whitespace-nowrap">Botão Contato</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-1.5 px-3 py-2">
                <UserCircle className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-xs whitespace-nowrap">Conta</span>
              </TabsTrigger>
            </TabsList>

            {/* WhatsApp Tab - Botão Contato */}
            <TabsContent value="whatsapp" className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Botão Flutuante de Contato
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-card rounded-xl border border-border/50"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Telefone (com DDD)</Label>
                    <DebouncedInput
                      value={settings.whatsappPhone || ''}
                      onSave={async (value) => {
                        setSettings({ ...settings, whatsappPhone: value });
                        await settingsCollection.update({ whatsappPhone: value });
                      }}
                      className="bg-secondary border-0"
                      placeholder="11999999999"
                    />
                    <p className="text-xs text-muted-foreground">
                      Apenas números, sem espaços ou caracteres especiais
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Mensagem Padrão</Label>
                    <DebouncedInput
                      value={settings.whatsappMessage || ''}
                      onSave={async (value) => {
                        setSettings({ ...settings, whatsappMessage: value });
                        await settingsCollection.update({ whatsappMessage: value });
                      }}
                      className="bg-secondary border-0"
                      placeholder="Olá! Gostaria de mais informações."
                    />
                    <p className="text-xs text-muted-foreground">
                      Mensagem que aparecerá automaticamente no WhatsApp
                    </p>
                  </div>

                  <Button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Banners Tab */}
            <TabsContent value="banners" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Banners do Home
                </h2>
                <Button variant="ghost" size="sm" onClick={handleAddBanner}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {banners && banners.length > 0 ? (
                <SortableList
                  items={banners}
                  onReorder={handleReorderBanners}
                  className="space-y-3"
                  renderItem={(banner) => (
                    <ItemCard
                      key={banner.id}
                      id={banner.id}
                      icon={<Image className="w-4 h-4" />}
                      title={`Banner ${banner.order}`}
                      subtitle="Imagem de destaque"
                      onDelete={() => handleDeleteBanner(banner.id)}
                    >
                      <div className="space-y-4">
                        <ImageUpload
                          label="Imagem Desktop"
                          currentUrl={banner.imageDesktop}
                          onUploadComplete={(url) => handleUpdateBanner(banner.id, 'imageDesktop', url)}
                          onRemove={() => handleUpdateBanner(banner.id, 'imageDesktop', '')}
                          aspectRatio="desktop"
                          maxWidth={1920}
                          maxHeight={1080}
                        />

                        <ImageUpload
                          label="Imagem Mobile"
                          currentUrl={banner.imageMobile}
                          onUploadComplete={(url) => handleUpdateBanner(banner.id, 'imageMobile', url)}
                          onRemove={() => handleUpdateBanner(banner.id, 'imageMobile', '')}
                          aspectRatio="mobile"
                          maxWidth={1080}
                          maxHeight={1920}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Texto do Botão</Label>
                            <DebouncedInput
                              value={banner.buttonText || ''}
                              onSave={(value) => handleUpdateBanner(banner.id, 'buttonText', value)}
                              className="bg-secondary border-0"
                              placeholder="Saiba Mais"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Link do Botão</Label>
                            <DebouncedInput
                              value={banner.buttonLink || ''}
                              onSave={(value) => handleUpdateBanner(banner.id, 'buttonLink', value)}
                              className="bg-secondary border-0"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </div>
                    </ItemCard>
                  )}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum banner cadastrado</p>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Empreendimentos
                </h2>
                <Button variant="ghost" size="sm" onClick={handleAddProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Gerencie os empreendimentos que aparecem no carrossel da página inicial.
              </p>

              {projects && projects.length > 0 ? (
                <SortableList
                  items={projects}
                  onReorder={handleReorderProjects}
                  className="space-y-3"
                  renderItem={(project) => (
                    <ItemCard
                      key={project.id}
                      id={project.id}
                      icon={
                        project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.name} 
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <Building2 className="w-4 h-4" />
                        )
                      }
                      title={project.name}
                      subtitle={`${project.statusLabel} • ${project.location}`}
                      onDelete={() => handleDeleteProject(project.id)}
                    >
                      <ImageUpload
                        label="Imagem do Projeto"
                        currentUrl={project.image}
                        onUploadComplete={(url) => handleUpdateProject(project.id, 'image', url)}
                        onRemove={() => handleUpdateProject(project.id, 'image', '')}
                        aspectRatio="desktop"
                        maxWidth={800}
                        maxHeight={480}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome do Projeto</Label>
                          <DebouncedInput
                            value={project.name || ''}
                            onSave={(value) => handleUpdateProject(project.id, 'name', value)}
                            className="bg-secondary border-0"
                            placeholder="Ex: Residencial Aurora"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Localização</Label>
                          <DebouncedInput
                            value={project.location || ''}
                            onSave={(value) => handleUpdateProject(project.id, 'location', value)}
                            className="bg-secondary border-0"
                            placeholder="Ex: Goiânia, GO"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={project.status}
                            onValueChange={(value) => {
                              const statusLabels: Record<string, string> = {
                                launch: 'Lançamento',
                                construction: 'Em Obras',
                                ready: 'Pronto para Morar',
                                sold: 'Vendido',
                              };
                              handleUpdateProject(project.id, 'status', value);
                              handleUpdateProject(project.id, 'statusLabel', statusLabels[value]);
                            }}
                          >
                            <SelectTrigger className="bg-secondary border-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="launch">🚀 Lançamento</SelectItem>
                              <SelectItem value="construction">🔨 Em Obras</SelectItem>
                              <SelectItem value="ready">🏠 Pronto para Morar</SelectItem>
                              <SelectItem value="sold">✅ Vendido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Ordem</Label>
                          <DebouncedInput
                            type="number"
                            value={String(project.order || 1)}
                            onSave={(value) => handleUpdateProject(project.id, 'order', parseInt(value) || 1)}
                            className="bg-secondary border-0"
                            placeholder="1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Link do Drive (opcional)</Label>
                        <DebouncedInput
                          value={project.driveLink || ''}
                          onSave={(value) => handleUpdateProject(project.id, 'driveLink', value)}
                          className="bg-secondary border-0"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    </ItemCard>
                  )}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum projeto cadastrado</p>
              )}
            </TabsContent>

            {/* Links Tab */}
            <TabsContent value="links" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Links Úteis
                </h2>
                <Button variant="ghost" size="sm" onClick={handleAddLink}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {links && links.length > 0 ? (
                <SortableList
                  items={links}
                  onReorder={handleReorderLinks}
                  className="space-y-3"
                  renderItem={(link) => (
                    <ItemCard
                      key={link.id}
                      id={link.id}
                      icon={<ExternalLink className="w-4 h-4" />}
                      title={link.title}
                      subtitle={link.url}
                      onDelete={() => handleDeleteLink(link.id)}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Título</Label>
                          <DebouncedInput
                            value={link.title || ''}
                            onSave={(value) => handleUpdateLink(link.id, 'title', value)}
                            className="bg-secondary border-0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ícone</Label>
                          <Select
                            value={link.icon}
                            onValueChange={(value) => handleUpdateLink(link.id, 'icon', value)}
                          >
                            <SelectTrigger className="bg-secondary border-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <DebouncedInput
                          value={link.url || ''}
                          onSave={(value) => handleUpdateLink(link.id, 'url', value)}
                          className="bg-secondary border-0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descrição (opcional)</Label>
                        <DebouncedInput
                          value={link.description || ''}
                          onSave={(value) => handleUpdateLink(link.id, 'description', value)}
                          className="bg-secondary border-0"
                        />
                      </div>
                    </ItemCard>
                  )}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum link cadastrado</p>
              )}
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Localizações
                </h2>
                <Button variant="ghost" size="sm" onClick={handleAddLocation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {locs && locs.length > 0 ? (
                <SortableList
                  items={locs}
                  onReorder={handleReorderLocations}
                  className="space-y-3"
                  renderItem={(loc) => (
                    <ItemCard
                      key={loc.id}
                      id={loc.id}
                      icon={<MapPin className="w-4 h-4" />}
                      title={loc.name}
                      subtitle={loc.address}
                      onDelete={() => handleDeleteLocation(loc.id)}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome</Label>
                          <DebouncedInput
                            value={loc.name || ''}
                            onSave={(value) => handleUpdateLocation(loc.id, 'name', value)}
                            className="bg-secondary border-0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Endereço</Label>
                          <DebouncedInput
                            value={loc.address || ''}
                            onSave={(value) => handleUpdateLocation(loc.id, 'address', value)}
                            className="bg-secondary border-0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Link Waze</Label>
                          <DebouncedInput
                            value={loc.wazeLink || ''}
                            onSave={(value) => handleUpdateLocation(loc.id, 'wazeLink', value)}
                            className="bg-secondary border-0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Link Google Maps</Label>
                          <DebouncedInput
                            value={loc.mapsLink || ''}
                            onSave={(value) => handleUpdateLocation(loc.id, 'mapsLink', value)}
                            className="bg-secondary border-0"
                          />
                        </div>
                      </div>
                    </ItemCard>
                  )}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhuma localização cadastrada</p>
              )}
            </TabsContent>

            {/* Customer Service Tab */}
            <TabsContent value="customer-service" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Atendimento ao Cliente
                </h2>
                <Button variant="ghost" size="sm" onClick={async () => {
                  try {
                    const newService = {
                      title: 'Atendimento',
                      responsible: 'Responsável',
                      phone: '',
                      email: '',
                      order: (customerServices?.length || 0) + 1,
                    };
                    const id = await addService(newService);
                    setEditingId(id);
                    toast({ title: 'Atendimento adicionado!' });
                  } catch (error: any) {
                    toast({ title: 'Erro ao adicionar', description: error.message, variant: 'destructive' });
                  }
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {customerServices && customerServices.length > 0 ? (
                <SortableList
                  items={customerServices}
                  onReorder={handleReorderCustomerService}
                  className="space-y-3"
                  renderItem={(service) => (
                    <div className="p-4 bg-card rounded-xl border border-border/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">{service.title || 'Novo Atendimento'}</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (confirm('Tem certeza que deseja remover este atendimento?')) {
                              try {
                                await removeService(service.id);
                                toast({ title: 'Atendimento removido!' });
                              } catch (error: any) {
                                toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid gap-3">
                        <div>
                          <Label>Título</Label>
                          <DebouncedInput
                            value={service.title || ''}
                            onSave={async (value) => updateService(service.id, { title: value })}
                            placeholder="Ex: Atendimento ao Cliente"
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label>Responsável</Label>
                          <DebouncedInput
                            value={service.responsible || ''}
                            onSave={async (value) => updateService(service.id, { responsible: value })}
                            placeholder="Ex: Financeiro Gama Dias"
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label>Telefone (com WhatsApp)</Label>
                          <DebouncedInput
                            value={service.phone || ''}
                            onSave={async (value) => updateService(service.id, { phone: value })}
                            placeholder="Ex: (11) 99999-9999"
                            className="mt-1.5"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Será usado para ligar e WhatsApp
                          </p>
                        </div>

                        <div>
                          <Label>Email</Label>
                          <DebouncedInput
                            value={service.email || ''}
                            onSave={async (value) => updateService(service.id, { email: value })}
                            placeholder="Ex: atendimento@exemplo.com"
                            type="email"
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-muted-foreground"
                >
                  Nenhum atendimento cadastrado. Clique em "Adicionar" para começar.
                </motion.div>
              )}
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Minha Conta
              </h2>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={user.email || ''}
                      disabled
                      className="bg-secondary border-0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Seu email não pode ser alterado
                    </p>
                  </div>
                </motion.div>

                <ChangePasswordForm />
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Equipe
                </h2>
                <Button variant="ghost" size="sm" onClick={handleAddTeamMember}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {team && team.length > 0 ? (
                <SortableList
                  items={team}
                  onReorder={handleReorderTeam}
                  className="space-y-3"
                  renderItem={(member) => (
                    <ItemCard
                      key={member.id}
                      id={member.id}
                      icon={
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      }
                      title={member.name}
                      subtitle={member.role}
                      onDelete={() => handleDeleteTeamMember(member.id)}
                    >
                      <ImageUpload
                        label="Foto do Membro"
                        currentUrl={member.avatar}
                        onUploadComplete={(url) => handleUpdateTeamMember(member.id, 'avatar', url)}
                        onRemove={() => handleUpdateTeamMember(member.id, 'avatar', '')}
                        aspectRatio="avatar"
                        maxWidth={400}
                        maxHeight={533}
                        enableCrop={true}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome</Label>
                          <DebouncedInput
                            value={member.name || ''}
                            onSave={(value) => handleUpdateTeamMember(member.id, 'name', value)}
                            className="bg-secondary border-0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cargo</Label>
                          <DebouncedInput
                            value={member.role || ''}
                            onSave={(value) => handleUpdateTeamMember(member.id, 'role', value)}
                            className="bg-secondary border-0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>WhatsApp</Label>
                          <DebouncedInput
                            value={member.whatsapp || ''}
                            onSave={(value) => handleUpdateTeamMember(member.id, 'whatsapp', value)}
                            className="bg-secondary border-0"
                            placeholder="5511999999999"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Instagram</Label>
                          <DebouncedInput
                            value={member.instagram || ''}
                            onSave={(value) => handleUpdateTeamMember(member.id, 'instagram', value)}
                            className="bg-secondary border-0"
                            placeholder="@usuario ou usuario"
                          />
                        </div>
                      </div>
                    </ItemCard>
                  )}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum membro cadastrado</p>
              )}
            </TabsContent>

          </Tabs>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/50 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {user.email}
          </span>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Ver Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-muted-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;
