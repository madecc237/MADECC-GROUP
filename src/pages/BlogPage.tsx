import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, ArrowRight, ShieldCheck, X, Plus, Edit2, Upload, Trash2, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';

export const BlogPage: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPost, setSelectedPost] = React.useState<any | null>(null);
  const [subscribed, setSubscribed] = React.useState(false);
  const [email, setEmail] = React.useState('');
  
  // Admin Mode states
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState<any>({ title: '', content: '', author: '', category: 'Innovation', img: '' });
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Check if user is authorized via session storage or similar
    // Since App.tsx manages state, but BlogPage is in PublicLayout, we might need to check if they have a key
    const hasKey = localStorage.getItem('madecc_session_key');
    if (hasKey) setIsAdmin(true);

    const q = query(collection(db, 'web_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setEditForm({ ...editForm, img: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const savePost = async () => {
    if (!editForm.title || !editForm.content) return alert('Protocol Error: Incomplete manifest.');
    
    try {
      const payload = {
        ...editForm,
        updatedAt: serverTimestamp(),
      };

      if (editForm.id) {
        await updateDoc(doc(db, 'web_posts', editForm.id), payload);
      } else {
        await addDoc(collection(db, 'web_posts'), {
          ...payload,
          createdAt: serverTimestamp(),
          author: editForm.author || 'MADECC Executive',
        });
      }
      setIsEditing(false);
      setEditForm({ title: '', content: '', author: '', category: 'Innovation', img: '' });
      setImagePreview(null);
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  const deletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to purge this record from public access?')) {
      try {
        await deleteDoc(doc(db, 'web_posts', id));
      } catch (err) {
        console.error('Purge failed:', err);
      }
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <div className="pt-32 pb-20 relative">
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161920] border border-[#F26A36]/30 rounded-[2.5rem] p-8 max-w-3xl w-full space-y-6 shadow-2xl my-8"
            >
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                    {editForm.id ? 'Modify Public Intel' : 'New Knowledge Node'}
                  </h3>
                  <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500">Node Headline</label>
                      <input 
                        type="text" 
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-4 text-sm text-white focus:border-[#F26A36] focus:outline-none"
                        placeholder="Future-Proofing..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500">Analysis Categorization</label>
                      <select 
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-4 text-sm text-white focus:border-[#F26A36] focus:outline-none"
                      >
                        <option>Innovation</option>
                        <option>Sustainability</option>
                        <option>Safety</option>
                        <option>Internal</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 flex justify-between">
                      Visual Signature (Thumbnail)
                      {imagePreview && <button onClick={() => { setImagePreview(null); setEditForm({...editForm, img: ''}); }} className="text-[#F26A36] hover:underline">Purge Image</button>}
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-[124px] border-2 border-dashed border-[#262B37] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#F26A36]/50 transition-all relative overflow-hidden group"
                    >
                      {imagePreview || editForm.img ? (
                        <img src={imagePreview || editForm.img} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <>
                          <Camera size={24} className="text-slate-700 mb-2" />
                          <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Transmit Imagery</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className="hidden" 
                        accept="image/*" 
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Technical Briefing (Content)</label>
                  <textarea 
                    rows={8}
                    value={editForm.content}
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-4 text-sm text-white font-mono focus:border-[#F26A36] focus:outline-none"
                    placeholder="Deep analysis goes here..."
                  ></textarea>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={savePost}
                    className="flex-1 py-4 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#F26A36]/20 transition-all hover:scale-[1.02]"
                  >
                    Commit to Public Chain
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-[#262B37] hover:bg-white/10"
                  >
                    Abort
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}

        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161920] border border-[#F26A36]/30 rounded-[2.5rem] p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-[#F26A36]/10 rounded-full flex items-center justify-center mx-auto text-[#F26A36]">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">
                  {selectedPost.title}
                </h3>
                <div className="flex justify-center gap-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  <span>{selectedPost.createdAt?.toDate ? selectedPost.createdAt.toDate().toLocaleDateString() : selectedPost.date || 'Live Transmission'}</span>
                  <span>{selectedPost.author}</span>
                </div>
                
                {selectedPost.img && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-[#262B37]">
                    <img src={selectedPost.img} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="h-px w-20 bg-[#F26A36]/30 mx-auto" />
                <div className="text-slate-400 font-medium text-sm leading-relaxed text-left max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                  {selectedPost.content ? (
                    <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                  ) : (
                    <p>
                      This technical briefing is currently under classification. Our structural signature requires deep dives into {selectedPost.category?.toLowerCase() || 'engineering'} methodologies that are proprietary to MADECC. 
                      <br /><br />
                      To request the full 45-page PDF audit including stress-test data and BIM models, please coordinate with our communications triage at <span className="text-[#F26A36]">madecccons@gmail.com</span> with reference "AUDIT-{selectedPost.id}-2026".
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="w-full py-4 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl"
              >
                Acknowledge Data
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="container mx-auto px-6 mb-20 flex justify-between items-end">
        <div>
          <motion.h2 
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26A36] mb-4"
          >
            {t('blog.subtitle')}
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-8 uppercase"
          >
            {t('blog.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight max-w-xl"
          >
            {t('blog.description')}
          </motion.p>
        </div>

        {isAdmin && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              setEditForm({ title: '', content: '', author: '', category: 'Innovation', img: '' });
              setImagePreview(null);
              setIsEditing(true);
            }}
            className="px-8 py-4 bg-white dark:bg-[#161920] border border-[#F26A36]/30 text-[#F26A36] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[#F26A36] hover:text-white transition-all flex items-center gap-3"
          >
            <Plus size={16} /> Init New Feed
          </motion.button>
        )}
      </section>

      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map((post, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={post.id}
            className="group cursor-pointer relative"
          >
            {isAdmin && (
              <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={(e) => { e.stopPropagation(); setEditForm(post); setImagePreview(post.img); setIsEditing(true); }}
                  className="p-3 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-[#F26A36] transition-colors shadow-xl"
                 >
                    <Edit2 size={16} />
                 </button>
                 <button 
                  onClick={(e) => { e.stopPropagation(); deletePost(post.id); }}
                  className="p-3 bg-red-600/60 backdrop-blur-md rounded-xl text-white hover:bg-red-600 transition-colors shadow-xl"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>
            )}
            <div onClick={() => setSelectedPost(post)}>
              <div className="h-64 rounded-3xl overflow-hidden mb-6 relative">
                <img 
                  src={post.img || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800'} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-[#0D0F12]/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-[#F26A36] tracking-widest">{post.category}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    <div className="flex items-center gap-1"><Calendar size={12} /> {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : post.date || 'Live'}</div>
                    <div className="flex items-center gap-1"><User size={12} /> {post.author}</div>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-[#F26A36] transition-colors leading-[1.1]">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed line-clamp-3">
                  {post.content}
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F26A36] hover:gap-4 transition-all pt-2"
                >
                  {t('blog.readMore')} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && <div className="col-span-full py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing with Mainframe...</div>}
      </section>

      {/* Newsletter / AdSense Friendly Block */}
      <section className="mt-32 border-t border-slate-100 dark:border-[#262B37] py-24">
        <div className="container mx-auto px-6 bg-slate-50 dark:bg-[#161920] rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
              {t('blog.weeklyBrief')}
            </h3>
            <p className="text-slate-500 font-medium uppercase tracking-tight italic">
              {t('blog.subscribeDesc')}
            </p>
          </div>
          <div className="w-full md:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 placeholder="ADMIN@MADECC.COM" 
                 className="px-8 py-5 bg-white dark:bg-[#0D0F12] border border-slate-200 dark:border-[#262B37] rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#F26A36]" 
               />
               <button 
                type="submit"
                className="px-10 py-5 bg-[#F26A36] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#F26A36]/20 hover:scale-105 active:scale-95 transition-all"
               >
                 {subscribed ? t('blog.subscribed') : t('blog.subscribe')}
               </button>
            </form>
            {subscribed && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-[10px] font-black text-[#F26A36] uppercase tracking-widest"
              >
                {t('blog.accessGranted')}
              </motion.p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
