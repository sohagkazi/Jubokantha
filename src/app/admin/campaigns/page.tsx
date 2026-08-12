"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, XCircle, Briefcase, DollarSign, ImageIcon } from 'lucide-react';
import { collection, query, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/services';
import { motion, AnimatePresence } from 'framer-motion';

export default function CampaignsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitProgress, setSubmitProgress] = useState("");
  
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    description: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      let imageUrl = '';
      if (imageFile) {
        setSubmitProgress("Uploading image...");
        imageUrl = await uploadImage(imageFile, "campaign-images");
      }

      setSubmitProgress("Saving campaign to database...");
      await addDoc(collection(db, 'campaigns'), {
        title: formData.title,
        targetAmount: Number(formData.target),
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
      alert("Campaign created successfully!");
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      setSubmitProgress("");
      setSubmitError(error.message || "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Campaigns</h2>
          <p className="text-muted-foreground">Track funding targets and progress for each campaign.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Create New Campaign
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading campaigns...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          No campaigns found. Click "Create New Campaign" to add one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const percentage = project.targetAmount > 0 
              ? Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100)) 
              : 0;
            
            return (
              <Card key={project.id} className="overflow-hidden">
                {project.imageUrl && (
                  <div className="w-full h-48 bg-gray-100">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-green-700">Raised: ৳{project.raisedAmount?.toLocaleString() || 0}</span>
                      <span className="text-muted-foreground">Target: ৳{project.targetAmount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-xs text-right text-muted-foreground">{percentage}%</p>
                  </div>
                  <Button className="mt-4 w-full" variant="outline">Manage Campaign</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
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
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-[#0f6e36] px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Create Project
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 sm:p-8">
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}
                {submitProgress && (
                  <div className="mb-4 p-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm">
                    {submitProgress}
                  </div>
                )}
                <form onSubmit={handleAddProject} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Project Title</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        id="title" 
                        name="title" 
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Winter Clothes Distribution" 
                        className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50/50"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Project Details</Label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter project details and goals..." 
                      className="w-full p-3 min-h-[100px] border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-xl bg-gray-50/50 text-sm transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Project Image</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        id="image" 
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50/50 pt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="target" className="text-sm font-semibold text-gray-700">Target Amount (৳)</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        id="target" 
                        type="number" 
                        name="target" 
                        value={formData.target}
                        onChange={handleInputChange}
                        placeholder="e.g. 150000" 
                        className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50/50"
                        required 
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6 flex gap-3 justify-end border-t border-gray-100 mt-6">
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
                      disabled={isSubmitting}
                      className="bg-primary text-white rounded-xl px-6 h-11 font-medium hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmitting ? "Creating..." : "Create Project"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
