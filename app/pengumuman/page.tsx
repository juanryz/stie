"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, Plus, Calendar, Bell, ChevronRight, Pin, Clock, 
  X, Image as ImageIcon, Check, Loader2, Bold, Italic, List, 
  Trash2, Upload, AlertCircle, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTanggal, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PengumumanPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORM STATES
  const [formData, setFormData] = useState({
    judul: "",
    konten: "",
    ringkasan: "",
    gambarUrls: [] as string[],
    kategori: "Akademik",
    pin: false
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/pengumuman");
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        setData([]);
      }
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.gambarUrls.length > 8) {
       toast.error("Maksimal 8 gambar!");
       return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pengumuman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (res.ok) {
        setShowModal(false);
        setFormData({ judul: "", konten: "", ringkasan: "", gambarUrls: [], kategori: "Akademik", pin: false });
        toast.success("Pengumuman berhasil diterbitkan!");
        fetchData();
      } else {
        toast.error(result.error || "Gagal menambahkan pengumuman.");
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (!files) return;

     if (formData.gambarUrls.length + files.length > 8) {
        toast.error("Maksimal 8 gambar diperbolehkan.");
        return;
     }

     const newUrls = [...formData.gambarUrls];
     Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
           if (ev.target?.result) {
              setFormData(prev => ({
                 ...prev,
                 gambarUrls: [...prev.gambarUrls, ev.target!.result as string].slice(0, 8)
              }));
           }
        };
        reader.readAsDataURL(file);
     });
     toast.success(`${files.length} gambar terpilih.`);
  };

  const insertFormatting = (prefix: string, suffix: string) => {
     const textarea = textareaRef.current;
     if (!textarea) return;

     const start = textarea.selectionStart;
     const end = textarea.selectionEnd;
     const text = textarea.value;
     const selected = text.substring(start, end);
     const before = text.substring(0, start);
     const after = text.substring(end);

     const newText = `${before}${prefix}${selected}${suffix}${after}`;
     setFormData({ ...formData, konten: newText });

     // Reset focus and selection
     setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
     }, 10);
  };

  const renderContent = (text: string) => {
     if (!text) return "";
     // Simple regex to parse bold, italic, and lists for a preview
     return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/^- (.*)/gm, "<li>$1</li>");
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1400px] mx-auto min-h-full pb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#2D2A26] pb-10">
        <div>
          <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10">
            <Sparkles className="w-4 h-4" />
            Portal Pengumuman
          </div>
          <h1 className="text-6xl text-white font-normal tracking-tight">Info & Update</h1>
        </div>
        
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-2xl h-14 px-8 font-bold flex items-center gap-2 shadow-2xl transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" /> Buat Pengumuman Baru
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
           <Loader2 className="w-10 h-10 text-[#EAC956] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {data.length === 0 ? (
             <div className="col-span-full text-center py-24 bg-[#1C1A17] rounded-[48px] border border-dashed border-[#2D2A26]">
                <Megaphone className="w-16 h-16 text-[#6A685F] mb-6 opacity-40 mx-auto" />
                <p className="text-[#D2CEBE] font-light">Belum ada pengumuman untuk ditampilkan.</p>
             </div>
          ) : (
            data.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group bg-[#1C1A17] border ${item.pin ? "border-[#EAC956]/50" : "border-[#2D2A26]"} rounded-[48px] overflow-hidden hover:bg-[#2B2A23] transition-all relative flex flex-col shadow-2xl`}
              >
                {item.pin && (
                  <div className="absolute top-6 left-6 bg-[#EAC956] text-[#3A2E00] px-4 py-1 rounded-full text-[10px] font-bold flex items-center gap-2 z-10 shadow-lg animate-pulse">
                    <Pin className="w-3 h-3" /> ULTIMATE PIN
                  </div>
                )}

                {/* Cover Image */}
                <div className="h-56 w-full relative overflow-hidden bg-black/40">
                   {item.gambarUrls && item.gambarUrls.length > 0 ? (
                      <img src={item.gambarUrls[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <Bell className="w-16 h-16 text-[#2D2A26]" />
                      </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A17] via-transparent to-transparent" />
                   
                   {item.gambarUrls && item.gambarUrls.length > 1 && (
                      <div className="absolute bottom-4 right-6 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#EAC956] border border-white/5">
                         +{item.gambarUrls.length - 1} Gambar
                      </div>
                   )}
                </div>

                <div className="p-8 flex-1 flex flex-col">
                   <div className="flex items-center gap-3 mb-6">
                      <span className="text-[10px] font-bold text-[#EAC956] bg-[#EAC956]/10 px-3 py-1 rounded-lg border border-[#EAC956]/20 uppercase tracking-widest">{item.kategori}</span>
                      <span className="text-[10px] text-[#6A685F] font-bold uppercase tracking-tighter shrink-0">{formatTanggal(item.createdAt)}</span>
                   </div>
                   
                   <h3 className="text-2xl text-white mb-6 font-normal group-hover:text-[#EAC956] transition-colors line-clamp-2 h-14 leading-tight">{item.judul}</h3>
                   <p className="text-[#D2CEBE] font-light leading-relaxed line-clamp-3 mb-8" dangerouslySetInnerHTML={{ __html: renderContent(item.konten) }} />
                   
                   <div className="mt-auto pt-8 border-t border-[#2D2A26] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-[#EAC956]/10 flex items-center justify-center text-[#EAC956] text-xs font-bold border border-[#EAC956]/20">
                            {item.diubahOleh?.[0] || 'A'}
                         </div>
                         <span className="text-[10px] text-[#6A685F] font-bold uppercase">{item.diubahOleh}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="text-[#EAC956] hover:text-white flex items-center gap-2 transition-colors font-bold text-xs tracking-widest"
                      >
                         Buka Detail <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-[#111111]/95 backdrop-blur-xl" />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 50 }}
               className="bg-[#1C1A17] border border-[#2D2A26] w-full max-w-5xl rounded-[48px] p-8 lg:p-12 relative z-10 shadow-3xl overflow-y-auto max-h-[92vh] scrollbar-hide"
             >
                <div className="flex justify-between items-center mb-12">
                   <div>
                      <h2 className="text-4xl text-white font-normal mb-2">Penerbitan Pengumuman</h2>
                      <p className="text-[#6A685F] text-sm">Informasi ini akan langsung dipublikasikan ke portal publik.</p>
                   </div>
                   <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#6A685F] hover:text-white transition-all ring-1 ring-white/5">
                     <X className="w-7 h-7" />
                   </button>
                </div>

                <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <label className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#EAC956] ml-2">Subjek Pengumuman</label>
                         <input 
                           required value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})}
                           placeholder="Contoh: Perpanjangan Beasiswa Prestasi"
                           className="w-full h-16 bg-black/30 border border-[#2D2A26] rounded-3xl px-8 text-white focus:outline-none focus:border-[#EAC956]/50 transition-all text-xl" 
                         />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-3">
                           <label className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#EAC956] ml-2">Klasifikasi</label>
                           <select 
                             value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                             className="w-full h-16 bg-black/30 border border-[#2D2A26] rounded-3xl px-6 text-white focus:outline-none focus:border-[#EAC956]/50 transition-all cursor-pointer appearance-none"
                           >
                              <option value="Akademik" className="bg-[#1C1A17]">Akademik</option>
                              <option value="Beasiswa" className="bg-[#1C1A17]">Beasiswa</option>
                              <option value="Event" className="bg-[#1C1A17]">Event</option>
                              <option value="Umum" className="bg-[#1C1A17]">Umum</option>
                           </select>
                         </div>
                         <div className="space-y-3">
                           <label className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#EAC956] ml-2">Akses Cepat</label>
                           <button 
                             type="button" onClick={() => setFormData({...formData, pin: !formData.pin})}
                             className={`w-full h-16 border rounded-3xl px-6 flex items-center justify-between transition-all ${formData.pin ? "bg-[#EAC956]/20 border-[#EAC956] text-[#EAC956] shadow-[0_0_20px_rgba(234,201,86,0.1)]" : "bg-black/30 border-[#2D2A26] text-[#6A685F]"}`}
                           >
                              <span className="font-bold text-sm tracking-tight">SEMATKAN (PIN)</span>
                              <Pin className={`w-5 h-5 ${formData.pin ? "animate-bounce" : "opacity-30"}`} />
                           </button>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between px-2">
                           <label className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#EAC956]">Detail Informasi</label>
                           <div className="flex gap-2">
                              <button type="button" onClick={() => insertFormatting("**", "**")} className="p-2 rounded-lg bg-white/5 hover:bg-[#EAC956] hover:text-[#3A2E00] transition-colors text-[#6A685F]"><Bold className="w-4 h-4" /></button>
                              <button type="button" onClick={() => insertFormatting("*", "*")} className="p-2 rounded-lg bg-white/5 hover:bg-[#EAC956] hover:text-[#3A2E00] transition-colors text-[#6A685F]"><Italic className="w-4 h-4" /></button>
                              <button type="button" onClick={() => insertFormatting("- ", "")} className="p-2 rounded-lg bg-white/5 hover:bg-[#EAC956] hover:text-[#3A2E00] transition-colors text-[#6A685F]"><List className="w-4 h-4" /></button>
                           </div>
                         </div>
                         <textarea 
                           ref={textareaRef} required rows={10} value={formData.konten} onChange={(e) => setFormData({...formData, konten: e.target.value})}
                           placeholder="Ketik detail isi pengumuman di sini..."
                           className="w-full bg-black/30 border border-[#2D2A26] rounded-[40px] p-8 text-white focus:outline-none focus:border-[#EAC956]/50 transition-all resize-none font-light leading-[1.8] text-lg scrollbar-hide" 
                         />
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-4">
                         <label className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#EAC956] ml-2 flex items-center justify-between">
                            Galeri Gambar (Max 8)
                            <span className="text-[10px] text-[#6A685F] font-bold">{formData.gambarUrls.length}/8</span>
                         </label>
                         
                         <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-6 bg-black/30 border border-[#2D2A26] rounded-[40px] min-h-[300px]">
                            {formData.gambarUrls.map((url, idx) => (
                               <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border border-white/5">
                                  <img src={url} className="w-full h-full object-cover" />
                                  <button 
                                    type="button" 
                                    onClick={() => setFormData(p => ({ ...p, gambarUrls: p.gambarUrls.filter((_, i) => i !== idx)}))}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            ))}
                            {formData.gambarUrls.length < 8 && (
                               <label className="aspect-square rounded-2xl border-2 border-dashed border-[#2D2A26] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all text-[#6A685F] hover:text-[#EAC956] hover:border-[#EAC956]/30">
                                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleUploadClick} />
                                  <Upload className="w-8 h-8 mb-1" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Unggah</span>
                               </label>
                            )}
                         </div>
                         <div className="bg-[#2B2A23]/50 p-6 rounded-3xl border border-[#2D2A26] flex gap-4">
                            <AlertCircle className="w-6 h-6 text-[#EAC956] shrink-0" />
                            <p className="text-xs text-[#D2CEBE] leading-relaxed">Format gambar didukung: JPG, PNG, WEBP. Ukuran maksimal per file adalah 2MB. Gambar pertama akan menjadi sampul utama.</p>
                         </div>
                      </div>

                      <div className="pt-4">
                         <Button 
                          type="submit" disabled={isSubmitting}
                          className="w-full h-20 bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-[36px] font-extrabold flex items-center justify-center gap-4 text-2xl shadow-3xl transition-all disabled:opacity-50"
                         >
                           {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Plus className="w-8 h-8" /> TERBITKAN SEKARANG</>}
                         </Button>
                      </div>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} className="fixed inset-0 bg-[#000000]/98 backdrop-blur-2xl" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
               className="w-full max-w-7xl rounded-[64px] bg-[#14130F] border border-white/5 relative z-10 shadow-3xl overflow-hidden flex flex-col max-h-[95vh]"
             >
                <div className="flex-1 overflow-y-auto p-12 lg:p-24 scrollbar-hide">
                   <button onClick={() => setSelectedItem(null)} className="fixed top-12 right-12 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all z-50 ring-1 ring-white/10 hover:bg-[#EAC956] hover:text-black">
                     <X className="w-8 h-8" />
                   </button>

                   <div className="max-w-4xl mx-auto">
                      <div className="flex items-center gap-4 mb-8">
                        <span className="text-xs font-bold text-[#3A2E00] bg-[#EAC956] px-5 py-2 rounded-full uppercase tracking-[0.2em]">{selectedItem.kategori}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="text-xs text-white/40 font-bold uppercase">{formatTanggal(selectedItem.createdAt)}</span>
                      </div>

                      <h2 className="text-6xl lg:text-7xl text-white font-normal mb-16 tracking-tight leading-tight">{selectedItem.judul}</h2>

                      {selectedItem.gambarUrls && selectedItem.gambarUrls.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                          {selectedItem.gambarUrls.map((url: string, i: number) => (
                             <div key={i} className={cn("rounded-[48px] overflow-hidden border border-white/5 shadow-2xl bg-black/40", i === 0 && selectedItem.gambarUrls.length % 2 !== 0 ? "md:col-span-2" : "col-span-1")}>
                                <img src={url} alt={selectedItem.judul} className="w-full h-auto object-cover max-h-[700px] hover:scale-105 transition-transform duration-1000" />
                             </div>
                          ))}
                        </div>
                      )}

                      <div className="text-3xl text-[#D2CEBE] font-light leading-[1.8] whitespace-pre-wrap mb-24 announcement-content" dangerouslySetInnerHTML={{ __html: renderContent(selectedItem.konten) }} />
                      
                      <div className="border-t border-white/5 pt-16 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-[#EAC956] flex items-center justify-center text-black text-2xl font-bold">
                               {selectedItem.diubahOleh?.[0]}
                            </div>
                            <div>
                               <p className="text-[#6A685F] text-xs font-bold uppercase tracking-widest mb-1">Diterbitkan Oleh</p>
                               <p className="text-white text-xl font-medium">{selectedItem.diubahOleh}</p>
                            </div>
                         </div>
                         <Button onClick={() => setSelectedItem(null)} className="h-16 rounded-full px-12 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-white font-bold text-lg transition-all">Tutup Informasi</Button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .announcement-content strong { color: white; font-weight: 700; }
        .announcement-content em { color: #EAC956; font-style: italic; }
        .announcement-content li { margin-left: 1.5rem; list-style-type: disc; margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
