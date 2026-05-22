import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 container mx-auto max-w-4xl">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-400 font-medium tracking-tight uppercase leading-relaxed">
        <p>Effective Date: May 15, 2026</p>
        
        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">1. Data Collection</h2>
          <p>MADECC Group collects information relevant to project management and recruitment. This includes name, email, phone number, and professional qualifications when you submit an inquiry or job application via our portal.</p>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">2. Use of Information</h2>
          <p>The information collected is used solely to respond to inquiries, provide construction quotes, and manage existing client relationships. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">3. Data Security</h2>
          <p>We utilize the MADECC Executive Command System, a hardened structural monitoring terminal, to secure all communication and project data. We maintain rigorous encryption standards across all digital nodes.</p>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">4. Cookies</h2>
          <p>Our website uses minimal cookies to enhance navigation and remember your language preferences (English/French). You can disable cookies in your browser settings if you wish.</p>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">5. Contact</h2>
          <p>If you have any questions regarding your data, please contact our Data Protection Officer at <span id="privacy-email" className="font-black text-[#F26A36]">madecccons@gmail.com</span>.</p>
        </section>
      </div>
    </div>
  );
};
