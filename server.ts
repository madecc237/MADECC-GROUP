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
          affiliatedProject: 'Metropolis Plaza',
          pid: '101',
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
          affiliatedProject: 'Horizon Ocean Villas',
          pid: '102',
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
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "kreboya603@gmail.com",
        to: "kreboya603@gmail.com",
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
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

