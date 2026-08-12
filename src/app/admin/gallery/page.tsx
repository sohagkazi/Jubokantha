"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, XCircle, ImageIcon, Trash2, AlertTriangle } from 'lucide-react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/services';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitProgress, setSubmitProgress] = useState("");
  const [formData, setFormData] = useState({ title: '' });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setSubmitError("Please select at least one image");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      let count = 1;
      for (const file of imageFiles) {
        setSubmitProgress(`Uploading image ${count} of ${imageFiles.length}...`);
        const imageUrl = await uploadImage(file, "gallery");
        
        await addDoc(collection(db, 'gallery'), {
          title: formData.title, // Shared title for batch upload
          imageUrl: imageUrl,
          createdAt: new Date().toISOString()
        });
        count++;
      }
      setIsModalOpen(false);
      setFormData({ title: '' });
      setImageFiles([]);
      setSubmitProgress("");
    } catch (error: any) {
      setSubmitProgress("");
      setSubmitError(error.message || "Failed to add image(s)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (image: any) => {
    setDeletingImage(image);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteImage = async () => {
    if (!deletingImage) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'gallery', deletingImage.id));
      setIsDeleteModalOpen(false);
      setDeletingImage(null);
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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gallery Management</h2>
          <p className="text-muted-foreground">Manage images displayed in the frontend gallery.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Add New Photo
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading gallery...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          No images found. Click &quot;Add New Photo&quot; to add one.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden flex flex-col group relative">
              <div className="w-full h-48 bg-gray-100">
                <img src={image.imageUrl} alt={image.title || 'Gallery item'} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate">{image.title || 'Untitled'}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(image.createdAt).toLocaleDateString()}</p>
              </CardContent>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openDeleteModal(image)}
                  className="bg-white text-red-600 p-1.5 rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Add Image Modal ────────────────────────────── */}
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
                  <ImageIcon className="h-5 w-5" /> Add Photo
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 sm:p-8">
                {submitError && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{submitError}</div>}
                {submitProgress && <div className="mb-4 p-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm">{submitProgress}</div>}
                
                {imageFiles.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm font-semibold text-gray-700 block mb-2">Preview ({imageFiles.length} images)</Label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                       {imageFiles.map((f, i) => (
                         <img key={i} src={URL.createObjectURL(f)} alt={`preview-${i}`} className="w-24 h-24 object-cover rounded-xl border border-gray-200 shrink-0" />
                       ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleAddImage} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Select Image(s) *</Label>
                    <Input id="image" type="file" accept="image/*" multiple onChange={handleImageChange} className="h-11 border-gray-200 focus:border-primary rounded-xl bg-gray-50/50 pt-2" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Image Title/Caption (Optional)</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Tree plantation event" className="h-11 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50/50" />
                  </div>
                  <div className="pt-6 flex gap-3 justify-end border-t border-gray-100 mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl px-6 h-11 font-medium hover:bg-gray-100">Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary text-white rounded-xl px-6 h-11 font-medium hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                      {isSubmitting ? "Uploading..." : "Upload Photo"}
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
        {isDeleteModalOpen && deletingImage && (
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Photo?</h3>
                <p className="text-gray-500 text-sm mb-1">
                  This photo will be permanently removed from the gallery.
                </p>
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-11 font-medium"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-medium shadow-md"
                    onClick={handleDeleteImage}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
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
