"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, CheckCircle2, XCircle, MoreVertical, User, Phone, MapPin, Calendar, FileText, Users, Home, Edit, Trash2, Upload, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, app } from '@/lib/firebase';
import * as XLSX from 'xlsx';

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const initialFormState = {
    formFee: '',
    date: new Date().toISOString().split('T')[0],
    
    // Personal Info
    name: '',
    dob: '',
    fatherHusbandName: '',
    motherName: '',
    presentAddress: '',
    nid: '',
    mobile: '',
    profession: '',
    permanentAddress: '',

    // Family Info
    totalFamilyMembers: '',
    totalMale: '',
    totalFemale: '',
    
    studyingMembers: '',
    studentMale: '',
    studentFemale: '',
    
    disabledMembers: '',
    disabledMale: '',
    disabledFemale: '',
    
    elderlyMembers: '',
    elderlyMale: '',
    elderlyFemale: '',

    // Socio-economic
    familyStatus: '',
    accommodation: '',

    // Introducer
    introducerName: '',
    introducerFatherHusband: '',
    introducerAddress: '',
    introducerAge: '',
    relationWithIntroducer: '',
    introducerMobile: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          let role = null;
          let docRef = doc(db, "users", user.uid);
          let docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            role = docSnap.data().role;
          } else {
            docRef = doc(db, "staff", user.uid);
            docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              role = docSnap.data().role;
            }
          }

          if (role) {
            const cleanRole = role.trim();
            const allowedRoles = ["Super Admin", "Admin"];
            if (allowedRoles.includes(cleanRole)) {
              setHasAccess(true);
            } else {
              setHasAccess(false);
            }
          }
        } catch (error) {
          console.error("Error checking role:", error);
          setHasAccess(false);
        }
      } else {
        setCurrentUser(null);
        setHasAccess(false);
      }
    });

    const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
    const unsubscribeMembers = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || 'Unknown',
        mobile: doc.data().mobile || doc.data().phone || 'N/A', 
        presentAddress: doc.data().presentAddress || doc.data().address || 'N/A',
        date: doc.data().date || doc.data().joinDate || 'N/A',
        status: doc.data().status || 'Active'
      }));
      setMembers(data);
      setLoading(false);
    });
    
    return () => {
      unsubscribeAuth();
      unsubscribeMembers();
    };
  }, []);

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.mobile?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'radio') {
       setFormData(prev => ({ ...prev, [name]: value }));
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getAddedBy = () => {
    if (!currentUser) return null;
    return {
      uid: currentUser.uid,
      email: currentUser.email,
      name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Admin',
      date: new Date().toISOString()
    };
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingId(member.id);
    setFormData({
      ...initialFormState,
      ...member
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'members', editingId), {
          ...formData,
          updatedAt: serverTimestamp(),
          updatedBy: getAddedBy()
        });
        alert("সদস্য সফলভাবে আপডেট করা হয়েছে!");
      } else {
        await addDoc(collection(db, 'members'), {
          ...formData,
          status: 'Active',
          createdAt: serverTimestamp(),
          addedBy: getAddedBy()
        });
        alert("সদস্য সফলভাবে যুক্ত করা হয়েছে!");
      }

      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
    } catch (error: any) {
      console.error("Error saving member:", error);
      alert(`Failed to save member: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'members', deletingId));
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    } catch (error: any) {
      alert("Failed to delete: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        let importedCount = 0;
        for (const row of data as any[]) {
          const nameStr = row['নাম'] || row['Name'] || row['name'] || '';
          if (!nameStr) continue;
          
          const newMember = {
            ...initialFormState,
            name: nameStr,
            mobile: row['মোবাইল'] || row['Mobile'] || row['mobile'] || row['Phone'] || row['phone'] || '',
            presentAddress: row['ঠিকানা'] || row['Address'] || row['address'] || '',
            status: 'Active',
            createdAt: serverTimestamp(),
            addedBy: getAddedBy()
          };
          
          await addDoc(collection(db, 'members'), newMember);
          importedCount++;
        }
        
        alert(`Successfully imported ${importedCount} members!`);
      } catch (error: any) {
        console.error("Error parsing excel:", error);
        alert(`Error importing data: ${error.message}`);
      } finally {
        setIsSubmitting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
        alert("Failed to read file!");
        setIsSubmitting(false);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">সদস্য ব্যবস্থাপনা (Member Management)</h2>
          <p className="text-muted-foreground">Manage branch members and their information.</p>
        </div>
        
        {hasAccess && (
          <div className="flex gap-2">
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleImportExcel} 
              ref={fileInputRef} 
              className="hidden" 
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Upload className="mr-2 h-4 w-4" /> Import Excel
            </Button>
            <Button onClick={openAddModal} className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> নতুন সদস্য যোগ করুন
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="text-lg">সদস্য তালিকা (Member List)</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="text" 
                placeholder="Search by name or phone..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">নাম (Name)</th>
                  <th className="px-4 py-3">মোবাইল (Mobile)</th>
                  <th className="px-4 py-3">ঠিকানা (Address)</th>
                  <th className="px-4 py-3">তারিখ (Date)</th>
                  <th className="px-4 py-3">Added By</th>
                  <th className="px-4 py-3">স্ট্যাটাস (Status)</th>
                  {hasAccess && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={hasAccess ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                      Loading members...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={hasAccess ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {member.name.charAt(0)}
                        </div>
                        {member.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{member.mobile}</td>
                      <td className="px-4 py-3 text-gray-600">{member.presentAddress}</td>
                      <td className="px-4 py-3 text-gray-600">{member.date}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {member.addedBy ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {member.addedBy.name || member.addedBy.email}
                            </span>
                        ) : (
                            <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center ${member.status === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>
                          {member.status === 'Active' ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                          {member.status}
                        </span>
                      </td>
                      {hasAccess && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => openEditModal(member)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => openDeleteModal(member.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-[#0f6e36] px-6 py-4 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {editingId ? "সদস্য তথ্য আপডেট (Edit Member)" : "সদস্য ভর্তি ফরম (Add Member)"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                <form id="memberForm" onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Section: Basic Top Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                    <div className="space-y-1.5">
                      <Label htmlFor="formFee" className="text-sm font-semibold text-gray-700">আবেদন ফরম ফিঃ</Label>
                      <Input id="formFee" name="formFee" value={formData.formFee} onChange={handleInputChange} placeholder="e.g. 100" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="date" className="text-sm font-semibold text-gray-700">তারিখঃ</Label>
                      <Input id="date" type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                    </div>
                  </div>

                  {/* Section: Personal Info */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      ব্যক্তিগত তথ্য (Personal Information)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">নামঃ *</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="dob" className="text-sm font-semibold text-gray-700">জন্ম তারিখঃ</Label>
                        <Input id="dob" type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="fatherHusbandName" className="text-sm font-semibold text-gray-700">পিতা/স্বামীর নামঃ</Label>
                        <Input id="fatherHusbandName" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="motherName" className="text-sm font-semibold text-gray-700">মাতার নামঃ</Label>
                        <Input id="motherName" name="motherName" value={formData.motherName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="presentAddress" className="text-sm font-semibold text-gray-700">বর্তমান ঠিকানাঃ *</Label>
                        <Input id="presentAddress" name="presentAddress" value={formData.presentAddress} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="nid" className="text-sm font-semibold text-gray-700">এন.আই.ডি নংঃ</Label>
                        <Input id="nid" name="nid" value={formData.nid} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="mobile" className="text-sm font-semibold text-gray-700">মোবাইল নংঃ *</Label>
                        <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="profession" className="text-sm font-semibold text-gray-700">পেশা</Label>
                        <Input id="profession" name="profession" value={formData.profession} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="permanentAddress" className="text-sm font-semibold text-gray-700">স্থায়ী ঠিকানাঃ</Label>
                        <Input id="permanentAddress" name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  {/* Section: Family Info */}
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      পারিবারিক তথ্য (Family Information)
                    </h4>
                    
                    <div className="space-y-6">
                      {/* Row 1 */}
                      <div className="grid grid-cols-3 gap-4 items-end">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">পরিবারের মোট সদস্য সংখ্যাঃ (জন)</Label>
                          <Input name="totalFamilyMembers" value={formData.totalFamilyMembers} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">পুরুষঃ</Label>
                          <Input name="totalMale" value={formData.totalMale} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">মহিলাঃ</Label>
                          <Input name="totalFemale" value={formData.totalFemale} onChange={handleInputChange} type="number" />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-3 gap-4 items-end">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">পড়াশুনা চলমানঃ (জন)</Label>
                          <Input name="studyingMembers" value={formData.studyingMembers} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">ছাত্রঃ</Label>
                          <Input name="studentMale" value={formData.studentMale} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">ছাত্রীঃ</Label>
                          <Input name="studentFemale" value={formData.studentFemale} onChange={handleInputChange} type="number" />
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="grid grid-cols-3 gap-4 items-end">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">প্রতিবন্ধী / পঙ্গুঃ (জন)</Label>
                          <Input name="disabledMembers" value={formData.disabledMembers} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">পুরুষঃ</Label>
                          <Input name="disabledMale" value={formData.disabledMale} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">মহিলাঃ</Label>
                          <Input name="disabledFemale" value={formData.disabledFemale} onChange={handleInputChange} type="number" />
                        </div>
                      </div>

                      {/* Row 4 */}
                      <div className="grid grid-cols-3 gap-4 items-end">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">বয়স্কঃ (জন)</Label>
                          <Input name="elderlyMembers" value={formData.elderlyMembers} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">পুরুষঃ</Label>
                          <Input name="elderlyMale" value={formData.elderlyMale} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-gray-700">মহিলাঃ</Label>
                          <Input name="elderlyFemale" value={formData.elderlyFemale} onChange={handleInputChange} type="number" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Socio-economic */}
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      পারিবারিক অবস্থা ও বাসস্থান
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">পারিবারিক অবস্থাঃ</Label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="familyStatus" value="দরিদ্র" onChange={handleInputChange} checked={formData.familyStatus === 'দরিদ্র'} className="w-4 h-4 text-primary" />
                            <span>দরিদ্র</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="familyStatus" value="হতদরিদ্র" onChange={handleInputChange} checked={formData.familyStatus === 'হতদরিদ্র'} className="w-4 h-4 text-primary" />
                            <span>হতদরিদ্র</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">বাসস্থানঃ</Label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="accommodation" value="ভাড়াকৃত" onChange={handleInputChange} checked={formData.accommodation === 'ভাড়াকৃত'} className="w-4 h-4 text-primary" />
                            <span>ভাড়াকৃত</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="accommodation" value="স্থায়ী" onChange={handleInputChange} checked={formData.accommodation === 'স্থায়ী'} className="w-4 h-4 text-primary" />
                            <span>স্থায়ী</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Introducer Info */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="bg-gray-900 text-white inline-block px-6 py-2 rounded-lg font-bold mb-6">
                      পরিচয়দানকারী
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="introducerName" className="text-sm font-semibold text-gray-700">পরিচয়দানকারীর নামঃ</Label>
                        <Input id="introducerName" name="introducerName" value={formData.introducerName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="introducerFatherHusband" className="text-sm font-semibold text-gray-700">পিতা/স্বামীর নামঃ</Label>
                        <Input id="introducerFatherHusband" name="introducerFatherHusband" value={formData.introducerFatherHusband} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="introducerAddress" className="text-sm font-semibold text-gray-700">ঠিকানাঃ</Label>
                        <Input id="introducerAddress" name="introducerAddress" value={formData.introducerAddress} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="relationWithIntroducer" className="text-sm font-semibold text-gray-700">পরিচয়দানকারীর সাথে সম্পর্কঃ</Label>
                        <Input id="relationWithIntroducer" name="relationWithIntroducer" value={formData.relationWithIntroducer} onChange={handleInputChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="introducerAge" className="text-sm font-semibold text-gray-700">বয়সঃ</Label>
                          <Input id="introducerAge" name="introducerAge" value={formData.introducerAge} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="introducerMobile" className="text-sm font-semibold text-gray-700">মোবাইল নংঃ</Label>
                          <Input id="introducerMobile" name="introducerMobile" value={formData.introducerMobile} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200 shrink-0 flex gap-3 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-6 h-11 font-medium hover:bg-gray-100"
                >
                  বাতিল করুন
                </Button>
                <Button 
                  type="submit" 
                  form="memberForm"
                  disabled={isSubmitting}
                  className="bg-primary text-white rounded-xl px-8 h-11 font-medium hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? "সংরক্ষণ করা হচ্ছে..." : editingId ? "আপডেট করুন" : "সদস্য যোগ করুন"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Member?</h3>
                <p className="text-gray-500 text-sm mb-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-11 font-medium"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-medium shadow-md"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Deleting..." : "Yes, Delete"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
