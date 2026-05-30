import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  Wallet, 
  ShieldCheck, 
  Activity,
  HardHat,
  MessageSquare,
  Phone,
  LayoutDashboard,
  Briefcase,
  FileText,
  LogOut,
  ChevronRight,
  UserPlus,
  BarChart3,
  Globe,
  Settings,
  Bell,
  Search,
  Monitor,
  PenTool,
  Lock,
  Receipt,
  Upload,
  Image as ImageIcon,
  Crop as CropIcon,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CostEstimator } from '../components/CostEstimator';
import { jsPDF } from 'jspdf';
import { ImageCropper } from '../components/ImageCropper';
import { db } from '../services/firebase'; // Assuming firebase service exists
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';

interface ExecutiveDashboardProps {
  role: string;
  userName: string;
  sessionKey: string;
  onLogout: () => void;
}

type ViewType = 'overview' | 'projects' | 'contracts' | 'signing' | 'employees' | 'invoices' | 'web-content' | 'receipts' | 'security';

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ role, userName, sessionKey, onLogout }) => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isTracingStep, setIsTracingStep] = useState(0);
  
  // Media states
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [croppingMedia, setCroppingMedia] = useState<string | null>(null);
  const [publishedPosts, setPublishedPosts] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [staffList, setStaffList] = useState([
    { name: 'Jean-Paul Ndi', role: 'CEO', status: 'Headquarters', duty: 'Chief Executive Authority' },
    { name: 'Bonaventure Kalou', role: 'PROJECT MANAGER', status: 'Mobile - Field Inspection', duty: 'Field Operations Command' },
    { name: 'PR Team Alpha', role: 'CONTENT EDITOR', status: 'Remote', duty: 'Information & Media Control' },
    { name: 'Marthe Njole', role: 'FINANCIAL OFFICER', status: 'Headquarters', duty: 'Fiscal & Treasury Audit' },
    { name: 'Patrick Mboma', role: 'ACCOUNTANT', status: 'Headquarters', duty: 'Accounting & Financial Record Keeping (CEO-Provisioned Access Required)' },
    { name: 'Rigobert Song', role: 'SECRETARY', status: 'Headquarters', duty: 'Administrative Liaison & Document Archiving (CEO-Provisioned Access Required)' }
  ]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);

  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);

  // Forms and Modals
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [newContractForm, setNewContractForm] = useState({
    title: '',
    ref: '',
    affiliatedProject: '',
    pid: '',
    party: '',
    signedDate: '',
    expiration: '',
    amount: '',
    status: 'Active'
  });

  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    name: '',
    role: 'ENGINEER',
    status: 'Headquarters',
    duty: ''
  });

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    id: '',
    name: '',
    location: '',
    budget: '',
    status: 'Execution',
    progress: 10,
    color: '#F26A36'
  });

  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    client: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    project: ''
  });

  const [isAddingReceipt, setIsAddingReceipt] = useState(false);
  const [newReceiptForm, setNewReceiptForm] = useState({
    vendor: '',
    category: 'Materials',
    amount: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Pending',
    project: ''
  });
  const [commandKeys, setCommandKeys] = useState([
    { id: 'MADECC-X7Y2-91B1', assigned: 'Project Manager', created: '2026-05-01' },
    { id: 'MADECC-X7Y2-91B2', assigned: 'Site Supervisor', created: '2026-05-05' },
    { id: 'MADECC-X7Y2-91B3', assigned: 'Procurement Officer', created: '2026-05-10' },
  ]);
  const [intrusions, setIntrusions] = useState([
    { 
      id: 1, 
      threat: 'HIGH', 
      timestamp: '2026-05-15 20:21:33', 
      location: 'Lagos, NG', 
      ip: '102.244.11.90',
      fingerprint: 'SHA-256-HANDSHAKE-FAIL',
      details: 'Unauthorized access attempt targeted the Yaoundé Mainframe API. Encryption layers held, but the IP has been permanently blacklisted across all MADECC nodes.'
    }
  ]);
  const [selectedIntrusion, setSelectedIntrusion] = useState<any>(null);
  const [isLockoutActive, setIsLockoutActive] = useState(false);
  const [isLockoutConfirmOpen, setIsLockoutConfirmOpen] = useState(false);
  const [isTracing, setIsTracing] = useState<string | null>(null);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [isProvisioningKey, setIsProvisioningKey] = useState(false);
  const [provisioningForm, setProvisioningForm] = useState({ email: '', role: 'ENGINEER' });
  const [provisioningStatus, setProvisioningStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [editingContract, setEditingContract] = useState<any>(null);
  const [contractSignature, setContractSignature] = useState('');

  // Filtering states
  const [contractFilter, setContractFilter] = useState('all');
  const [contractSort, setContractSort] = useState('newest');
  const [contractSearch, setContractSearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [receiptSearch, setReceiptSearch] = useState('');

  const handleProvisionKey = async () => {
    if (!provisioningForm.email) return alert('Email required for secure dispatch.');
    setProvisioningStatus('loading');
    
    try {
      const response = await fetch('/api/security/provision-with-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-command-key': sessionKey
        },
        body: JSON.stringify(provisioningForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProvisioningStatus('success');
        setCommandKeys(prev => [...prev, { 
          id: `PROV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`, 
          assigned: provisioningForm.role, 
          created: new Date().toISOString().split('T')[0] 
        }]);
        setTimeout(() => {
          setIsProvisioningKey(false);
          setProvisioningStatus('idle');
          setProvisioningForm({ email: '', role: 'ENGINEER' });
        }, 2000);
      } else {
        alert(`ACCESS DENIED: ${data.error}`);
        setProvisioningStatus('error');
      }
    } catch (err) {
      console.error(err);
      setProvisioningStatus('error');
    }
  };

  const revokeKey = (id: string) => {
    setCommandKeys(prev => prev.filter(key => key.id !== id));
  };

  const generateKey = () => {
    const newId = `MADECC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setCommandKeys(prev => [...prev, { id: newId, assigned: 'Temporary Access', created: new Date().toISOString().split('T')[0] }]);
  };

  const tracePhysical = async (ip: string) => {
    if (role !== 'CEO') return alert('CRITICAL ERROR: CEO AUTH REQUIRED FOR FORENSIC TRACING.');
    setIsTracing(ip);
    setIsTracingStep(1);
    
    try {
      await fetch('/api/security/log-forensics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-command-key': sessionKey },
        body: JSON.stringify({ ip, type: 'PHYSICAL_TRACE', details: `CEO ${role} initiated deep physical triangulation on node ${ip}` })
      });
    } catch (err) {
      console.error('Failed to log forensic trace:', err);
    }

    // Digital Analysis Phase
    setTimeout(() => setIsTracingStep(2), 1500);
    // Physical Triangulation Phase
    setTimeout(() => setIsTracingStep(3), 3000);
    
    setTimeout(() => {
      setIsTracing(null);
      setIsTracingStep(0);
      alert(`TRACE SUCCESSFUL.\n\nDigital Footprint Logged: Session_UUID_X891\nPhysical Location: Sector 4-G, Lagos Industrial Zone.\n\nIntrusion IP ${ip} has been permanently blacklisted across all MADECC nodes.`);
    }, 5000);
  };

  const triggerEmergencyLockout = () => {
    setIsLockoutActive(true);
    setIsLockoutConfirmOpen(false);
    setTimeout(() => setIsLockoutActive(false), 5000);
  };

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview', roles: ['CEO', 'PROJECT MANAGER', 'FINANCIAL OFFICER', 'SECRETARY'] },
    { id: 'projects', icon: Briefcase, label: 'Projects', roles: ['CEO', 'PROJECT MANAGER', 'ENGINEER'] },
    { id: 'contracts', icon: FileText, label: 'Contracts', roles: ['CEO', 'SECRETARY'] },
    { id: 'signing', icon: PenTool, label: 'E-Signing', roles: ['CEO', 'SECRETARY'] },
    { id: 'employees', icon: Users, label: 'Employees', roles: ['CEO', 'SECRETARY'] },
    { id: 'invoices', icon: BarChart3, label: 'Invoices', roles: ['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'] },
    { id: 'receipts', icon: Receipt, label: 'Digital Receipts', roles: ['CEO', 'ACCOUNTANT', 'FINANCIAL OFFICER'] },
    { id: 'web-content', icon: Globe, label: 'Web Content', roles: ['CEO', 'CONTENT EDITOR'] },
    { id: 'security', icon: ShieldCheck, label: 'Security Terminal', roles: ['CEO'] },
  ];

  const exportSecurityAudit = () => {
    let content = "MADECC COMMAND CENTRAL - SECURITY AUDIT LOG\n\n";
    securityLogs.forEach(log => {
      content += `[${log.timestamp}] IP: ${log.ip_address} | STATUS: ${log.access_status} | THREAT: ${log.threat_level}\nNOTES: ${log.notes}\n-----------------------------------\n`;
    });
    if (securityLogs.length === 0) content += "No critical incidents logged in current buffer.";
    generatePDF('Security Audit Report', content);
  };

  const fetchSecurityLogs = async () => {
    if (role !== 'CEO') return;
    try {
      const res = await fetch('/api/executive/security-logs', {
        headers: { 'x-command-key': sessionKey }
      });
      if (res.ok) {
        const data = await res.json();
        setSecurityLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch security logs:', err);
    }
  };

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch('/api/executive/projects', {
        headers: { 'x-command-key': sessionKey }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setProjects(data);
        } else {
          // Fallback to robust mocks if API returns empty (clean database)
          setProjects([
            { id: 'YDE-01', name: 'Executive Tower Phase II', location: 'Yaoundé, Central Business District', budget: '1.45B XAF', status: 'Execution', progress: 65, color: '#F26A36' },
            { id: 'YDE-04', name: 'Logbessou Residential Complex', location: 'Logbessou, Douala', budget: '890M XAF', status: 'Planning', progress: 15, color: '#3B82F6' },
            { id: 'KRI-02', name: 'Kribi Cold Logistics Hub', location: 'Industrial Zone, Kribi Port', budget: '2.2B XAF', status: 'Structural', progress: 92, color: '#10B981' },
            { id: 'BA-09', name: 'Bastos Modern Bridge', location: 'Bastos, Yaoundé', budget: '310M XAF', status: 'Surveying', progress: 8, color: '#A855F7' },
            { id: 'DS-12', name: 'West Gate Solar Farm', location: 'Dschang, West Region', budget: '750M XAF', status: 'Procurement', progress: 34, color: '#EAB308' },
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const fetchContracts = async () => {
    setIsLoadingContracts(true);
    try {
      const res = await fetch('/api/executive/contracts', {
        headers: { 'x-command-key': sessionKey }
      });
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      }
    } catch (err) {
      console.error('Failed to fetch contracts:', err);
    } finally {
      setIsLoadingContracts(false);
    }
  };

  const handleAddContract = async () => {
    if (!['CEO', 'SECRETARY'].includes(role)) return alert('ACCESS DENIED: Legal protocols require CEO or Secretary clearance.');
    if (!newContractForm.title || !newContractForm.ref) return alert('Reference and Title are required.');
    
    try {
      const res = await fetch('/api/executive/contracts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-command-key': sessionKey 
        },
        body: JSON.stringify(newContractForm)
      });
      
      if (res.ok) {
        const added = await res.json();
        setContracts(prev => [added, ...prev]);
        setIsAddingContract(false);
        setNewContractForm({
          title: '',
          ref: '',
          affiliatedProject: '',
          pid: '',
          party: '',
          signedDate: '',
          expiration: '',
          amount: '',
          status: 'Active'
        });
      } else {
        const err = await res.json();
        alert(`Failed to add contract: ${err.error}`);
      }
    } catch (err) {
      console.error('Add contract error:', err);
    }
  };

  // Full Stack Employee (HR) Handlers
  const fetchEmployees = async () => {
    if (!['CEO', 'SECRETARY'].includes(role)) return;
    setIsLoadingEmployees(true);
    try {
      const res = await fetch('/api/executive/employees', {
        headers: { 'x-command-key': sessionKey }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setStaffList(data);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const handleCreateEmployee = async () => {
    if (!['CEO', 'SECRETARY'].includes(role)) return alert('ACCESS DENIED: HR protocols require CEO or Secretary clearance.');
    if (!newEmployeeForm.name || !newEmployeeForm.duty) return alert('Name and duty details are required.');
    try {
      const res = await fetch('/api/executive/employees', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-command-key': sessionKey 
        },
        body: JSON.stringify(newEmployeeForm)
      });
      if (res.ok) {
        const added = await res.json();
        setStaffList(prev => [...prev, added]);
        setIsAddingEmployee(false);
        setNewEmployeeForm({ name: '', role: 'ENGINEER', status: 'Headquarters', duty: '' });
      } else {
        const err = await res.json();
        alert(`Failed to onboard employee: ${err.error}`);
      }
    } catch (err) {
      console.error('Onboard employee error:', err);
    }
  };

  // Full Stack Projects Handlers
  const handleCreateProject = async () => {
    if (!['CEO', 'PROJECT MANAGER'].includes(role)) return alert('ACCESS DENIED: Project launch requires CEO or PM clearance.');
    if (!newProjectForm.name || !newProjectForm.budget) return alert('Name and budget are required.');
    
    try {
      const finalForm = {
        ...newProjectForm,
        milestones: [
          { step: 'Foundation & Grading', date: '2026-Q2', status: 'In Progress' },
          { step: 'Structural Work', date: '2026-Q3', status: 'Scheduled' }
        ],
        logs: [
          { title: 'Project Mobilisation', amount: '0 XAF', idStr: 'TXN_INIT' }
        ]
      };
      const res = await fetch('/api/executive/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-command-key': sessionKey 
        },
        body: JSON.stringify(finalForm)
      });
      if (res.ok) {
        const added = await res.json();
        setProjects(prev => [added, ...prev]);
        setIsAddingProject(false);
        setNewProjectForm({ id: '', name: '', location: '', budget: '', status: 'Execution', progress: 10, color: '#F26A36' });
      } else {
        const err = await res.json();
        alert(`Failed to launch project: ${err.error}`);
      }
    } catch (err) {
      console.error('Launch project error:', err);
    }
  };

  const handleUpdateProject = async (id: string, updatedFields: any) => {
    try {
      const res = await fetch(`/api/executive/projects/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-command-key': sessionKey 
        },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
        if (selectedProject && selectedProject.id === id) {
          setSelectedProject((prev: any) => ({ ...prev, ...updatedFields }));
        }
      } else {
        const err = await res.json();
        console.error(`Failed to update project: ${err.error}`);
      }
    } catch (err) {
      console.error('Update project error:', err);
    }
  };

  // Full Stack Invoices Handlers
  const fetchInvoices = async () => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT', 'SECRETARY'].includes(role)) return;
    setIsLoadingInvoices(true);
    try {
      const res = await fetch('/api/executive/invoices', {
        headers: { 'x-command-key': sessionKey }
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'].includes(role)) return alert('ACCESS DENIED: Invoice creation requires fiscal authorization.');
    if (!newInvoiceForm.client || !newInvoiceForm.amount) return alert('Client and Amount are required.');
    
    const id = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const finalForm = {
      ...newInvoiceForm,
      id
    };
    try {
      const res = await fetch('/api/executive/invoices', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-command-key': sessionKey 
        },
        body: JSON.stringify(finalForm)
      });
      if (res.ok) {
        const added = await res.json();
        setInvoices(prev => [added, ...prev]);
        setIsAddingInvoice(false);
        setNewInvoiceForm({
          client: '',
          amount: '',
          status: 'Pending',
          date: new Date().toISOString().split('T')[0],
          project: ''
        });
      } else {
        const err = await res.json();
        alert(`Failed to issue invoice: ${err.error}`);
      }
    } catch (err) {
      console.error('Issue invoice error:', err);
    }
  };

  const handlePatchInvoiceStatus = async (id: string, status: string) => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'].includes(role)) return alert('ACCESS DENIED: Fiscal clearance required.');
    try {
      const res = await fetch(`/api/executive/invoices/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-command-key': sessionKey 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
      }
    } catch (err) {
      console.error('Patch invoice status error:', err);
    }
  };

  // Full Stack Receipts Handlers
  const fetchReceipts = async () => {
    if (!['CEO', 'ACCOUNTANT', 'FINANCIAL OFFICER'].includes(role)) return;
    setIsLoadingReceipts(true);
    try {
      const res = await fetch('/api/executive/receipts', {
        headers: { 'x-command-key': sessionKey }
      });
      if (res.ok) {
        const data = await res.json();
        setReceipts(data);
      }
    } catch (err) {
      console.error('Failed to fetch receipts:', err);
    } finally {
      setIsLoadingReceipts(false);
    }
  };

  const handleCreateReceipt = async () => {
    if (!newReceiptForm.vendor || !newReceiptForm.amount) return alert('Vendor and Amount are required.');
    
    const rcpId = `RCP-${Math.floor(8000 + Math.random() * 1999)}`;
    const finalForm = {
      ...newReceiptForm,
      rcpId
    };
    try {
      const res = await fetch('/api/executive/receipts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-command-key': sessionKey 
        },
        body: JSON.stringify(finalForm)
      });
      if (res.ok) {
        const added = await res.json();
        setReceipts(prev => [added, ...prev]);
        setIsAddingReceipt(false);
        setNewReceiptForm({
          vendor: '',
          category: 'Materials',
          amount: '',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Pending',
          project: ''
        });
      }
    } catch (err) {
      console.error('Add receipt error:', err);
    }
  };

  const handlePatchReceiptStatus = async (id: string, status: string) => {
    if (!['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'].includes(role)) return alert('ACCESS DENIED: Fiscal modification denied.');
    try {
      const res = await fetch(`/api/executive/receipts/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-command-key': sessionKey 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setReceipts(prev => prev.map(rcp => rcp.id === id ? { ...rcp, status } : rcp));
      }
    } catch (err) {
      console.error('Patch receipt status error:', err);
    }
  };

  const fetchPublishedPosts = async () => {
    try {
      const q = query(collection(db, 'web_posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublishedPosts(posts);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handlePublishPost = async () => {
    if (!editingPost.title) return alert('Protocol Error: Title required for indexing.');
    setIsPublishing(true);
    
    try {
      const postData = {
        title: editingPost.title,
        content: editingPost.content,
        author: userName,
        img: selectedMedia,
        category: editingPost.category || 'Innovation',
        status: editingPost.status || 'published',
        createdAt: serverTimestamp(),
        seoTags: editingPost.title.toLowerCase().replace(/\s+/g, '-'),
      };

      await addDoc(collection(db, 'web_posts'), postData);
      alert('Post synchronized successfully with public nodes.');
      setEditingPost(null);
      setSelectedMedia(null);
      fetchPublishedPosts();
    } catch (err) {
      console.error('Publishing failed:', err);
      alert('Transmission Error: Secure linkage failed.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCroppingMedia(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    fetchProjects();
    fetchContracts();
    fetchPublishedPosts();
    fetchEmployees();
    fetchInvoices();
    fetchReceipts();
  }, []);

  React.useEffect(() => {
    if (activeView === 'security') {
      fetchSecurityLogs();
    }
  }, [activeView]);

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  const generatePDF = (title: string, content: string, isA4Complete: boolean = false) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Header
    doc.setFillColor(242, 106, 54); // #F26A36
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('MADECC CONSTRUCTION GROUP', 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SECURE EXECUTIVE COMMAND | YAOUNDÉ, CAMEROON', 20, 28);
    
    // Body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 20, 55);
    
    doc.line(20, 60, 190, 60);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(content, 170);
    doc.text(lines, 20, 75);

    if (isA4Complete) {
      // Add signature line for contracts
      const footerY = 250;
      doc.line(20, footerY, 80, footerY);
      doc.text('AUTHORIZED SIGNATURE', 20, footerY + 5);
      doc.text('CHIEF EXECUTIVE OFFICER', 20, footerY + 10);
      
      if (contractSignature) {
        doc.setFont('courier', 'italic');
        doc.setFontSize(16);
        doc.text(contractSignature, 25, footerY - 5);
      }
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Document Identifier: ${Math.random().toString(36).substring(7).toUpperCase()}`, 20, 285);
    doc.text(`Authenticated Session: ${sessionKey.substring(0, 12)}...`, 20, 290);
    doc.text(`Page 1 of 1`, 180, 290);
    
    try {
      doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('CRITICAL: PDF Export failed. Verify browser permissions.');
    }
  };

  const exportInvoicesPDF = () => {
    const invoices = [
      { id: 'INV-2026-001', client: 'Port Authority', amount: '12,500,000 XAF', status: 'Paid' },
      { id: 'INV-2026-002', client: 'Bolloré Logistics', amount: '8,200,000 XAF', status: 'Pending' },
      { id: 'INV-2026-003', client: 'State Housing', amount: '45,000,000 XAF', status: 'Overdue' }
    ];
    let content = "FISCAL YEAR 2026 - COMPREHENSIVE REVENUE AUDIT\n\n";
    invoices.forEach(inv => {
      content += `ID: ${inv.id} | CLIENT: ${inv.client} | AMOUNT: ${inv.amount} | STATUS: ${inv.status}\n`;
    });
    generatePDF('Full Invoice Ledger', content);
  };

  const exportContactsPDF = () => {
    let content = "OFFICIAL EMPLOYEE DIRECTORY & CONTACT PROTOCOLS\n";
    content += `GENERATED BY: ${userName}\n`;
    content += `TIMESTAMP: ${new Date().toLocaleString()}\n\n`;
    
    staffList.forEach(emp => {
      content += `NAME: ${emp.name}\nROLE: ${emp.role}\nSTATUS: ${emp.status}\nDUTY: ${emp.duty}\n-----------------------------------\n`;
    });
    generatePDF('Staff Contact Directory', content);
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setActiveView('projects');
  };

  const renderContent = () => {
    if (selectedProject && activeView === 'projects') {
      return (
        <div className="space-y-8">
          <button 
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-xs font-black uppercase text-[#F26A36] hover:underline"
          >
            ← Back to Fleet
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 bg-[#161920] border border-[#262B37] rounded-3xl space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedProject.name}</h2>
                    <p className="text-sm text-slate-500 font-bold uppercase">{selectedProject.location}</p>
                  </div>
                  <span className="px-4 py-1 bg-[#F26A36]/10 text-[#F26A36] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#F26A36]/20">
                    {selectedProject.status}
                  </span>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0D0F12] rounded-xl border border-[#262B37]">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Budget Allocation</p>
                    <p className="text-xl font-black text-white">{selectedProject.budget}</p>
                  </div>
                  <div className="p-4 bg-[#0D0F12] rounded-xl border border-[#262B37]">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Completion</p>
                    <p className="text-xl font-black text-emerald-500 font-mono">{selectedProject.progress}%</p>
                  </div>
               </div>

               <div className="p-5 bg-[#0D0F12] rounded-2xl border border-[#262B37] space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Budget Liquidity</span>
                    <span className="text-white">62% Utilized</span>
                  </div>
                  <div className="h-3 bg-[#161920] rounded-full overflow-hidden border border-[#262B37] p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '62%' }}
                      className="h-full bg-gradient-to-r from-[#F26A36] to-red-500 rounded-full shadow-[0_0_10px_rgba(242,106,54,0.3)]"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                    <span>Spent: 279M XAF</span>
                    <span>Remaining: 171M XAF</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#F26A36]">Phase Milestones</h3>
                    <span className="text-[8px] text-slate-500 uppercase font-black">Click to toggle status</span>
                  </div>
                  <div className="space-y-2">
                    {(selectedProject.milestones || [
                      { step: 'Foundation & Grading', date: '2025-Q4', status: 'Complete' },
                      { step: 'Structural Caging', date: '2026-Q1', status: 'In Progress' },
                      { step: 'MEP Integration', date: '2026-Q3', status: 'Scheduled' }
                    ]).map((m: any, i: number) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          const nextStatus = m.status === 'Complete' ? 'In Progress' : m.status === 'In Progress' ? 'Scheduled' : 'Complete';
                          const updatedMilestones = [...(selectedProject.milestones || [])];
                          updatedMilestones[i] = { ...m, status: nextStatus };
                          handleUpdateProject(selectedProject.id, { milestones: updatedMilestones });
                        }}
                        className="flex justify-between items-center p-3 bg-[#0D0F12] border border-[#262B37] hover:border-[#F26A36]/40 cursor-pointer rounded-lg transition-all"
                      >
                        <span className="text-[11px] font-bold uppercase">{m.step}</span>
                        <div className="flex gap-4 items-center">
                          <span className="text-[9px] text-slate-500 font-mono">{m.date}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded ${m.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-500' : m.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-400'}`}>{m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="p-6 bg-[#161920] border border-[#262B37] rounded-3xl h-full">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#F26A36] mb-4">Financial Log</h3>
                  
                  {/* Expense Entry Form */}
                  <div className="p-4 bg-[#0D0F12] border border-[#262B37] rounded-xl space-y-3 mb-4">
                    <p className="text-[9px] text-slate-400 font-black uppercase">Post Operational Ledger Entry</p>
                    <div className="grid grid-cols-2 gap-2">
                       <input 
                         type="text" 
                         placeholder="Description (e.g. Scaffolding)" 
                         id="new_log_title"
                         className="bg-[#161920] text-[10px] p-2 rounded-lg border border-[#262B37] text-white uppercase font-bold focus:outline-none focus:border-[#F26A36]/50 placeholder:text-slate-700 w-full"
                       />
                       <input 
                         type="text" 
                         placeholder="Outflow (e.g. -1.2M XAF)" 
                         id="new_log_amount"
                         className="bg-[#161920] text-[10px] p-2 rounded-lg border border-[#262B37] text-white font-mono focus:outline-none focus:border-[#F26A36]/50 placeholder:text-slate-700 w-full"
                       />
                    </div>
                    <button 
                      onClick={() => {
                        const titleInp = document.getElementById('new_log_title') as HTMLInputElement;
                        const amountInp = document.getElementById('new_log_amount') as HTMLInputElement;
                        if (titleInp && amountInp && titleInp.value && amountInp.value) {
                          const newLog = {
                            title: titleInp.value,
                            amount: amountInp.value,
                            idStr: `TXN_${Math.floor(1000 + Math.random() * 8999)}`
                          };
                          const updatedLogs = [newLog, ...(selectedProject.logs || [])];
                          handleUpdateProject(selectedProject.id, { logs: updatedLogs });
                          titleInp.value = '';
                          amountInp.value = '';
                        } else {
                          alert('Specify item description & monetary outflow configuration.');
                        }
                      }}
                      className="w-full text-center py-2 bg-[#F26A36] hover:bg-orange-500 text-[9px] font-black uppercase text-white rounded-lg transition-colors"
                    >
                      Post Operational Outflow
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {(selectedProject.logs || [
                      { title: 'Steel Reinforcement Bars', amount: '-4,500,000 XAF', idStr: 'TXN_8192_1' },
                      { title: 'Excavator Fuel Dispatch', amount: '-1,200,000 XAF', idStr: 'TXN_8192_2' },
                      { title: 'Site Inspection Transport', amount: '-450,000 XAF', idStr: 'TXN_8192_3' }
                    ]).map((log: any, i: number) => (
                      <div key={i} className="p-3.5 bg-[#0D0F12] border border-[#262B37]/60 rounded-xl flex justify-between items-center hover:border-white/5 transition-all">
                        <div>
                          <p className="text-xs font-bold uppercase text-slate-100">{log.title}</p>
                          <p className="text-[9px] text-slate-500 font-mono">Reference: {log.idStr}</p>
                        </div>
                        <p className="text-sm font-black text-red-400 font-mono">{log.amount}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'overview':
        const dynamicBudgetsSum = (() => {
          let total = 0;
          projects.forEach(p => {
            const budgetStr = p.budget || '';
            const numericPart = budgetStr.replace(/[^\d\.]/g, '');
            const parsedNum = parseFloat(numericPart) || 0;
            if (budgetStr.toUpperCase().includes('B')) {
              total += parsedNum * 1000000000;
            } else if (budgetStr.toUpperCase().includes('M')) {
              total += parsedNum * 1000000;
            } else {
              total += parsedNum;
            }
          });
          if (total === 0) return '2.45B XAF';
          if (total >= 1000000000) return `${(total / 1000000000).toFixed(2)}B XAF`;
          if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M XAF`;
          return `${total.toLocaleString()} XAF`;
        })();

        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard label="Total Portfolios" value={`${projects.length} Active Sites`} icon={Briefcase} />
              <KpiCard label="Running Budgets" value={dynamicBudgetsSum} icon={Wallet} trend="+14.2%" />
              <KpiCard label="Active Staff" value={`${staffList.length} Active Headcount`} icon={Users} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#161920] rounded-2xl border border-[#262B37] p-6 shadow-xl">
                 <h2 className="text-sm font-black uppercase tracking-widest text-[#718096] mb-6 flex items-center gap-2">
                   <Activity size={16} className="text-[#F26A36]" />
                   Live Infrastructure Status
                 </h2>
                 <ProjectsTable projects={projects} onProjectClick={handleProjectClick} />
              </div>
              <CostEstimator />
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center mb-6">
               <div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter">Project Fleet Control</h2>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Infrastructure Portfolios</p>
               </div>
               {['CEO', 'PROJECT MANAGER'].includes(role) && (
                 <button 
                  onClick={() => setIsAddingProject(true)}
                  className="px-6 py-2.5 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2"
                 >
                   Launch Project
                 </button>
               )}
            </div>

            <div className="bg-[#161920] rounded-2xl border border-[#262B37] p-6 shadow-xl">
               <ProjectsTable projects={projects} onProjectClick={handleProjectClick} />
            </div>

            {/* Launch Project Modal */}
            <AnimatePresence>
              {isAddingProject && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm shadow-2xl">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-[#161920] border border-[#262B37] p-8 rounded-3xl space-y-6 shadow-2xl relative"
                  >
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">Initialize Project Fleet</h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Launch secure construction portfolio</p>
                    </div>

                    <div className="space-y-4 text-left">
                      <div>
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Project Code (e.g. YDE-09)</label>
                        <input 
                          type="text" 
                          value={newProjectForm.id}
                          onChange={(e) => setNewProjectForm({...newProjectForm, id: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Project Name</label>
                        <input 
                          type="text" 
                          value={newProjectForm.name}
                          onChange={(e) => setNewProjectForm({...newProjectForm, name: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Geographic Location</label>
                        <input 
                          type="text" 
                          value={newProjectForm.location}
                          onChange={(e) => setNewProjectForm({...newProjectForm, location: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Total Budget Allocation</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 1.2B XAF"
                            value={newProjectForm.budget}
                            onChange={(e) => setNewProjectForm({...newProjectForm, budget: e.target.value})}
                            className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Current Operations Phase</label>
                          <select 
                            value={newProjectForm.status}
                            onChange={(e) => setNewProjectForm({...newProjectForm, status: e.target.value})}
                            className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                          >
                            <option value="Execution">Execution</option>
                            <option value="Planning">Planning</option>
                            <option value="Structural">Structural</option>
                            <option value="Surveying">Surveying</option>
                            <option value="Procurement">Procurement</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button 
                        onClick={() => setIsAddingProject(false)}
                        className="px-5 py-2 bg-white/5 text-[9px] font-black uppercase text-slate-300 rounded-lg hover:bg-white/10"
                      >
                        Abort
                      </button>
                      <button 
                        onClick={handleCreateProject}
                        className="px-5 py-2 bg-[#F26A36] text-[9px] font-black uppercase text-white rounded-lg hover:bg-orange-600"
                      >
                        Launch
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );


      case 'web-content':
        return (
          <div className="space-y-8">
            <AnimatePresence>
              {croppingMedia && (
                <ImageCropper 
                  image={croppingMedia} 
                  onCropComplete={(cropped) => {
                    setSelectedMedia(cropped);
                    setCroppingMedia(null);
                  }}
                  onCancel={() => setCroppingMedia(null)}
                />
              )}
            </AnimatePresence>

            {editingPost ? (
              <div className="bg-[#161920] border border-[#262B37] p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F26A36]/5 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">{editingPost.id === 'new' ? 'New Media Transmit' : 'Modify Asset'}</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Authorized for Public Dissemination</p>
                  </div>
                  <button onClick={() => { setEditingPost(null); setSelectedMedia(null); }} className="px-5 py-2 bg-white/5 border border-[#262B37] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Abort Discard</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                          <PenTool size={10} className="text-[#F26A36]" />
                          Operational Headline
                        </label>
                        <input 
                          type="text" 
                          value={editingPost.title}
                          onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-4 text-sm font-black uppercase focus:border-[#F26A36] focus:outline-none transition-all placeholder:text-slate-800"
                          placeholder="Headline..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Node Categorization</label>
                        <select 
                          value={editingPost.category || 'Innovation'}
                          onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
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
                      <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                        <FileText size={10} className="text-[#F26A36]" />
                        Deep Analysis (Rich Text)
                      </label>
                      <textarea 
                        rows={10}
                        value={editingPost.content}
                        onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                        className="w-full bg-[#0D0F12] border border-[#262B37] rounded-2xl p-6 text-sm font-medium leading-relaxed text-slate-300 focus:border-[#F26A36] focus:outline-none transition-all placeholder:text-slate-800 min-h-[300px]"
                        placeholder="Start typing your article here..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Primary Media Asset</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group ${selectedMedia ? 'border-[#F26A36]/40' : 'border-[#262B37] hover:border-[#F26A36]/50'}`}
                        >
                            {selectedMedia ? (
                                <>
                                    <img src={selectedMedia} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 border-2 border-[#F26A36]">
                                        <button className="p-3 bg-white/10 rounded-full hover:bg-white/20">
                                            <CropIcon size={20} className="text-white" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }}
                                            className="p-3 bg-red-500/10 rounded-full hover:bg-red-500/20"
                                        >
                                            <Trash2 size={20} className="text-red-500" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload size={32} className="text-slate-700 mb-2 group-hover:text-[#F26A36] transition-colors" />
                                    <p className="text-[10px] font-black uppercase text-slate-500">Upload Operational Imagery</p>
                                    <p className="text-[8px] text-slate-700 font-bold mt-1 uppercase">16:9 Optimized Layer</p>
                                </>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*"
                                onChange={handleMediaUpload}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-[#0D0F12] border border-[#262B37] rounded-3xl space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                             <Globe size={12} className="text-emerald-500" />
                             Search Optimization (SEO)
                        </div>
                        <div className="space-y-3">
                             <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1">
                                 <p className="text-[9px] font-black text-emerald-500 uppercase">Indexing Slug</p>
                                 <p className="text-[11px] font-mono text-slate-400">/{editingPost.title.toLowerCase().replace(/\s+/g, '-') || 'pending-slug'}</p>
                             </div>
                             <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1">
                                 <p className="text-[9px] font-black text-blue-500 uppercase">Meta Visibility</p>
                                 <p className="text-[10px] text-slate-400 line-clamp-2">{editingPost.content ? editingPost.content.substring(0, 80) + '...' : 'No content analyzed.'}</p>
                             </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button 
                            onClick={handlePublishPost}
                            disabled={isPublishing}
                            className="w-full py-4 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#F26A36]/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isPublishing ? (
                                <Activity className="animate-spin" size={14} />
                            ) : (
                                <CheckCircle2 size={14} />
                            )}
                            Index to Public Feed
                        </button>
                        <button className="w-full py-4 bg-white/5 border border-[#262B37] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all">
                            Save Local Draft
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#161920] border border-[#262B37] rounded-[2rem] p-10 space-y-8 shadow-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Content Hub</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Global Communication Managed</p>
                    </div>
                    <button 
                      onClick={() => setEditingPost({ id: 'new', title: '', content: '' })}
                      className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-3 hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95"
                    >
                      <PenTool size={16} /> Transmit Update
                    </button>
                  </div>

                  <div className="space-y-4">
                    {publishedPosts.map((post: any) => (
                      <div key={post.id} className="p-6 bg-[#0D0F12] border border-[#262B37] rounded-3xl flex justify-between items-center group cursor-pointer hover:border-[#F26A36]/40 transition-all relative overflow-hidden">
                        <div className="flex items-center gap-5">
                            {post.img ? (
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#262B37]">
                                    <img src={post.img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-800">
                                    <ImageIcon size={24} />
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold uppercase tracking-tight text-white group-hover:text-[#F26A36] transition-colors">{post.title}</h4>
                                <p className="text-[9px] text-[#718096] uppercase font-bold tracking-widest mt-1">{post.author} • {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                <Monitor size={14} />
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                <Settings size={14} />
                            </button>
                        </div>
                      </div>
                    ))}
                    
                    {publishedPosts.length === 0 && (
                        <div className="p-12 text-center border border-dashed border-[#262B37] rounded-3xl space-y-3 opacity-30">
                            <AlertTriangle size={32} className="mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Active Public Feed Found</p>
                        </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-[#161920] border border-[#262B37] rounded-[2rem] p-10 space-y-6">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <Activity size={24} />
                            <h3 className="text-xl font-black uppercase tracking-tighter">Transmission Health</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400">Feed Latency</span>
                                <span className="text-xs font-mono font-bold text-emerald-500">12ms - Optimal</span>
                            </div>
                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400">Asset Sync</span>
                                <span className="text-xs font-mono font-bold text-blue-500">Active Node</span>
                            </div>
                        </div>
                        <div className="p-6 bg-[#0D0F12] border border-[#262B37] rounded-3xl">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-[10px] font-black uppercase text-slate-500">Public Retention</span>
                                <span className="text-sm font-black text-white">99.8%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-emerald-500" 
                                    initial={{ width: 0 }}
                                    animate={{ width: '99.8%' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#F26A36] to-red-600 rounded-[2rem] p-10 text-white space-y-4 shadow-2xl shadow-[#F26A36]/20">
                        <Globe size={40} className="text-white/20" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Main Server Status: LIVE</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">All updates propagate within 300ms to global access points.</p>
                        <button className="w-full py-4 bg-black/20 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-black/30 transition-all">
                            View Public Node
                        </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'signing':
        return (
          <div className="space-y-8">
            {editingContract ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#161920] border border-[#262B37] rounded-3xl p-8 space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Edit & Sign Contract</h2>
                  <button onClick={() => setEditingContract(null)} className="text-slate-500 hover:text-white transition-colors">Discard</button>
                </div>
                <div className="bg-[#0D0F12] border border-[#262B37] rounded-2xl p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Contract Terms & Appendices</label>
                    <textarea 
                      rows={10}
                      defaultValue={editingContract.boilerplate}
                      onChange={(e) => setEditingContract({...editingContract, boilerplate: e.target.value})}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono text-slate-300 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">CEO Digital Signature</label>
                    <input 
                      type="text" 
                      placeholder="Type Full Name to Sign"
                      value={contractSignature}
                      onChange={(e) => setContractSignature(e.target.value)}
                      className="w-full bg-white/5 border border-[#262B37] rounded-xl p-4 text-emerald-500 font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    disabled={!contractSignature}
                    onClick={() => {
                      generatePDF(editingContract.doc, editingContract.boilerplate, true);
                      setEditingContract(null);
                      setContractSignature('');
                      alert('Contract Signed and Exported successfully.');
                    }}
                    className="flex-1 py-4 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#F26A36]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Authorize & Export A4 PDF
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#161920] border border-[#262B37] rounded-3xl p-8 space-y-6">
                  <h2 className="text-xl font-black uppercase text-[#F26A36]">Upload for Signing</h2>
                  <div className="border-2 border-dashed border-[#262B37] rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 text-center hover:border-[#F26A36]/40 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-500">
                      <FileText size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase">Drag & Drop Contracts</p>
                      <p className="text-[10px] text-slate-500 font-medium">PDF, DOCX, or SCanned Blueprint (Max 50MB)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#161920] border border-[#262B37] rounded-3xl p-8 space-y-6">
                  <h2 className="text-xl font-black uppercase text-[#F26A36]">Signature Queue</h2>
                  <div className="space-y-2">
                    {[
                      { 
                        doc: 'Site_Lease_Yaounde_Tower_2.pdf', 
                        req: 'CEO Signature', 
                        status: 'Pending',
                        boilerplate: 'LEASE AGREEMENT: YAOUNDE TOWER 2\n\nArticle 1: Scope of Work...\nArticle 2: Site Access Protocols...\nArticle 3: Liability and Indemnity...'
                      },
                      { 
                        doc: 'Steel_Supplier_NDA.pdf', 
                        req: 'Secretary Approval', 
                        status: 'Requires Review',
                        boilerplate: 'MUTUAL NON-DISCLOSURE AGREEMENT\n\nRecitals: MADECC Construction Group and Steel-Cam Industries...'
                      }
                    ].map((s, i) => (
                      <div key={i} className="p-4 bg-[#0D0F12] border border-[#262B37] rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold uppercase truncate max-w-[200px]">{s.doc}</p>
                          <p className="text-[9px] text-slate-500 uppercase">{s.req}</p>
                        </div>
                        <button 
                           onClick={() => setEditingContract(s)}
                           className="px-3 py-1 bg-[#F26A36] text-white text-[9px] font-black uppercase tracking-widest rounded"
                        >
                           Edit & Sign
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'contracts':
        const filteredContracts = contracts
          .filter(c => {
            const matchesFilter = contractFilter === 'all' || c.status?.toLowerCase() === contractFilter;
            const matchesSearch = c.title?.toLowerCase().includes(contractSearch.toLowerCase()) || 
                                 c.ref?.toLowerCase().includes(contractSearch.toLowerCase()) ||
                                 c.party?.toLowerCase().includes(contractSearch.toLowerCase());
            return matchesFilter && matchesSearch;
          })
          .sort((a, b) => {
            if (contractSort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });

        return (
          <div className="space-y-6">
            <AnimatePresence>
              {isAddingContract && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-2xl bg-[#161920] border border-[#262B37] rounded-3xl p-8 space-y-6 shadow-2xl h-[80vh] overflow-y-auto custom-scrollbar"
                  >
                    <div className="flex justify-between items-center bg-[#161920] sticky top-0 pb-4 border-b border-[#262B37]">
                      <h3 className="text-2xl font-black uppercase text-[#F26A36]">New Legal Agreement</h3>
                      <button onClick={() => setIsAddingContract(false)} className="text-slate-500 hover:text-white">Close</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Agreement Title</label>
                        <input 
                          type="text" 
                          value={newContractForm.title}
                          onChange={(e) => setNewContractForm({...newContractForm, title: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                          placeholder="e.g. Structural Engineering Framework"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Logistics Reference</label>
                        <input 
                          type="text" 
                          value={newContractForm.ref}
                          onChange={(e) => setNewContractForm({...newContractForm, ref: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                          placeholder="e.g. C-2026-X"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Contracting Party</label>
                        <input 
                          type="text" 
                          value={newContractForm.party}
                          onChange={(e) => setNewContractForm({...newContractForm, party: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                          placeholder="e.g. Atkins Global"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Affiliated Project</label>
                        <input 
                          type="text" 
                          value={newContractForm.affiliatedProject}
                          onChange={(e) => setNewContractForm({...newContractForm, affiliatedProject: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                          placeholder="e.g. Metropolis Plaza"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Project ID (PID)</label>
                        <input 
                          type="text" 
                          value={newContractForm.pid}
                          onChange={(e) => setNewContractForm({...newContractForm, pid: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                          placeholder="e.g. 101"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Fiscal Valuation</label>
                        <input 
                          type="text" 
                          value={newContractForm.amount}
                          onChange={(e) => setNewContractForm({...newContractForm, amount: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                          placeholder="e.g. 12M FCFA"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Signing Date</label>
                        <input 
                          type="date" 
                          value={newContractForm.signedDate}
                          onChange={(e) => setNewContractForm({...newContractForm, signedDate: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Expiration Date</label>
                        <input 
                          type="date" 
                          value={newContractForm.expiration}
                          onChange={(e) => setNewContractForm({...newContractForm, expiration: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">Legal Status</label>
                        <select 
                          value={newContractForm.status}
                          onChange={(e) => setNewContractForm({...newContractForm, status: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-3 text-sm focus:border-[#F26A36] focus:outline-none"
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Expired">Expired</option>
                          <option value="Terminated">Terminated</option>
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleAddContract}
                      className="w-full py-4 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#F26A36]/20 transition-all hover:scale-[1.02]"
                    >
                      Commit to Legal Archives
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className="bg-[#161920] rounded-2xl border border-[#262B37] p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Legal Archives</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Repository of signed agreements and legal commitments.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <button 
                    onClick={() => alert('CSV Export protocol initiated. File will be dispatched to your executive email.')}
                    className="px-4 py-2 bg-white/5 border border-[#262B37] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Export CSV
                  </button>
                  <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search archives by title, party or project..."
                      value={contractSearch}
                      onChange={(e) => setContractSearch(e.target.value)}
                      className="w-full bg-[#0D0F12] border border-[#262B37] pl-10 pr-4 py-2 rounded-xl text-[10px] uppercase font-bold focus:border-[#F26A36] focus:outline-none"
                    />
                  </div>
                  <select 
                    value={contractFilter}
                    onChange={(e) => setContractFilter(e.target.value)}
                    className="bg-[#0D0F12] border border-[#262B37] text-[10px] font-black uppercase px-4 py-2 rounded-xl focus:outline-none focus:border-[#F26A36]"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                  </select>
                  <button 
                    onClick={() => setIsAddingContract(true)}
                    className="px-6 py-2 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#F26A36]/20"
                  >
                    New Agreement
                  </button>
                </div>
              </div>

              {isLoadingContracts ? (
                <div className="py-20 text-center animate-pulse text-slate-500 uppercase font-black tracking-widest text-xs">
                  Decrypting Legal Archives...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredContracts.map((ctr) => (
                    <motion.div 
                      layout
                      key={ctr.id} 
                      className="p-6 bg-[#0D0F12] border border-[#262B37] rounded-3xl group hover:border-[#F26A36]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-black uppercase tracking-tight leading-tight mb-1">{ctr.title}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Ref: {ctr.ref}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                            ctr.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                            ctr.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 
                            'bg-slate-500/10 text-slate-500'
                          }`}>
                            {ctr.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] text-[#F26A36] font-black uppercase tracking-widest mb-0.5">Affiliated Project</p>
                            <p className="text-xs font-bold text-white mb-0.5">{ctr.affiliatedProject}</p>
                            <p className="text-[9px] text-slate-500 font-bold">PID: {ctr.pid}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#F26A36] font-black uppercase tracking-widest mb-0.5">Contracting Party</p>
                            <p className="text-xs font-bold text-white">{ctr.party}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-[#262B37] pt-4">
                          <div>
                            <p className="text-[9px] text-slate-500 font-black uppercase mb-0.5">Signed Date</p>
                            <p className="text-[10px] font-bold text-slate-300 font-mono">{ctr.signedDate}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-500 font-black uppercase mb-0.5">Expiration</p>
                            <p className="text-[10px] font-bold text-slate-300 font-mono">{ctr.expiration}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-xl font-black text-white font-mono">{ctr.amount}</div>
                        <div className="flex gap-2">
                           {ctr.verified && (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20 text-[8px] font-black uppercase">
                               <ShieldCheck size={10} />
                               Contract Verified
                             </div>
                           )}
                           <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400">
                             <Monitor size={14} />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filteredContracts.length === 0 && (
                    <div className="md:col-span-2 py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                      No legal archives matched the search parameters.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'employees':
        return (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center mb-6">
               <div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter">Human Resources</h2>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Talent Repository</p>
               </div>
               <div className="flex gap-3">
                 <button 
                  onClick={exportContactsPDF}
                  className="px-4 py-2 bg-[#F26A36]/10 text-[#F26A36] border border-[#F26A36]/20 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#F26A36]/20 transition-all"
                 >
                   Export Directory A4 PDF
                 </button>
                 {['CEO', 'SECRETARY'].includes(role) && (
                   <button 
                    onClick={() => setIsAddingEmployee(true)}
                    className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-slate-200"
                   >
                     <UserPlus size={14} /> Add Employee
                   </button>
                 )}
               </div>
            </div>

            {/* Onboard Employee Modal */}
            <AnimatePresence>
              {isAddingEmployee && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-[#161920] border border-[#262B37] p-8 rounded-3xl space-y-6 shadow-2xl relative text-left"
                  >
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">Onboard Project Staff</h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Human resources enrollment console</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Employee Full Name</label>
                        <input 
                          type="text" 
                          value={newEmployeeForm.name}
                          onChange={(e) => setNewEmployeeForm({...newEmployeeForm, name: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                          placeholder="e.g. Jean-Pierre Belinga"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Operational Role</label>
                        <select 
                          value={newEmployeeForm.role}
                          onChange={(e) => setNewEmployeeForm({...newEmployeeForm, role: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                        >
                          <option value="ENGINEER">ENGINEER</option>
                          <option value="FOREMAN">FOREMAN</option>
                          <option value="HEAVY MACHINERY OPERATOR">HEAVY MACHINERY OPERATOR</option>
                          <option value="CIVIL INSPECTOR">CIVIL INSPECTOR</option>
                          <option value="SITE SECURITY">SITE SECURITY</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Duty Description</label>
                        <input 
                          type="text" 
                          value={newEmployeeForm.duty}
                          onChange={(e) => setNewEmployeeForm({...newEmployeeForm, duty: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                          placeholder="e.g. Overseeing foundation grading and concrete pours"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Duty Location Status</label>
                        <select 
                          value={newEmployeeForm.status}
                          onChange={(e) => setNewEmployeeForm({...newEmployeeForm, status: e.target.value})}
                          className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#F26A36]"
                        >
                          <option value="Headquarters">Headquarters</option>
                          <option value="Yaoundé Site A">Yaoundé Site A</option>
                          <option value="Douala Site B">Douala Site B</option>
                          <option value="Edea Hydro Hub">Edea Hydro Hub</option>
                          <option value="Kribi Logistic Site">Kribi Logistic Site</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button 
                        onClick={() => setIsAddingEmployee(false)}
                        className="px-5 py-2 bg-white/5 text-[9px] font-black uppercase text-slate-300 rounded-lg hover:bg-white/10"
                      >
                        Abort
                      </button>
                      <button 
                        onClick={handleCreateEmployee}
                        className="px-5 py-2 bg-[#F26A36] text-[9px] font-black uppercase text-white rounded-lg hover:bg-orange-600 animate-pulse"
                      >
                        Onboard Duty Staff
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((emp, i) => (
                <div key={i} className="p-6 bg-[#161920] border border-[#262B37] rounded-2xl space-y-4 hover:border-[#F26A36]/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 border-2 border-[#262B37] rounded-full flex items-center justify-center font-bold text-lg overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${emp.name}&backgroundColor=transparent`} alt={emp.name} />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-tight">{emp.name}</h3>
                      <p className="text-[10px] text-[#F26A36] uppercase font-black">{emp.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Current Duty</p>
                    <p className="text-xs text-white/80 leading-relaxed italic">"{emp.duty}"</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#262B37] text-[10px] font-bold uppercase text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {emp.status}
                    </span>
                    <button className="text-white hover:underline">Full Dossier</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'invoices':
        const filteredInvoices = invoices.filter(inv => 
          inv.client?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
          inv.id?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
          inv.status?.toLowerCase().includes(invoiceSearch.toLowerCase())
        );

        return (
          <div className="space-y-6">
            <div className="bg-[#161920] border border-[#262B37] rounded-3xl overflow-hidden p-8 text-left">
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                 <div>
                   <h2 className="text-2xl font-black uppercase tracking-tighter">Fiscal Audit & Invoices</h2>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Official Financial Records System</p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                   {['CEO', 'FINANCIAL OFFICER', 'ACCOUNTANT'].includes(role) && (
                     <button 
                       onClick={() => setIsAddingInvoice(true)}
                       className="px-5 py-3 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors"
                     >
                       Issue Invoice
                     </button>
                   )}
                   <div className="relative flex-1">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                     <input 
                       type="text" 
                       placeholder="Search invoices..." 
                       value={invoiceSearch}
                       onChange={(e) => setInvoiceSearch(e.target.value)}
                       className="w-full bg-[#0D0F12] border border-[#262B37] pl-10 pr-4 py-3 rounded-xl text-[10px] uppercase font-bold focus:border-[#F26A36] focus:outline-none"
                     />
                   </div>
                   <button 
                     onClick={exportInvoicesPDF}
                     className="px-6 py-3 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-[#F26A36]/10 hover:scale-[1.02] transition-all"
                   >
                     Download Ledger
                   </button>
                 </div>
               </div>
               <div className="space-y-4">
                 {filteredInvoices.map((inv, i) => (
                   <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#0D0F12] border border-[#262B37] rounded-xl hover:bg-white/5 transition-colors gap-4">
                     <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono font-bold text-slate-400">{inv.id}</div>
                        <div>
                           <p className="text-sm font-bold uppercase">{inv.client}</p>
                           <p className="text-[10px] text-[#F26A36] font-black">{inv.amount}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {inv.status}
                        </span>
                        <button 
                          onClick={() => generatePDF(`Invoice ${inv.id}`, `Client: ${inv.client}\nAmount: ${inv.amount}\nStatus: ${inv.status}`)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Monitor size={14} />
                        </button>
                     </div>
                   </div>
                 ))}
                 {filteredInvoices.length === 0 && (
                   <div className="py-10 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                     No invoices found matching "{invoiceSearch}"
                   </div>
                 )}
               </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 relative">
            <AnimatePresence>
              {isLockoutActive && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-red-950/95 backdrop-blur-3xl flex flex-col items-center justify-center border-4 border-red-500"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <ShieldCheck size={120} className="text-white mb-8 drop-shadow-[0_0_50px_rgba(255,0,0,0.8)]" />
                  </motion.div>
                  <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">GLOBAL LOCKOUT</h2>
                  <p className="text-red-200 text-xl font-bold uppercase tracking-[0.5em] animate-pulse">Total System Isolation Active</p>
                  <div className="mt-12 flex gap-4">
                    <div className="w-12 h-1 bg-red-500"></div>
                    <div className="w-12 h-1 bg-red-500"></div>
                    <div className="w-12 h-1 bg-red-500"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isTracing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
                >
                  <div className="w-full max-w-lg space-y-8 text-center">
                    <motion.div 
                      className="relative w-64 h-64 mx-auto"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, ease: "linear" }}
                    >
                      <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full"></div>
                      <div className="absolute inset-[15%] border border-emerald-500/10 rounded-full"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                    </motion.div>
                    
                    <div className="space-y-4">
                      <h2 className="text-4xl font-black text-emerald-500 uppercase tracking-tighter">
                        {isTracingStep === 1 ? 'Digital Tracking' : isTracingStep === 2 ? 'Node Analysis' : 'Physical Triangulation'}
                      </h2>
                      <div className="font-mono text-emerald-500/80 text-sm space-y-1">
                        <p>{`> INTERCEPTING NODE: ${isTracing}`}</p>
                        <p>{isTracingStep >= 1 ? `> PACKET_INTERCEPT: [COMPLETE]` : `> PACKET_INTERCEPT: [PENDING]`}</p>
                        <p>{isTracingStep >= 2 ? `> DIGITAL_FOOTPRINT: LOGGED_YAD-88` : `> ANALYZING ROUTING_HOPS...`}</p>
                        <p>{isTracingStep >= 3 ? `> SAT-RELAY: ALPHA-7 [LOCKED]` : `> TRIANGULATING SAT-RELAY...`}</p>
                        <motion.p 
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                        >{`> [ SEARCHING SECTOR 102-B ]`}</motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-red-500/20 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-[#262B37] pb-4">
                 <div>
                   <h2 className="text-2xl font-black text-red-500 flex items-center gap-3">
                     <ShieldCheck size={28} />
                     Security Terminal
                   </h2>
                   <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Intrusion Detection & Command Audit</p>
                 </div>
                 <div className="flex gap-3">
                   <button 
                    onClick={exportSecurityAudit}
                    className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors"
                   >
                     Export System Audit
                   </button>
                   <button 
                    onClick={() => setIsLockoutConfirmOpen(true)}
                    className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors"
                   >
                     Emergency Lockout
                   </button>
                 </div>
              </div>

              <AnimatePresence>
                {isLockoutConfirmOpen && (
                  <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-md bg-[#161920] border border-red-500/30 rounded-3xl p-8 space-y-6 shadow-2xl"
                    >
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                          <Lock size={32} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-red-500">Confirm Global Lockout</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                          WARNING: This action will sever all external API connections, revoke all active command keys, and isolate the MADECC mainframe. This is a non-transient security event.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setIsLockoutConfirmOpen(false)}
                          className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                        >
                          Abort Protocol
                        </button>
                        <button 
                          onClick={triggerEmergencyLockout}
                          className="flex-1 py-4 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all"
                        >
                          Confirm Isolation
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Lock size={12} className="text-emerald-500" />
                        Active AI Command Keys
                      </h3>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {securityLogs.filter(l => l.notes.includes('Command Key')).map((log, idx) => (
                           <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-emerald-500/80">
                             {`> [${new Date(log.timestamp).toLocaleTimeString()}] ${log.notes}`}
                           </div>
                        ))}
                        {commandKeys.map(key => (
                          <motion.div 
                            layout
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            key={key.id} 
                            className="p-5 bg-[#161920]/60 border border-[#262B37] rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all"
                          >
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                                 <Lock size={16} />
                               </div>
                               <div>
                                  <p className="text-sm font-mono font-black tracking-widest text-emerald-400">{key.id}</p>
                                  <p className="text-[10px] text-[#718096] uppercase font-bold">{key.assigned} • {key.created}</p>
                               </div>
                             </div>
                             <button 
                              onClick={() => {
                                if(confirm(`Revoke access for key ${key.id}?`)) revokeKey(key.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-all text-red-500 p-2 hover:bg-red-500/10 rounded-lg"
                             >
                               Revoke
                             </button>
                          </motion.div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setIsProvisioningKey(true)}
                        className="w-full py-4 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-emerald-500/5 mb-2"
                      >
                        Provision & Dispatch Key via Email
                      </button>
                      <button 
                        onClick={generateKey}
                        className="w-full py-3 bg-white/5 text-slate-400 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/10"
                      >
                        Generate Local Temporary Key
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Monitor size={12} className="text-red-500" />
                        Flagged Neural Intrusions
                      </h3>
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {intrusions.map(intrusion => (
                          <motion.div 
                            layout
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={intrusion.id} 
                            className="p-6 bg-red-950/10 border border-red-500/20 rounded-3xl relative overflow-hidden group hover:border-red-500/40 transition-all"
                          >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Monitor size={80} /></div>
                            <div className="space-y-5 relative z-10">
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-black bg-red-600 text-white px-3 py-1 rounded-full">{intrusion.threat} LEVEL THREAT</span>
                                 <span className="text-[10px] font-mono text-slate-500 font-bold">{intrusion.timestamp}</span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-black leading-tight text-white uppercase tracking-tighter">
                                  Unauthorized Bridge Attempt
                                </p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                  Traced to remote node in {intrusion.location}
                                </p>
                              </div>
                              
                              <button 
                                onClick={() => setSelectedIntrusion(intrusion)}
                                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#F26A36] hover:bg-[#F26A36] hover:text-white transition-all shadow-lg"
                              >
                                View Digital Footprint
                              </button>

                              <div className="grid grid-cols-2 gap-3 pb-1">
                                <button 
                                  onClick={() => generatePDF(`Security_Fault_${intrusion.id}`, `THREAT LEVEL: ${intrusion.threat}\nIP: ${intrusion.ip}\nLOCATION: ${intrusion.location}\nFINGERPRINT: ${intrusion.fingerprint}\n\nSYSTEM NOTE: ${intrusion.details}`)}
                                  className="py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase transition-all hover:bg-white/10"
                                >
                                  Export Report
                                </button>
                                <button 
                                  onClick={() => tracePhysical(intrusion.ip)}
                                  className="py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase transition-all hover:bg-red-600 hover:border-red-600"
                                >
                                  Trace Physical
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
            </div>

            <AnimatePresence>
              {selectedIntrusion && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-2xl bg-[#161920] border border-red-500/30 rounded-[2rem] p-10 overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full"></div>
                    
                    <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-3xl font-black uppercase text-red-500 tracking-tighter">Forensic Analysis</h3>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Intrusion Incident #{selectedIntrusion.id}</p>
                        </div>
                        <button 
                          onClick={() => setSelectedIntrusion(null)}
                          className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
                        >
                          <LogOut size={20} className="rotate-180" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-black/40 p-5 rounded-2xl border border-[#262B37]">
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Origin Node IP</p>
                          <p className="text-xl font-mono text-white font-bold">{selectedIntrusion.ip}</p>
                        </div>
                        <div className="bg-black/40 p-5 rounded-2xl border border-[#262B37]">
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Location Data</p>
                          <p className="text-xl font-mono text-white font-bold">{selectedIntrusion.location}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-6 bg-black/60 rounded-2xl border border-red-500/10">
                          <p className="text-[10px] font-black uppercase text-red-500/70 mb-3">Threat Fingerprint</p>
                          <p className="text-xs font-mono text-slate-300 break-all leading-relaxed line-clamp-3">
                            {selectedIntrusion.fingerprint}
                          </p>
                        </div>
                        <div className="p-6 bg-black/60 rounded-2xl border border-[#262B37]">
                          <p className="text-[10px] font-black uppercase text-white/50 mb-3">System Log Summary</p>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            {selectedIntrusion.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={() => tracePhysical(selectedIntrusion.ip)}
                          className="flex-1 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          Initiate Counter-Trace
                        </button>
                        <button 
                          onClick={() => generatePDF(`Forensic_Footprint_${selectedIntrusion.id}`, selectedIntrusion.details)}
                          className="px-8 py-4 bg-white/5 border border-[#262B37] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                        >
                          Export Log
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isProvisioningKey && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-[#161920] border border-emerald-500/30 rounded-[2rem] p-10 space-y-8 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock size={32} />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter">Secure Provisioning</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Generate AI dispatch via SMTP Relay</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Recipient Email</label>
                        <input 
                          type="email" 
                          value={provisioningForm.email}
                          onChange={(e) => setProvisioningForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-4 text-xs font-mono focus:border-emerald-500 focus:outline-none transition-all"
                          placeholder="EXECUTIVE_RECIPIENT@MADECC.COM"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Access Role</label>
                        <select 
                          value={provisioningForm.role}
                          onChange={(e) => setProvisioningForm(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full bg-[#0D0F12] border border-[#262B37] rounded-xl p-4 text-xs font-bold uppercase focus:border-emerald-500 focus:outline-none appearance-none"
                        >
                          <option value="ENGINEER">Site Engineer</option>
                          <option value="MANAGER">Project Manager</option>
                          <option value="AUDITOR">Financial Auditor</option>
                          <option value="GOVERNMENT">Regulatory Body</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsProvisioningKey(false)}
                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleProvisionKey}
                        disabled={provisioningStatus === 'loading'}
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          provisioningStatus === 'loading' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' :
                          provisioningStatus === 'success' ? 'bg-emerald-500 text-white' :
                          'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:scale-[1.02]'
                        }`}
                      >
                        {provisioningStatus === 'loading' ? 'Dispatching...' : 
                         provisioningStatus === 'success' ? 'Dispatched' : 
                         'Provision & Send'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'receipts':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet size={40} /></div>
                 <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">Total Expenses (MTD)</p>
                 <p className="text-2xl font-black text-white font-mono">148.5M XAF</p>
              </div>
              <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Monitor size={40} /></div>
                 <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-1">Pending Validation</p>
                 <p className="text-2xl font-black text-white font-mono">12 Receipts</p>
              </div>
              <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={40} /></div>
                 <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-1">Tax Deductible</p>
                 <p className="text-2xl font-black text-white font-mono">18.2M XAF</p>
              </div>
            </div>

            <div className="bg-[#161920] border border-[#262B37] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] blur-[100px] rounded-full -mr-48 -mt-48"></div>
               
               <div className="relative z-10">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-[#262B37] pb-8">
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Transaction Ledger</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Digitalized expenditure verification</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => {
                          const ledger = "DIGITAL TRANSACTION LEDGER - MAY 2026\n\n" + 
                            "RCP-8812 | Steel-Cam Industries | 8,450,000 XAF | Verified\n" +
                            "RCP-8813 | TotalEnergies | 1,200,000 XAF | Pending\n" +
                            "RCP-8814 | Concrete Solutions | 12,000,000 XAF | Verified\n" +
                            "RCP-8815 | Global Office | 450,000 XAF | Verified";
                          generatePDF('Financial Ledger Export', ledger);
                        }}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                      >
                        Export Full Ledger
                      </button>
                      <div className="relative flex-1 md:flex-initial">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Search receipts..." 
                          className="w-full bg-[#0D0F12] border border-[#262B37] pl-10 pr-4 py-2 rounded-xl text-[10px] uppercase font-bold focus:border-[#F26A36] focus:outline-none"
                        />
                      </div>
                      <button className="px-4 py-2 bg-white/5 border border-[#262B37] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        Filter
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(receipts && receipts.length > 0 ? receipts : [
                      { rcpId: 'RCP-8812', vendor: 'Steel-Cam Industries', category: 'Materials', amount: '8,450,000 XAF', date: 'May 14, 2026', status: 'Verified' },
                      { rcpId: 'RCP-8813', vendor: 'TotalEnergies Logistics', category: 'Fuel', amount: '1,200,000 XAF', date: 'May 13, 2026', status: 'Pending' },
                      { rcpId: 'RCP-8814', vendor: 'Concrete Solutions SARL', category: 'Materials', amount: '12,000,000 XAF', date: 'May 12, 2026', status: 'Verified' },
                      { rcpId: 'RCP-8815', vendor: 'Global Office Supplies', category: 'Admin', amount: '450,000 XAF', date: 'May 10, 2026', status: 'Verified' }
                    ]).map((rcp: any, i: number) => {
                      const displayId = rcp.rcpId || rcp.id || `RCP-${8812+i}`;
                      const displayDate = rcp.date || rcp.createdAt || 'May 10, 2026';
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={displayId} 
                          className="p-5 bg-black/40 border border-[#262B37] rounded-2xl flex flex-col md:flex-row md:items-center justify-between group hover:border-[#F26A36]/40 transition-all gap-4"
                        >
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-[#F26A36] transition-colors">
                                 <Receipt size={20} />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2">
                                    <p className="text-sm font-black uppercase tracking-tight">{rcp.vendor}</p>
                                    <span className="text-[10px] font-mono text-slate-500 font-bold">{displayId}</span>
                                 </div>
                                 <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    <span className="text-slate-500">{rcp.category}</span>
                                    <span className="text-slate-700">•</span>
                                    <span className="text-slate-500">{displayDate}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-[#262B37] pt-4 md:pt-0">
                              <div className="text-right">
                                 <p className="text-lg font-black text-white font-mono">{rcp.amount}</p>
                                 <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${rcp.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                   {rcp.status}
                                 </span>
                              </div>
                              <button 
                                onClick={() => generatePDF(`Receipt_${displayId}`, `Vendor: ${rcp.vendor}\nCategory: ${rcp.category}\nAmount: ${rcp.amount}\nDate: ${displayDate}\nStatus: ${rcp.status}\n\nMADECC Official Financial Record.`)}
                                className="p-3 bg-white/5 border border-[#262B37] rounded-xl hover:bg-[#F26A36] hover:text-white transition-all shadow-lg"
                              >
                                 <FileText size={18} />
                              </button>
                           </div>
                        </motion.div>
                      );
                    })}
                  </div>

                 <div className="mt-10 flex justify-center">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                       Load Archive Data
                    </button>
                 </div>
               </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-[#F26A36]/10 text-[#F26A36] rounded-2xl flex items-center justify-center animate-pulse">
                <Settings size={32} />
             </div>
             <div>
                <h3 className="text-xl font-black uppercase tracking-widest">Module Initializing</h3>
                <p className="text-sm text-slate-500 font-bold uppercase">This command sector is currently syncing with the mainframe.</p>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] flex text-white font-sans selection:bg-[#F26A36]">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-[#161920] border-r border-[#262B37] z-50 flex flex-col transition-all duration-300 shadow-2xl"
      >
        <div className="p-6 flex items-center justify-between border-b border-[#262B37]">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="bg-[#F26A36] p-1.5 rounded shadow-lg">
                <Building2 className="text-white" size={20} />
              </div>
              <span className="font-black tracking-tighter text-lg uppercase">MADECC</span>
            </div>
          ) : (
            <Building2 className="text-[#F26A36] mx-auto" size={24} />
          )}
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {filteredMenu.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${activeView === item.id ? 'bg-[#F26A36] text-white shadow-lg shadow-[#F26A36]/20 font-bold' : 'text-[#718096] hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={20} className={activeView === item.id ? 'text-white' : 'text-[#F26A36] group-hover:scale-110 transition-transform'} />
              {isSidebarOpen && <span className="text-xs uppercase tracking-widest truncate">{item.label}</span>}
              {isSidebarOpen && activeView === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#262B37]">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-xs uppercase font-bold tracking-widest">Secure Exit</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
        <header className="fixed top-0 right-0 bg-[#0D0F12]/80 backdrop-blur-md border-b border-[#262B37] z-40 py-4 px-8 flex items-center justify-between" style={{ left: isSidebarOpen ? '280px' : '80px', transition: 'left 0.3s' }}>
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[#F26A36]"
             >
               <Monitor size={20} />
             </button>
             <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Query system database..." 
                  className="bg-[#161920] border border-[#262B37] pl-10 pr-4 py-2 rounded-full text-xs focus:outline-none focus:border-[#F26A36]/50 transition-all w-64"
                />
             </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black uppercase tracking-tighter">{userName}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">{role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F26A36] to-red-600 border-2 border-[#262B37] shadow-xl overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=transparent`} alt="User" />
                </div>
              </div>
              <div className="flex items-center gap-3 border-l border-[#262B37] pl-6">
                 <button className="p-2 text-slate-400 hover:text-white relative"><Bell size={18} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0D0F12]"></span></button>
                 <button className="p-2 text-slate-400 hover:text-white"><Settings size={18} /></button>
              </div>
           </div>
        </header>

        <div className="pt-24 px-8 pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-end mb-10">
                 <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                       {activeView.replace('-', ' ')}
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#718096]">
                       <ShieldCheck size={12} className="text-[#F26A36]" />
                       Terminal Status: Authorized (Level 01)
                    </div>
                    {role !== 'CEO' && (
                      <div className="mt-4 p-4 bg-[#F26A36]/5 border border-[#F26A36]/20 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#F26A36]/10 rounded-full flex items-center justify-center text-[#F26A36]">
                           <Activity size={20} className="animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Active Operational Duty</p>
                          <p className="text-xs font-bold text-white italic">"{staffList.find(s => s.name === userName)?.duty || 'Standard Operational Protocols'}"</p>
                        </div>
                      </div>
                    )}
                 </div>
                 {activeView === 'overview' && (
                   <button 
                    onClick={() => setActiveView('security')}
                    className="flex items-center gap-2 px-6 py-2 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 shadow-xl shadow-[#F26A36]/10"
                   >
                     <UserPlus size={14} />
                     Provision Access
                   </button>
                 )}
              </div>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const KpiCard = ({ label, value, icon: Icon, trend, color }: any) => (
  <div className="p-6 bg-[#161920] rounded-2xl border border-[#262B37] group hover:border-[#F26A36]/30 transition-all shadow-xl">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[10px] text-[#718096] uppercase font-black tracking-widest">{label}</p>
      <div className="p-2 bg-[#0D0F12] rounded-lg border border-[#262B37] group-hover:border-[#F26A36]/50 transition-colors">
        <Icon size={16} className="text-[#F26A36]" />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <p className={`text-2xl font-black truncate ${color || 'text-white'}`}>{value}</p>
      {trend && (
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
          {trend}
        </span>
      )}
    </div>
  </div>
);

const ProjectsTable = ({ projects = [], onProjectClick }: { projects?: any[], onProjectClick: (p: any) => void }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#262B37] text-[#4A5568] text-[9px] font-black uppercase tracking-[0.2em]">
            <th className="px-4 py-4">Identifier</th>
            <th className="px-4 py-4">Project Title</th>
            <th className="px-4 py-4 text-right">Valuation</th>
            <th className="px-4 py-4">Progress Line</th>
            <th className="px-4 py-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262B37]/30 text-[10px]">
          {(projects || []).map((p) => (
            <tr 
              key={p.id} 
              onClick={() => onProjectClick(p)}
              className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
            >
              <td className="px-4 py-5 font-mono text-[#F26A36] font-bold">PRJ-{p.id}</td>
              <td className="px-4 py-5 font-black uppercase tracking-tight truncate max-w-[150px]">{p.name}<br /><span className="text-[8px] text-slate-500 normal-case font-normal">{p.location}</span></td>
              <td className="px-4 py-5 text-right font-bold text-slate-300 font-mono">{p.budget}</td>
              <td className="px-4 py-5">
                <div className="w-full h-1 bg-[#262B37] rounded-full overflow-hidden">
                   <div className="h-full transition-all duration-1000" style={{ width: `${p.progress}%`, backgroundColor: p.color }}></div>
                </div>
              </td>
              <td className="px-4 py-5">
                <div className="flex justify-center">
                   <span className="px-2 py-0.5 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest bg-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                     {p.status}
                   </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
