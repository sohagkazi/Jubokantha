"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, XCircle, Briefcase, ImageIcon, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/services';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', targetAmount: '' });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [editProgress, setEditProgress] = useState('');

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitProgress, setSubmitProgress] = useState("");
  const [formData, setFormData] = useState({ title: '', target: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ─── Add ───────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      let imageUrl = '';
      if (imageFile) {
        setSubmitProgress("Uploading image...");
        imageUrl = await uploadImage(imageFile, "project-images");
      }
      setSubmitProgress("Saving project...");
      await addDoc(collection(db, 'projects'), {
        title: formData.title,
        targetAmount: 0,
        description: formData.description,
        imageUrl: imageUrl,
        raisedAmount: 0,
        status: 'Active',
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ title: '', target: '', description: '' });
      setImageFile(null);
      setSubmitProgress("");
    } catch (error: any) {
      setSubmitProgress("");
      setSubmitError(error.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Edit ──────────────────────────────────────────────
  const openEditModal = (project: any) => {
    setEditingProject(project);
    setEditFormData({
      title: project.title || '',
      description: project.description || '',
      targetAmount: project.targetAmount?.toString() || '0',
    });
    setEditImageFile(null);
    setEditError('');
    setEditProgress('');
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setEditImageFile(e.target.files[0]);
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsEditSubmitting(true);
    setEditError('');
    try {
      let imageUrl = editingProject.imageUrl || '';
      if (editImageFile) {
        setEditProgress("Uploading new image...");
        imageUrl = await uploadImage(editImageFile, "project-images");
      }
      setEditProgress("Saving changes...");
      await updateDoc(doc(db, 'projects', editingProject.id), {
        title: editFormData.title,
        description: editFormData.description,
        targetAmount: parseFloat(editFormData.targetAmount) || 0,
        imageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
      });
      setIsEditModalOpen(false);
      setEditingProject(null);
      setEditProgress('');
    } catch (error: any) {
      setEditProgress('');
      setEditError(error.message || "Failed to update project");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────
  const openDeleteModal = (project: any) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'projects', deletingProject.id));
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
    } catch (error: any) {
      alert("Failed to delete: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Projects and Activities</h2>
          <p className="text-muted-foreground">Track funding targets and progress for each project.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Create New Project
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          No projects found. Click &quot;Create New Project&quot; to add one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const percentage = project.targetAmount > 0
              ? Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100))
              : 0;
            return (
              <Card key={project.id} className="overflow-hidden flex flex-col">
                {project.imageUrl && (
                  <div className="w-full h-48 bg-gray-100">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {project.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                  )}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-green-700">Raised: ৳{project.raisedAmount?.toLocaleString() || 0}</span>
                      <span className="text-muted-foreground">Target: ৳{project.targetAmount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-xs text-right text-muted-foreground">{percentage}%</p>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-auto flex gap-2">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => openEditModal(project)}
                    >
                      <Pencil className="h-4 w-4 mr-1.5" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      onClick={() => openDeleteModal(project)}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Add Project Modal ────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-[#0f6e36] px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Create Project
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 sm:p-8">
                {submitError && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{submitError}</div>}
                {submitProgress && <div className="mb-4 p-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm">{submitProgress}</div>}
                <form onSubmit={handleAddProject} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Project Title</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Briefcase className="h-4 w-4 text-gray-400" /></div>
                      <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Winter Clothes Distribution" className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50/50" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Project Details</Label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter project details and goals..." className="w-full p-3 min-h-[100px] border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-xl bg-gray-50/50 text-sm transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Project Image</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ImageIcon className="h-4 w-4 text-gray-400" /></div>
                      <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50/50 pt-2" />
                    </div>
                  </div>
                  <div className="pt-6 flex gap-3 justify-end border-t border-gray-100 mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl px-6 h-11 font-medium hover:bg-gray-100">Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary text-white rounded-xl px-6 h-11 font-medium hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                      {isSubmitting ? "Creating..." : "Create Project"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Project Modal ───────────────────────────── */}
      <AnimatePresence>
        {isEditModalOpen && editingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Pencil className="h-5 w-5" /> Edit Project
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 sm:p-8">
                {editError && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{editError}</div>}
                {editProgress && <div className="mb-4 p-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm">{editProgress}</div>}

                {/* Current image preview */}
                {editingProject.imageUrl && !editImageFile && (
                  <div className="mb-4">
                    <Label className="text-sm font-semibold text-gray-700 block mb-2">Current Image</Label>
                    <img src={editingProject.imageUrl} alt="current" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}
                {editImageFile && (
                  <div className="mb-4">
                    <Label className="text-sm font-semibold text-gray-700 block mb-2">New Image Preview</Label>
                    <img src={URL.createObjectURL(editImageFile)} alt="preview" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}

                <form onSubmit={handleEditProject} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-700">Project Title</Label>
                    <Input id="edit-title" name="title" value={editFormData.title} onChange={handleEditInputChange} placeholder="Project title" className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-xl bg-gray-50/50" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-description" className="text-sm font-semibold text-gray-700">Project Details</Label>
                    <textarea id="edit-description" name="description" value={editFormData.description} onChange={handleEditInputChange} placeholder="Project details..." className="w-full p-3 min-h-[100px] border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-xl bg-gray-50/50 text-sm transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-target" className="text-sm font-semibold text-gray-700">Target Amount (৳)</Label>
                    <Input id="edit-target" name="targetAmount" type="number" min="0" value={editFormData.targetAmount} onChange={handleEditInputChange} placeholder="e.g. 50000" className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-xl bg-gray-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-image" className="text-sm font-semibold text-gray-700">Change Image (optional)</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ImageIcon className="h-4 w-4 text-gray-400" /></div>
                      <Input id="edit-image" type="file" accept="image/*" onChange={handleEditImageChange} className="pl-10 h-11 border-gray-200 focus:border-blue-500 rounded-xl bg-gray-50/50 pt-2" />
                    </div>
                  </div>
                  <div className="pt-6 flex gap-3 justify-end border-t border-gray-100 mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="rounded-xl px-6 h-11 font-medium hover:bg-gray-100">Cancel</Button>
                    <Button type="submit" disabled={isEditSubmitting} className="bg-blue-600 text-white rounded-xl px-6 h-11 font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                      {isEditSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ─────────────────────────── */}
      <AnimatePresence>
        {isDeleteModalOpen && deletingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Project?</h3>
                <p className="text-gray-500 text-sm mb-1">
                  <span className="font-semibold text-gray-700">&quot;{deletingProject.title}&quot;</span> প্রোজেক্টটি স্থায়ীভাবে মুছে যাবে।
                </p>
                <p className="text-red-500 text-xs mb-6">এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-11 font-medium"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                  >
                    বাতিল
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-medium shadow-md"
                    onClick={handleDeleteProject}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "হ্যাঁ, মুছুন"}
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
