"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getGallery, addGalleryItem, deleteGalleryItem, GalleryItem } from "@/lib/services";
import { Trash2, Plus } from "lucide-react";

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await getGallery();
      setGallery(data);
    } catch (e) {
      console.error("Failed to fetch gallery:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageFile) return;
    
    setSaving(true);
    try {
      await addGalleryItem({
        title,
        date: new Date().toISOString()
      }, imageFile);
      
      // Reset form
      setTitle("");
      setImageFile(null);
      setIsAdding(false);
      loadGallery();
    } catch (e) {
      console.error("Failed to add gallery item", e);
      alert("Failed to add image to gallery.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteGalleryItem(id, imageUrl);
      loadGallery();
    } catch (e) {
      console.error("Failed to delete gallery item", e);
      alert("Failed to delete image.");
    }
  };

  if (loading) {
    return <div>Loading gallery...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Image</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-8 max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Image</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Title / Description</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="E.g. Relief distribution in Sylhet"
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image File</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                  }}
                  required
                  className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1 file:text-sm file:text-primary-foreground"
                />
              </div>
              <Button type="submit" disabled={saving || !imageFile}>
                {saving ? "Uploading..." : "Upload Image"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden group relative">
            <div className="aspect-square w-full relative bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white font-medium truncate mb-2">{item.title}</p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleDelete(item.id!, item.imageUrl)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {gallery.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            No images in the gallery. Click "Add Image" to upload one.
          </div>
        )}
      </div>
    </div>
  );
}
