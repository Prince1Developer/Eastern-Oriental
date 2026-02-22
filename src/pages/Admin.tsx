import {
  Calendar, Check, FileText, HelpCircle, Image as ImageIcon, Lock, LogOut, Mail, Menu as MenuIcon, Plus, Settings, Trash2, X
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ApiError, Contact, GalleryImage, MenuPdf, Reservation, SettingsData,
  contactApi, galleryApi, menuPdfApi, reservationsApi, settingsApi
} from '../api';

interface AdminProps {
  onLogout: () => void;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'menu' | 'gallery' | 'settings' | 'faqs' | 'contacts'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [menuPdfs, setMenuPdfs] = useState<MenuPdf[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [faqFormData, setFaqFormData] = useState({ question: '', answer: '' });
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reservationsData, menuData, galleryData, settingsData, faqsData, contactsResponse] = await Promise.all([
        reservationsApi.getAll().then(res => res.data),
        menuPdfApi.getAll(),
        galleryApi.getAll(),
        settingsApi.getAll(),
        fetch(`${import.meta.env.VITE_API_URL}/faqs?all=1`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        }).then(res => res.json()).then(data => data.data || []),
        contactApi.getAll(1, 100)
      ]);
      setReservations(reservationsData);
      setMenuPdfs(menuData);
      setGalleryImages(galleryData);
      setSettings(settingsData);
      setFaqs(faqsData);
      setContacts(contactsResponse.data || []);
    } catch (error) {
      console.error("Error fetching admin data", error);
      if (error instanceof ApiError && error.status === 401) {
        onLogout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Scroll to top when tab changes
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeTab]);

  const updateReservationStatus = async (id: number, status: string) => {
    try {
      await reservationsApi.updateStatus(id, status as 'pending' | 'confirmed' | 'cancelled');
      fetchData();
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  };

  const handlePdfUpload = async (file: File, title: string) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds 20MB limit.');
      return;
    }
    setPdfUploading(true);
    try {
      await menuPdfApi.upload(file, title || file.name, true);
      fetchData();
    } catch (error) {
      console.error('Failed to upload PDF:', error);
      alert(error instanceof ApiError ? error.message : 'Failed to upload PDF.');
    } finally {
      setPdfUploading(false);
    }
  };

  const deleteMenuPdf = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu PDF?')) return;
    try {
      await menuPdfApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete PDF:', error);
    }
  };

  const setActivePdf = async (id: number) => {
    try {
      await menuPdfApi.setActive(id);
      fetchData();
    } catch (error) {
      console.error('Failed to set active PDF:', error);
    }
  };

  const updateSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as any;
    try {
      await settingsApi.update(data);
      fetchData();
      alert("Settings updated!");
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  const saveFaq = async () => {
    if (!faqFormData.question.trim() || !faqFormData.answer.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const url = editingFaqId
        ? `${import.meta.env.VITE_API_URL}/faqs/${editingFaqId}`
        : `${import.meta.env.VITE_API_URL}/faqs`;

      const response = await fetch(url, {
        method: editingFaqId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(faqFormData),
      });

      if (!response.ok) throw new Error('Failed to save FAQ');
      setEditingFaqId(null);
      setFaqFormData({ question: '', answer: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ');
    }
  };

  const deleteFaq = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/faqs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete FAQ');
      fetchData();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const updateContactStatus = async (id: number, status: 'new' | 'read' | 'replied') => {
    try {
      await contactApi.updateStatus(id, status);
      fetchData();
    } catch (error) {
      console.error('Failed to update contact status:', error);
      alert('Failed to update contact status');
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background-dark text-primary">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-background-dark border-b md:border-b-0 md:border-r border-primary/10 p-3 md:p-6 flex md:flex-col">
        <div className="hidden md:flex items-center gap-3 mb-12">
          <Lock className="text-primary w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex md:flex-col md:space-y-2 md:flex-1 gap-1 md:gap-0 overflow-x-auto w-full">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base whitespace-nowrap ${activeTab === 'reservations' ? 'bg-primary text-background-dark font-bold' : 'hover:bg-primary/10 text-slate-400'}`}
          >
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Reservations</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base whitespace-nowrap ${activeTab === 'menu' ? 'bg-primary text-background-dark font-bold' : 'hover:bg-primary/10 text-slate-400'}`}
          >
            <MenuIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Menu Items</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base whitespace-nowrap ${activeTab === 'gallery' ? 'bg-primary text-background-dark font-bold' : 'hover:bg-primary/10 text-slate-400'}`}
          >
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base whitespace-nowrap ${activeTab === 'settings' ? 'bg-primary text-background-dark font-bold' : 'hover:bg-primary/10 text-slate-400'}`}
          >
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base whitespace-nowrap ${activeTab === 'faqs' ? 'bg-primary text-background-dark font-bold' : 'hover:bg-primary/10 text-slate-400'}`}
          >
            <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">FAQs</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base whitespace-nowrap ${activeTab === 'contacts' ? 'bg-primary text-background-dark font-bold' : 'hover:bg-primary/10 text-slate-400'}`}
          >
            <Mail className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Contacts</span>
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="hidden md:flex mt-auto items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
        <button
          onClick={handleLogout}
          className="md:hidden flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 transition-all ml-auto"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <header className="mb-6 md:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize">{activeTab} Management</h1>
          <p className="text-slate-400 text-sm md:text-base">Manage your restaurant&apos;s {activeTab} here.</p>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'reservations' && (
            <motion.div
              key="reservations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-background-dark rounded-xl border border-primary/10 overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-zinc-900 text-primary/60 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Guest</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {reservations.map(res => (
                      <tr key={res.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold">{res.name}</div>
                          <div className="text-xs text-slate-500">{res.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">{res.date}</td>
                        <td className="px-6 py-4 text-sm">{res.guests}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${res.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                            res.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                              'bg-yellow-500/20 text-yellow-500'
                            }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => updateReservationStatus(res.id, 'confirmed')} className="p-2 hover:text-green-500 transition-colors"><Check className="w-4 h-4" /></button>
                            <button onClick={() => updateReservationStatus(res.id, 'cancelled')} className="p-2 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 max-w-4xl"
            >
              <div className="bg-background-dark p-6 sm:p-8 rounded-xl border border-primary/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Upload Menu PDF</h3>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const file = (document.getElementById('pdf-file-input') as HTMLInputElement)?.files?.[0];
                    const title = formData.get('title') as string;
                    if (file) {
                      handlePdfUpload(file, title);
                      (e.target as HTMLFormElement).reset();
                    } else {
                      alert('Please select a PDF file.');
                    }
                  }}
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary/60 uppercase">Menu Title</label>
                    <input
                      name="title"
                      placeholder="e.g. Spring Menu 2026"
                      className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary/60 uppercase">PDF File (Max 20MB)</label>
                    <input
                      id="pdf-file-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      required
                      className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pdfUploading}
                    className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {pdfUploading ? (
                      <><span className="animate-spin">⏳</span> Uploading...</>
                    ) : (
                      <><FileText className="w-5 h-5" /> Upload & Set as Active Menu</>
                    )}
                  </button>
                </form>
              </div>

              <div className="bg-background-dark rounded-xl border border-primary/10">
                <div className="px-6 py-4 border-b border-primary/10">
                  <h3 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> Uploaded Menu PDFs</h3>
                </div>
                {menuPdfs.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No menu PDFs uploaded yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-primary/5">
                    {menuPdfs.map(pdf => (
                      <div key={pdf.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${pdf.is_active ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-slate-500'}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold truncate">{pdf.title}</span>
                              {pdf.is_active === 1 && (
                                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-green-500/20 text-green-400 rounded-full flex-shrink-0">Active</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                              <span>{pdf.original_name}</span>
                              <span>•</span>
                              <span>{(pdf.file_size / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span>{new Date(pdf.uploaded_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={pdf.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
                          >
                            View
                          </a>
                          {pdf.is_active !== 1 && (
                            <button
                              onClick={() => setActivePdf(pdf.id)}
                              className="px-3 py-1.5 text-xs font-bold bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"
                            >
                              Set Active
                            </button>
                          )}
                          <button
                            onClick={() => deleteMenuPdf(pdf.id)}
                            className="p-2 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && settings && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl"
            >
              <div className="bg-background-dark p-4 sm:p-8 rounded-xl border border-primary/10">
                <form className="space-y-6" onSubmit={updateSettings}>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/60 uppercase">Restaurant Address</label>
                      <input name="address" defaultValue={settings.address} className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary/60 uppercase">Phone</label>
                        <input name="phone" defaultValue={settings.phone} className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary/60 uppercase">Email</label>
                        <input name="email" defaultValue={settings.email} className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Opening Hours</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary/60 uppercase">Mon - Thu</label>
                          <input name="hours_mon_thu" defaultValue={settings.hours_mon_thu} className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary/60 uppercase">Fri - Sat</label>
                          <input name="hours_fri_sat" defaultValue={settings.hours_fri_sat} className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary/60 uppercase">Sunday</label>
                          <input name="hours_sun" defaultValue={settings.hours_sun} className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-primary text-background-dark font-bold py-4 rounded-lg hover:bg-primary/90 transition-all">Save All Settings</button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {galleryImages.map(img => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-primary/10">
                  <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="text-red-500 hover:scale-110 transition-transform"><Trash2 className="w-6 h-6" /></button>
                  </div>
                </div>
              ))}
              <button className="border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-all text-primary/40 hover:text-primary">
                <Plus className="w-8 h-8" />
                <span className="text-xs font-bold uppercase">Add Image</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'faqs' && (
            <motion.div
              key="faqs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* FAQ Form */}
              <div className="bg-background-dark p-6 rounded-xl border border-primary/10">
                <h2 className="text-lg font-bold mb-4">{editingFaqId ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Question"
                    value={faqFormData.question}
                    onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                    className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary text-white placeholder-slate-500"
                  />
                  <textarea
                    placeholder="Answer"
                    value={faqFormData.answer}
                    onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                    className="w-full bg-zinc-900 border border-primary/20 rounded-lg py-3 px-4 outline-none focus:border-primary text-white placeholder-slate-500 min-h-[120px] resize-vertical"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveFaq}
                      className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                    </button>
                    {editingFaqId && (
                      <button
                        onClick={() => {
                          setEditingFaqId(null);
                          setFaqFormData({ question: '', answer: '' });
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* FAQs List */}
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-background-dark p-4 rounded-lg border border-primary/10 hover:border-primary/20 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{faq.question}</h3>
                        <p className="text-slate-400 text-sm line-clamp-2">{faq.answer}</p>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${faq.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingFaqId(faq.id);
                            setFaqFormData({ question: faq.question, answer: faq.answer });
                          }}
                          className="text-primary hover:text-primary/60 transition-colors"
                          title="Edit"
                        >
                          <Check className="w-5 h-5 rotate-45" />
                        </button>
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-background-dark rounded-xl border border-primary/10 overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-zinc-900 text-primary/60 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                          No contact messages yet
                        </td>
                      </tr>
                    ) : (
                      contacts.map(contact => (
                        <tr key={contact.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold">{contact.name}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                              {contact.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="line-clamp-1" title={contact.subject}>
                              {contact.subject}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={contact.status}
                              onChange={(e) => updateContactStatus(contact.id, e.target.value as 'new' | 'read' | 'replied')}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-0 cursor-pointer transition-colors ${
                                contact.status === 'replied'
                                  ? 'bg-green-500/20 text-green-500'
                                  : contact.status === 'read'
                                    ? 'bg-blue-500/20 text-blue-500'
                                    : 'bg-yellow-500/20 text-yellow-500'
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <a
                                href={`mailto:${contact.email}`}
                                className="p-2 hover:text-blue-400 transition-colors"
                                title="Reply via email"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => deleteContact(contact.id)}
                                className="p-2 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Contact Details Modal - Optional: Click to view full message */}
              {contacts.length > 0 && (
                <div className="text-xs text-slate-400 p-4 bg-zinc-900/50 rounded-lg border border-primary/10">
                  <p className="font-semibold text-slate-300 mb-2">Tip:</p>
                  <p>Click the email icon to reply to a contact. Change status from "New" to "Read" or "Replied" to track your progress.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;
