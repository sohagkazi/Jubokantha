"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, XCircle, Edit, Trash2, AlertTriangle, User, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/services';
import { executiveMembers } from '@/components/executive-committee';

export default function CommitteeAdminPage() {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'executive' | 'advisory'>('executive');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const initialFormState = {
    name: '',
    designation: '',
    nationality: 'Bangladeshi',
    gender: 'Male',
    address: '',
    occupation: '',
    order: 0,
    imageUrl: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setLoading(true);
    const collectionName = activeTab === 'executive' ? 'executive_members' : 'advisory_members';
    const q = query(collection(db, collectionName), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeTab]);

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.designation?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || '',
      designation: member.designation || '',
      nationality: member.nationality || 'Bangladeshi',
      gender: member.gender || 'Male',
      address: member.address || '',
      occupation: member.occupation || '',
      order: member.order || 0,
      imageUrl: member.imageUrl || ''
    });
    setImageFile(null);
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
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, "committee");
      }

      const dataToSave = {
        ...formData,
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp()
      };

      const collectionName = activeTab === 'executive' ? 'executive_members' : 'advisory_members';

      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), dataToSave);
      } else {
        await addDoc(collection(db, collectionName), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }

      setIsModalOpen(false);
      setFormData(initialFormState);
      setImageFile(null);
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
      const collectionName = activeTab === 'executive' ? 'executive_members' : 'advisory_members';
      await deleteDoc(doc(db, collectionName, deletingId));
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    } catch (error: any) {
      alert("Failed to delete: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportDefaults = async () => {
    setIsSubmitting(true);
    try {
      for (const member of executiveMembers) {
        await addDoc(collection(db, 'executive_members'), {
          name: member.name,
          designation: member.designation,
          nationality: member.nationality,
          gender: member.gender,
          address: member.address,
          occupation: member.occupation,
          order: member.id,
          imageUrl: '',
          createdAt: serverTimestamp()
        });
      }
      alert("Default members imported successfully!");
    } catch (error: any) {
      console.error("Error importing members:", error);
      alert(`Failed to import: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Committee Members</h2>
          <p className="text-muted-foreground">Manage the committee and advisory members of the organization.</p>
        </div>
        <div className="flex gap-2">
          {members.length === 0 && !loading && activeTab === 'executive' && (
            <Button onClick={handleImportDefaults} variant="outline" disabled={isSubmitting} className="border-primary text-primary hover:bg-primary/10">
              {isSubmitting ? "Importing..." : "Import Default Members"}
            </Button>
          )}
          <Button onClick={openAddModal} className="bg-primary text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New {activeTab === 'executive' ? 'Member' : 'Advisor'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('executive')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'executive' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Executive Committee
        </button>
        <button
          onClick={() => setActiveTab('advisory')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'advisory' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Advisory Panel
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="text-lg">Member List</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="text" 
                placeholder="Search by name or designation..." 
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
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Loading members...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          {member.imageUrl ? (
                            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name?.replace(/\s+/g, '')}&backgroundColor=c0aede`} alt={member.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {member.designation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{member.order}</td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
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
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-[#0f6e36] px-6 py-4 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {editingId ? "Edit Member" : "Add New Member"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                <form id="committeeForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="designation" className="text-sm font-semibold text-gray-700">Designation *</Label>
                      <Input id="designation" name="designation" value={formData.designation} onChange={handleInputChange} required placeholder="e.g. President" />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="order" className="text-sm font-semibold text-gray-700">Display Order</Label>
                      <Input id="order" name="order" type="number" value={formData.order} onChange={handleInputChange} placeholder="1 = First, 2 = Second..." />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="nationality" className="text-sm font-semibold text-gray-700">Nationality</Label>
                      <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleInputChange} />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
                      <select 
                        id="gender" 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="occupation" className="text-sm font-semibold text-gray-700">Occupation</Label>
                      <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} />
                    </div>
                    
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                    </div>
                    
                    <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-gray-100">
                      <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Profile Photo</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          {imageFile ? (
                            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                          ) : formData.imageUrl ? (
                            <img src={formData.imageUrl} alt="Current" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="max-w-[250px] cursor-pointer" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing photo (or to use default avatar if new).</p>
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
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  form="committeeForm"
                  disabled={isSubmitting}
                  className="bg-primary text-white rounded-xl px-8 h-11 font-medium hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Member" : "Add Member"}
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
