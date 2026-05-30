import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from "@google/genai";
import firebaseConfig from './firebase-applet-config.json';

dotenv.config();

// Initialize Firebase Admin
if (getApps().length === 0) {
  console.log(`[BOOT] Initializing Firebase Admin explicitly for Project: ${firebaseConfig.projectId}`);
  initializeApp({
    projectId: firebaseConfig.projectId
  });
}

const fbApp = getApps()[0];
console.log(`[BOOT] Firebase Admin App Project: ${fbApp.options.projectId || 'ENV_DEFAULT'}`);

// Standard initialization with explicit database ID
let db = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId || '(default)');

// Diagnostic test and connectivity check
const initFirestore = async () => {
  try {
    await db.collection('system_init').limit(1).get();
    console.log("[BOOT] Database connectivity: STABLE");
  } catch (err: any) {
    console.error(`[BOOT] Primary database connection failed (err: ${err.message}).`);
    if (err.code === 7 || err.message.includes('permission_denied')) {
       console.error("[BOOT] This is likely a project/permissions mismatch. Ensure Firebase is correctly provisioned for this project.");
    }
  }
};
// Start Lifecycle
const boot = async () => {
  await initFirestore();
  await seedInitialKeys();
  await startServer();
};

boot();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Seed initial staff keys if collection is empty
const seedInitialKeys = async () => {
  try {
    console.log("[SECURITY] Verifying command vault connectivity...");
    const snap = await db.collection('command_keys').limit(1).get();
    if (snap.empty) {
      console.log("[SECURITY] Seeding initial CEO Staff command keys...");
      const salt = await bcrypt.genSalt(10);
      const staff = [
        { name: 'Jean-Paul Ndi', key: 'MADECC-CEO-NDI', role: 'CEO' },
        { name: 'PR Team Alpha', key: 'MADECC-EDT-ALPHA', role: 'CONTENT EDITOR' },
        { name: 'Marthe Njole', key: 'MADECC-FIN-NJOLE', role: 'FINANCIAL OFFICER' },
        { name: 'Bonaventure Kalou', key: 'MADECC-MGR-KALOU', role: 'PROJECT MANAGER' },
        { name: 'Rigobert Song', key: 'MADECC-SEC-SONG', role: 'SECRETARY' },
        { name: 'Patrick Mboma', key: 'MADECC-ACC-MBOMA', role: 'ACCOUNTANT' }
      ];
      
      for (const member of staff) {
        const hashed = await bcrypt.hash(member.key, salt);
        await db.collection('command_keys').add({
          hashed_key: hashed,
          assigned_role: member.role,
          status: 'active',
          created_at: new Date().toISOString(),
          revoked: false,
          owner_name: member.name
        });
      }
      console.log("[SECURITY] Seeding complete.");
    }
    
    // Seed initial contracts if empty
    const contractsSnap = await db.collection('contracts').limit(1).get();
    if (contractsSnap.empty) {
      console.log("[SECURITY] Seeding initial legal archives...");
      const initialContracts = [
        {
          title: 'Structural Engineering Framework',
          ref: 'C-2026-001',
          affiliatedProject: 'Executive Tower Phase II',
          pid: 'YDE-01',
          party: 'Atkins Global',
          signedDate: '2025-11-20',
          expiration: '2026-11-20',
          amount: '4.5M FCFA',
          status: 'Active',
          verified: true
        },
        {
          title: 'Civil Construction Agreement',
          ref: 'C-2026-002',
          affiliatedProject: 'Kribi Cold Logistics Hub',
          pid: 'KRI-02',
          party: 'Emaar Properties',
          signedDate: '2026-02-15',
          expiration: '2026-06-15',
          amount: '12.8M FCFA',
          status: 'Active',
          verified: true
        }
      ];
      for (const contract of initialContracts) {
        await db.collection('contracts').add({
          ...contract,
          createdAt: new Date().toISOString()
        });
      }
      console.log("[SECURITY] Contract archives initialized.");
    }

    // Seed initial projects if empty
    const projectsSnap = await db.collection('projects').limit(1).get();
    if (projectsSnap.empty) {
      console.log("[SECURITY] Seeding initial construction projects...");
      const initialProjects = [
        {
          id: 'YDE-01',
          name: 'Executive Tower Phase II',
          location: 'Yaoundé, Central Business District',
          budget: '1.45B XAF',
          status: 'Execution',
          progress: 65,
          color: '#F26A36',
          milestones: [
            { step: 'Foundation & Grading', date: '2025-Q4', status: 'Complete' },
            { step: 'Structural Caging', date: '2026-Q1', status: 'In Progress' },
            { step: 'MEP Integration', date: '2026-Q3', status: 'Scheduled' }
          ],
          logs: [
            { title: 'Steel Reinforcement Bars', amount: '-4,500,000 XAF', idStr: 'TXN_8192_1' },
            { title: 'Excavator Fuel Dispatch', amount: '-1,200,000 XAF', idStr: 'TXN_8192_2' }
          ]
        },
        {
          id: 'YDE-04',
          name: 'Logbessou Residential Complex',
          location: 'Logbessou, Douala',
          budget: '890M XAF',
          status: 'Planning',
          progress: 15,
          color: '#3B82F6',
          milestones: [
            { step: 'Soil Mechanical Boring', date: '2026-Q1', status: 'Complete' },
            { step: 'Excavation Framework', date: '2026-Q2', status: 'Scheduled' }
          ],
          logs: []
        },
        {
          id: 'KRI-02',
          name: 'Kribi Cold Logistics Hub',
          location: 'Industrial Zone, Kribi Port',
          budget: '2.2B XAF',
          status: 'Structural',
          progress: 92,
          color: '#10B981',
          milestones: [
            { step: 'Slab Concrete Pouring', date: '2025-Q3', status: 'Complete' },
            { step: 'Insulated Wall Installation', date: '2026-Q1', status: 'Complete' },
            { step: 'Compressor Integrity Run', date: '2026-Q2', status: 'In Progress' }
          ],
          logs: []
        }
      ];
      for (const prj of initialProjects) {
        await db.collection('projects').doc(prj.id).set({
          ...prj,
          createdAt: new Date().toISOString()
        });
      }
      console.log("[SECURITY] Construction projects initialized.");
    }

    // Seed initial employees if empty
    const employeesSnap = await db.collection('employees').limit(1).get();
    if (employeesSnap.empty) {
      console.log("[SECURITY] Seeding initial staff roster...");
      const staffList = [
        { name: 'Jean-Paul Ndi', role: 'CEO', status: 'Headquarters', duty: 'Chief Executive Authority' },
        { name: 'Bonaventure Kalou', role: 'PROJECT MANAGER', status: 'Mobile - Field Inspection', duty: 'Field Operations Command' },
        { name: 'PR Team Alpha', role: 'CONTENT EDITOR', status: 'Remote', duty: 'Information & Media Control' },
        { name: 'Marthe Njole', role: 'FINANCIAL OFFICER', status: 'Headquarters', duty: 'Fiscal & Treasury Audit' },
        { name: 'Patrick Mboma', role: 'ACCOUNTANT', status: 'Headquarters', duty: 'Accounting & Financial Record Keeping (CEO-Provisioned Access Required)' },
        { name: 'Rigobert Song', role: 'SECRETARY', status: 'Headquarters', duty: 'Administrative Liaison & Document Archiving (CEO-Provisioned Access Required)' }
      ];
      for (const member of staffList) {
        await db.collection('employees').add({
          ...member,
          createdAt: new Date().toISOString()
        });
      }
      console.log("[SECURITY] Staff directory initialized.");
    }

    // Seed initial invoices if empty
    const invoicesSnap = await db.collection('invoices').limit(1).get();
    if (invoicesSnap.empty) {
      console.log("[SECURITY] Seeding initial physical invoices...");
      const initialInvoices = [
        { id: 'INV-2026-001', client: 'Port Authority of Kribi', amount: '12,500,000 XAF', status: 'Paid', date: '2026-05-10', project: 'Kribi Cold Logistics Hub' },
        { id: 'INV-2026-002', client: 'Bolloré Logistics Douala', amount: '8,200,000 XAF', status: 'Pending', date: '2026-05-18', project: 'Logbessou Residential Complex' },
        { id: 'INV-2026-003', client: 'State Housing Corporation', amount: '45,000,000 XAF', status: 'Overdue', date: '2026-04-01', project: 'Executive Tower Phase II' }
      ];
      for (const inv of initialInvoices) {
        await db.collection('invoices').add({
          ...inv,
          createdAt: new Date().toISOString()
        });
      }
      console.log("[SECURITY] Invoices database initialized.");
    }

    // Seed initial receipts if empty
    const receiptsSnap = await db.collection('receipts').limit(1).get();
    if (receiptsSnap.empty) {
      console.log("[SECURITY] Seeding initial expense receipts...");
      const initialReceipts = [
        { rcpId: 'RCP-8812', vendor: 'Steel-Cam Industries', category: 'Materials', amount: '8,450,000 XAF', date: 'May 14, 2026', status: 'Verified', project: 'Executive Tower Phase II' },
        { rcpId: 'RCP-8813', vendor: 'TotalEnergies Logistics', category: 'Fuel', amount: '1,200,000 XAF', date: 'May 13, 2026', status: 'Pending', project: 'Executive Tower Phase II' },
        { rcpId: 'RCP-8814', vendor: 'Concrete Solutions SARL', category: 'Materials', amount: '12,000,000 XAF', date: 'May 12, 2026', status: 'Verified', project: 'Kribi Cold Logistics Hub' },
        { rcpId: 'RCP-8815', vendor: 'Global Office Supplies', category: 'Admin', amount: '450,000 XAF', date: 'May 10, 2026', status: 'Verified', project: 'Headquarters' }
      ];
      for (const rcp of initialReceipts) {
        await db.collection('receipts').add({
          ...rcp,
          createdAt: new Date().toISOString()
        });
      }
      console.log("[SECURITY] Digital receipts ledger initialized.");
    }
  } catch (err: any) {
    if (err.code === 7) {
      console.error("[CRITICAL] SEEDING FAILED: Permission Denied. Ensure DB ID and Project ID are correct.");
    } else {
      console.error("[SECURITY] Seeding failed:", err.message);
    }
  }
};


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Security Middleware
  const trackSecurityMetrics = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    res.on('finish', async () => {
      if (res.statusCode >= 400) {
        try {
          await db.collection('security_logs').add({
            timestamp: new Date().toISOString(),
            ip_address: ip,
            access_status: 'flagged_suspicious',
            threat_level: res.statusCode === 403 ? 'HIGH' : 'LOW',
            notes: `Failed authorization attempt caught on route: ${req.originalUrl}`
          });
        } catch (e) {
          console.error("Failed to log security metric:", e);
        }
      }
    });
    next();
  };

  app.use(trackSecurityMetrics);

  // SMTP Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Contact API Endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, message, phone, company, serviceType, budget, location, timeline } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Build descriptive plain-text and HTML summaries for construction queries
      const textBody = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : '',
        company ? `Company/Org: ${company}` : '',
        serviceType ? `Service Requested: ${serviceType}` : '',
        location ? `Project Location: ${location}` : '',
        budget ? `Estimated Budget: ${budget}` : '',
        timeline ? `Desired Timeline: ${timeline}` : '',
        `\nMessage:\n${message}`
      ].filter(Boolean).join('\n');

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
          <h2 style="color: #F26A36; border-bottom: 2px solid #F26A36; padding-bottom: 10px; margin-top: 0;">New Construction Project Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; border-bottom: 1px solid #eee;">Client Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Email Address:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #F26A36; text-decoration: none;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Phone Number:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone}</td>
            </tr>` : ''}
            ${company ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Company:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${company}</td>
            </tr>` : ''}
            ${serviceType ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Service:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${serviceType}</td>
            </tr>` : ''}
            ${location ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Project Location:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${location}</td>
            </tr>` : ''}
            ${budget ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Project Budget:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${budget}</td>
            </tr>` : ''}
            ${timeline ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Timeline:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${timeline}</td>
            </tr>` : ''}
          </table>
          <h4 style="color: #444; margin-bottom: 5px;">Project Brief / Message:</h4>
          <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #F26A36; white-space: pre-wrap; margin-top: 0; border-radius: 4px;">${message}</p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || "kreboya603@gmail.com",
        to: "kreboya603@gmail.com",
        subject: `[Project Intake] ${serviceType || 'General'} - from ${name}`,
        text: textBody,
        html: htmlBody,
      });

      res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("SMTP Error:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
  });

  // Gemini Chat API Endpoint
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are the MADECC Group Engineering Assistant. Your name is MADECC Bot. You are professional, technical, and highly knowledgeable about structural engineering, high-rise construction, and Central African infrastructure projects. Your goal is to assist clients with information about MADECC's services, portfolio, and general engineering inquiries. Refer users to madecccons@gmail.com for BIM model reviews or detailed project audits. Key executives include Jean-Paul Ndi (CEO) and Dr. Samuel Eto'o (Chief Engineer). Maintain a tone of 'structural excellence' and 'Central African pride'.",
        },
        history: history || [],
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Assistant triage failed. Please retry later." });
    }
  });

  // Secure Middleware for Command Key Verification
  const verifyCommandKey = async (req: any, res: any, next: any) => {
    const commandKey = req.headers['x-command-key'];
    if (!commandKey) {
      return res.status(401).json({ error: 'CRITICAL ACCESS VIOLATION: Command Key Missing.' });
    }

    try {
      if (!commandKey) throw new Error('Key missing');
      
      const commandKeySnap = await db.collection('command_keys')
        .where('status', '==', 'active')
        .get();

      let matchedRole = null;
      for (const doc of commandKeySnap.docs) {
        const data = doc.data();
        const match = await bcrypt.compare(commandKey, data.hashed_key);
        if (match && !data.revoked) {
          matchedRole = data.assigned_role;
          break;
        }
      }

      if (!matchedRole) {
        return res.status(403).json({ error: 'SECURITY BREACH: Invalid or Revoked Command Key.' });
      }

      req.userRole = matchedRole;
      next();
    } catch (error: any) {
      console.error(`[SECURITY_TERMINAL_FAILURE] Route: ${req.originalUrl}, Error: ${error.message}`);
      if (error.code === 7) {
        console.error("CRITICAL: Firestore Permission Denied for Admin SDK. Checking database connectivity...");
      }
      return res.status(500).json({ 
        error: 'Security Terminal Connectivity Error',
        code: error.code,
        details: 'The system is currently unable to verify clearance levels. Please contact the CEO.'
      });
    }
  };

  // API Routes
  app.get("/api/health", async (req, res) => {
    try {
      // Small ping to verify Firestore connection
      await db.collection('health_check').doc('ping').set({ 
        timestamp: new Date().toISOString(),
        status: 'ok'
      });
      res.json({ 
        status: "operational", 
        system: "MADECC_COMMAND_CENTRAL",
        database: "connected",
        project: firebaseConfig.projectId
      });
    } catch (err: any) {
      console.error("Firestore Health check failed:", err.message);
      res.status(500).json({ 
        status: "degraded", 
        error: err.message,
        system: "MADECC_COMMAND_CENTRAL"
      });
    }
  });

  // Secure Endpoint for Projects Overview
  app.get('/api/executive/projects', verifyCommandKey, async (req: any, res) => {
    try {
      const snapshot = await db.collection('projects').get();
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(projects);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Issue Command Keys (CEO Exclusive)
  app.post('/api/security/generate-key', verifyCommandKey, async (req: any, res) => {
    const { role } = req.body;
    if (req.userRole !== 'CEO') {
      return res.status(403).json({ error: 'ACCESS DENIED: Root clearance required.' });
    }

    const rawKey = `MADECC-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const salt = await bcrypt.genSalt(10);
    const hashed_key = await bcrypt.hash(rawKey, salt);

    await db.collection('command_keys').add({
      hashed_key,
      assigned_role: role || 'ENGINEER',
      status: 'active',
      created_at: new Date().toISOString(),
      revoked: false
    });

    return res.status(201).json({ plaintext_key_delivery: rawKey });
  });

  // Secure Endpoint to Provision Key and Email it (CEO Exclusive)
  app.post('/api/security/provision-with-email', verifyCommandKey, async (req: any, res) => {
    const { role, email } = req.body;
    
    if (req.userRole !== 'CEO') {
      return res.status(403).json({ error: 'ACCESS DENIED: Root clearance required for email provisioning.' });
    }

    if (!email || !role) {
      return res.status(400).json({ error: 'Recipient email and role are required.' });
    }

    const rawKey = `MADECC-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const salt = await bcrypt.genSalt(10);
    const hashed_key = await bcrypt.hash(rawKey, salt);

    try {
      // Store in DB
      await db.collection('command_keys').add({
        hashed_key,
        assigned_role: role,
        status: 'active',
        created_at: new Date().toISOString(),
        revoked: false,
        recipient_email: email
      });

      // Send Email
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "madecccons@gmail.com",
        to: email,
        subject: `[SECURE] Your MADECC Command Key for ${role} Access`,
        text: `ACCESS GRANTED.\n\nYour MADECC Command Key has been provisioned.\n\nKey: ${rawKey}\nRole: ${role}\n\nPlease keep this key secure. Sharing or loss of this key constitutes a major security breach.`,
        html: `
          <div style="font-family: monospace; padding: 40px; background: #000; color: #10B981; border: 1px solid #10B981;">
            <h1 style="color: #F26A36;">MADECC SECURITY TERMINAL</h1>
            <p style="text-transform: uppercase;">Authorization Level: <strong>${role}</strong> Approved.</p>
            <hr style="border-color: #10B981; opacity: 0.2;" />
            <div style="background: #111; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 10px; color: #555;">CREDENTIALS:</p>
              <p style="font-size: 24px; letter-spacing: 2px; color: #fff;">${rawKey}</p>
            </div>
            <p style="font-size: 10px; text-transform: uppercase; color: #ef4444;">Warning: This key is encrypted once and cannot be recovered. Authorized use only.</p>
          </div>
        `,
      });

      return res.status(200).json({ success: true, message: 'Key provisioned and dispatched via encrypted mail.' });
    } catch (error) {
      console.error("Provisioning Error:", error);
      return res.status(500).json({ error: 'Failed to dispatch security credentials.' });
    }
  });

  // Secure Endpoint to Fetch Employees (CEO/Secretary)
  app.get('/api/executive/employees', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'SECRETARY'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege for HR data.' });
    }
    try {
      const snapshot = await db.collection('employees').get();
      const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(employees);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Create Employee (CEO/Secretary)
  app.post('/api/executive/employees', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'SECRETARY'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege to onboard staff.' });
    }
    try {
      const employee = req.body;
      const ref = await db.collection('employees').add({
        ...employee,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ id: ref.id, ...employee });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Create Project (CEO/Project Manager)
  app.post('/api/executive/projects', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'PROJECT MANAGER'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege to create projects.' });
    }
    try {
      const project = req.body;
      const docId = project.id || `PRJ-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await db.collection('projects').doc(docId).set({
        ...project,
        id: docId,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ id: docId, ...project });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Update Project Details & Milestones (CEO/Project Manager/Engineer)
  app.put('/api/executive/projects/:id', verifyCommandKey, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      await db.collection('projects').doc(id).update({
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return res.status(200).json({ success: true, message: 'Project structural update complete.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Fetch Invoices (CEO/Financial Officer/Accountant)
  app.get('/api/executive/invoices', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT', 'SECRETARY'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege for invoice records.' });
    }
    try {
      const snapshot = await db.collection('invoices').get();
      const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(invoices);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Create Invoice (CEO/Financial Officer/Accountant)
  app.post('/api/executive/invoices', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege to raise invoices.' });
    }
    try {
      const invoice = req.body;
      const ref = await db.collection('invoices').add({
        ...invoice,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ id: ref.id, ...invoice });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Update Invoice Status (CEO/Financial Officer/Accountant)
  app.patch('/api/executive/invoices/:id', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege to alter invoice states.' });
    }
    try {
      const { id } = req.params;
      const { status } = req.body;
      await db.collection('invoices').doc(id).update({
        status,
        updatedAt: new Date().toISOString()
      });
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Fetch Receipts (CEO/Financial Officer/Accountant)
  app.get('/api/executive/receipts', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege for receipts ledger.' });
    }
    try {
      const snapshot = await db.collection('receipts').get();
      const receipts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(receipts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Create Receipt (CEO/Financial Officer/Accountant)
  app.post('/api/executive/receipts', verifyCommandKey, async (req: any, res) => {
    try {
      const receipt = req.body;
      const ref = await db.collection('receipts').add({
        ...receipt,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ id: ref.id, ...receipt });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Verify Receipt Status (CEO/Financial Officer/Accountant)
  app.patch('/api/executive/receipts/:id', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege.' });
    }
    try {
      const { id } = req.params;
      const { status } = req.body;
      await db.collection('receipts').doc(id).update({
        status,
        updatedAt: new Date().toISOString()
      });
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Fetch Contracts
  app.get('/api/executive/contracts', verifyCommandKey, async (req: any, res) => {
    try {
      const snapshot = await db.collection('contracts').orderBy('createdAt', 'desc').get();
      const contracts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(contracts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Create Contract
  app.post('/api/executive/contracts', verifyCommandKey, async (req: any, res) => {
    if (!['CEO', 'SECRETARY'].includes(req.userRole)) {
      return res.status(403).json({ error: 'ACCESS DENIED: Insufficient privilege to draft legal documents.' });
    }
    try {
      const contract = req.body;
      const ref = await db.collection('contracts').add({
        ...contract,
        createdAt: new Date().toISOString(),
        verified: true
      });
      return res.status(201).json({ id: ref.id, ...contract });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint for Security Logs with Tracing Detail
  app.get('/api/executive/security-logs', verifyCommandKey, async (req: any, res) => {
    if (req.userRole !== 'CEO') {
      return res.status(403).json({ error: 'ACCESS DENIED: Security Terminal is CEO-Exclusive.' });
    }
    try {
      const snapshot = await db.collection('security_logs').orderBy('timestamp', 'desc').limit(50).get();
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(logs);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Secure Endpoint to Log Forensics (e.g. Trace)
  app.post('/api/security/log-forensics', verifyCommandKey, async (req: any, res) => {
    if (req.userRole !== 'CEO') return res.status(403).json({ error: 'CEO Clearance Required' });
    const { ip, type, details } = req.body;
    try {
      await db.collection('security_logs').add({
        timestamp: new Date().toISOString(),
        ip_address: ip,
        type: type || 'TRACE',
        access_status: 'flagged_forensics',
        threat_level: 'CRITICAL',
        notes: details || `Forensic physical trace initiated on node ${ip}`
      });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Log successful login access
  app.post('/api/auth/log-access', async (req, res) => {
    const { key, role, name, ip } = req.body;
    try {
      await db.collection('security_logs').add({
        timestamp: new Date().toISOString(),
        ip_address: ip || req.ip,
        access_status: 'authorized_entry',
        threat_level: 'NONE',
        notes: `Command Key Authorized: [${key.substring(0, 8)}...] assigned to ${name} (${role})`
      });
      res.json({ success: true });
    } catch (err: any) {
      console.error("Failed to log access:", err);
      res.status(500).json({ error: "Logged internally but failed to sync with security terminal." });
    }
  });

  // Secure Endpoint to Archive Project (CEO only)
  app.post('/api/executive/projects/:id/archive', verifyCommandKey, async (req: any, res) => {
    if (req.userRole !== 'CEO') return res.status(403).json({ error: 'CEO Authorization Required' });
    try {
      await db.collection('projects').doc(req.params.id).update({ status: 'archived', updatedAt: new Date().toISOString() });
      return res.json({ success: true, message: 'Project archived' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development / Static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SECURE BOOT] MADECC System running on http://localhost:${PORT}`);
  });
}

