import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 container mx-auto max-w-4xl">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">Terms of Service</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-400 font-medium tracking-tight uppercase leading-relaxed">
        <p>Effective Date: May 15, 2026</p>
        
        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
          <p>By accessing the MADECC Group portal, you agree to comply with these terms. Our services involve high-stakes engineering and construction management. All technical data provided on this site is for informational purposes until a formal contract is signed.</p>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">2. Intellectual Property</h2>
          <p>All structural designs, BIM models, and architectural concepts displayed are the exclusive property of MADECC Group SARL. Unauthorized reproduction is strictly prohibited.</p>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">3. Limitation of Liability</h2>
          <p>MADECC Group is not liable for structural failures resulting from unauthorized modifications to our designs by third-party contractors not under our direct supervision.</p>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">4. Governing Law</h2>
          <p>These terms are governed by the laws of the Republic of Cameroon. Any disputes shall be resolved in the courts of Yaoundé.</p>
        </section>

        <section>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">5. Modifications</h2>
          <p>We reserve the right to update these terms to reflect evolving construction regulations and digital security standards.</p>
        </section>
      </div>
    </div>
  );
};
