"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Translate } from '@/components/Translate';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/navbar'; // Let's check if this exists or just use a generic layout
import { Footer } from '@/components/footer'; // check if exists
import { getApiUrl } from '@/lib/utils';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            <Translate>আমাদের প্রকল্প ও কর্মসূচি</Translate>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            <Translate>আমাদের সকল প্রকল্প ও কর্মসূচির বিস্তারিত তালিকা এবং আপডেট এখানে পাবেন।</Translate>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-500">
              <Translate>কোনো প্রজেক্ট পাওয়া যায়নি।</Translate>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.map((project) => {
              const percentage = project.targetAmount > 0
                ? Math.min(100, Math.round(((project.raisedAmount || 0) / project.targetAmount) * 100))
                : 0;

              return (
                <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-100">
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={project.imageUrl ? getApiUrl(project.imageUrl) : getApiUrl('https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=2070&auto=format&fit=crop')}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={true}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 text-primary px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-sm">
                      <Translate>প্রজেক্ট</Translate>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      <Translate>{project.title}</Translate>
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                      <Translate>{project.description || ''}</Translate>
                    </p>

                    <div className="space-y-3 mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-primary">
                          <Translate>সংগৃহীত:</Translate> ৳{(project.raisedAmount || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-500 font-medium">
                          <Translate>লক্ষ্য:</Translate> ৳{(project.targetAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 ease-out relative" 
                          style={{ width: `${percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ transform: 'translateX(-100%)' }}></div>
                        </div>
                      </div>
                      <div className="text-right text-xs font-bold text-gray-500">
                        {percentage}%
                      </div>
                    </div>

                    <Link href={`/donate?project=${project.id}`} className="block mt-auto">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 rounded-lg text-base shadow-sm hover:shadow-md transition-all">
                        <Translate>দান করুন</Translate>
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
