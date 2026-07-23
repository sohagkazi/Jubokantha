"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSettings, updateSettings, uploadImage } from "@/lib/services";
import Image from "next/image";

export default function BannerPage() {
  const [saving, setSaving] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const settings = await getSettings();
      if (settings) {
        if (settings.bannerTitle) setBannerTitle(settings.bannerTitle);
        if (settings.bannerSubtitle) setBannerSubtitle(settings.bannerSubtitle);
        if (settings.bannerUrl) setBannerUrl(settings.bannerUrl);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      let newUrl = bannerUrl;
      if (imageFile) {
        newUrl = await uploadImage(imageFile, "banner");
        setBannerUrl(newUrl);
      }
      await updateSettings({
        bannerTitle,
        bannerSubtitle,
        bannerUrl: newUrl,
      });
      alert("Banner updated successfully!");
    } catch (e) {
      console.error("Failed to update banner", e);
      alert("Failed to update banner.");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Banner Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Homepage Banner</CardTitle>
          <CardDescription>
            Update the main image and text shown on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Banner Title</label>
            <input 
              type="text" 
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              placeholder="E.g. Welcome to Jubokontho"
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Banner Subtitle</label>
            <textarea 
              value={bannerSubtitle}
              onChange={(e) => setBannerSubtitle(e.target.value)}
              placeholder="Short description..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Banner Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setImageFile(e.target.files[0]);
              }}
              className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
            {(imageFile || bannerUrl) && (
              <div className="mt-4 rounded-lg overflow-hidden border border-border relative h-48 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imageFile ? URL.createObjectURL(imageFile) : bannerUrl} 
                  alt="Banner preview" 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
