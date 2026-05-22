import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Building2, Menu, X, Globe, Moon, Sun, ChevronDown } from 'lucide-react';
import { FloatingActions } from './FloatingActions';

export const PublicLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('madecc-theme');
    return saved ? saved === 'dark' : true;
  });
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('madecc-theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('madecc-theme', 'light');
    }
  }, [isDarkMode]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.blog'), path: '/blog' },
    { 
      name: t('nav.services'), 
      path: '/services', 
      dropdown: ['Residential', 'Commercial', 'Industrial', 'Civil Engineering'] 
    },
    { 
      name: t('nav.projects'), 
      path: '/projects', 
      dropdown: ['Ongoing', 'Completed'] 
    },
    { name: t('nav.portfolio'), path: '/portfolio' },
    { name: t('nav.careers'), path: '/careers' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0F12] transition-colors duration-300">
      <Helmet>
        <title>MADECC GROUP | Leading Construction & Civil Engineering in Central Africa</title>
        <meta name="description" content="MADECC Group is a premier construction and civil engineering firm specializing in high-rise infrastructure, sustainable development, and industrial project management in Yaoundé and across Central Africa." />
        <meta name="keywords" content="MADECC, Construction, Yaoundé, Civil Engineering, High-Rise Buildings, Infrastructure, Cameroon, Project Management, Sustainable Development, Skyscrapers" />
        <meta property="og:title" content="MADECC GROUP | Construction Excellence" />
        <meta property="og:description" content="Pioneering infrastructure developments and sustainable skyscraper construction across Central Africa." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#0D0F12]/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#F26A36] p-1.5 rounded-lg shadow-lg">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">MADECC GROUP</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link 
                  to={link.path} 
                  className={`text-sm font-bold uppercase tracking-widest ${location.pathname === link.path ? 'text-[#F26A36]' : 'text-slate-600 dark:text-slate-400'} hover:text-[#F26A36] transition-colors flex items-center gap-1`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown size={14} className="opacity-50" />}
                </Link>
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#161920] rounded-xl shadow-2xl border border-slate-100 dark:border-[#262B37] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2 z-50">
                    {link.dropdown.map(item => (
                      <Link key={item} to={`${link.path}/${item.toLowerCase().replace(' ', '-')}`} className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#0D0F12] hover:text-[#F26A36] rounded-lg transition-all">
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#161920] text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              type="button"
              onClick={() => {
                const currentLang = i18n.resolvedLanguage || i18n.language || 'en';
                const newLang = currentLang.startsWith('en') ? 'fr' : 'en';
                i18n.changeLanguage(newLang);
              }} 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#161920] text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1 font-bold text-xs"
              aria-label="Toggle language"
            >
              <Globe size={18} />
              {(i18n.resolvedLanguage || i18n.language || 'EN').split('-')[0].toUpperCase()}
            </button>
            <Link to="/terminal" className="hidden sm:block px-6 py-2 bg-[#F26A36] text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-[#ff7b4b] transition-all shadow-lg shadow-[#F26A36]/20">
              {t('nav.terminal')}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-900 dark:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 bg-white dark:bg-[#0D0F12] pt-24 px-6"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                  {link.name}
                </Link>
              ))}
              <Link to="/terminal" onClick={() => setIsMenuOpen(false)} className="w-full py-4 bg-[#F26A36] text-white text-center font-black uppercase tracking-widest rounded-xl">
                 {t('nav.terminal')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-[#161920] py-20 border-t border-slate-200 dark:border-[#262B37]">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#F26A36] p-1 rounded">
                <Building2 className="text-white" size={18} />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">MADECC GROUP</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400 dark:text-slate-600">{t('footer.company')}</h4>
            <ul className="space-y-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
              <li><Link to="/about" className="hover:text-[#F26A36] transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/portfolio" className="hover:text-[#F26A36] transition-colors">{t('nav.portfolio')}</Link></li>
              <li><Link to="/blog" className="hover:text-[#F26A36] transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/careers" className="hover:text-[#F26A36] transition-colors">{t('nav.careers')}</Link></li>
              <li><Link to="/services" className="hover:text-[#F26A36] transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/contact" className="hover:text-[#F26A36] transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400 dark:text-slate-600">{t('footer.offices')}</h4>
            <ul className="space-y-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
              <li>Yaoundé, Central</li>
              <li>Yaoundé, Bastos</li>
              <li>Kribi, Port Phase II</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400 dark:text-slate-600">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-xs font-bold text-slate-600 dark:text-slate-400">
              <li>madecccons@gmail.com</li>
              <li>+237 671 063 511</li>
              <li>+237 683 316 486</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-[#262B37] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">© 2026 MADECC GROUP. {t('footer.rights')}</p>
          <div className="flex gap-6 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
            <Link to="/privacy" className="hover:text-[#F26A36] transition-colors">{t('nav.privacy')}</Link>
            <Link to="/terms" className="hover:text-[#F26A36] transition-colors">{t('nav.terms')}</Link>
          </div>
        </div>
      </footer>

      <FloatingActions />
    </div>
  );
};
