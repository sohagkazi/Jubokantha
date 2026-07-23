"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getNews, addNews, deleteNews, NewsItem } from "@/lib/services";
import { Trash2, Plus } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await getNews();
      setNews(data);
    } catch (e) {
      console.error("Failed to fetch news:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    setSaving(true);
    try {
      await addNews({
        title,
        content,
        date: new Date().toISOString()
      }, imageFile || undefined);
      
      // Reset form
      setTitle("");
      setContent("");
      setImageFile(null);
      setIsAdding(false);
      loadNews();
    } catch (e) {
      console.error("Failed to add news", e);
      alert("Failed to add news.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm("Are you sure you want to delete this news?")) return;
    try {
      await deleteNews(id, imageUrl);
      loadNews();
    } catch (e) {
      console.error("Failed to delete news", e);
      alert("Failed to delete news.");
    }
  };

  if (loading) {
    return <div>Loading news...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">News Management</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add News</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Article</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                  }}
                  className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1 file:text-sm file:text-primary-foreground"
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Publish News"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {news.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.imageUrl && (
              <div className="w-full h-40 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
              <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {item.content}
              </p>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id!, item.imageUrl)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
        {news.length === 0 && !isAdding && (
          <div className="col-span-2 text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            No news articles found. Click "Add News" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
