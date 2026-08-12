"use client"
import { useState, useEffect } from "react"
import { Translate } from "@/components/Translate"
import Image from "next/image"
import { executiveMembers } from "@/components/executive-committee"
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CommitteePage() {
  const [executiveMembers, setExecutiveMembers] = useState<any[]>([]);
  const [advisoryMembers, setAdvisoryMembers] = useState<any[]>([]);

  useEffect(() => {
    const q1 = query(collection(db, 'executive_members'), orderBy('order', 'asc'));
    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExecutiveMembers(data);
    });

    const q2 = query(collection(db, 'advisory_members'), orderBy('order', 'asc'));
    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdvisoryMembers(data);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary border-b-4 border-accent pb-4 inline-block tracking-tight drop-shadow-sm">
              <Translate>Structure of the Executive Committee (EC)</Translate>
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              <Translate>যাদের নিরলস পরিশ্রমে আমাদের কার্যক্রম এগিয়ে চলছে</Translate>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Sl. No</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Name</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Designation</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Nationality</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Male / Female</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Address</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b"><Translate>Occupation</Translate></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {executiveMembers.map((member, index) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-900 border-r border-gray-200 text-center">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex-shrink-0 hidden sm:block">
                            {member.imageUrl ? (
                              <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <Image 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name?.replace(/\s+/g, '')}&backgroundColor=c0aede`}
                                alt={member.name || 'Member'}
                                width={40}
                                height={40}
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <Translate>{member.name}</Translate>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-700 border-r border-gray-200">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Translate>{member.designation}</Translate>
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 border-r border-gray-200">
                        <Translate>{member.nationality}</Translate>
                      </td>
                      <td className="p-4 text-sm text-gray-600 border-r border-gray-200">
                        <Translate>{member.gender}</Translate>
                      </td>
                      <td className="p-4 text-sm text-gray-600 border-r border-gray-200">
                        <Translate>{member.address}</Translate>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <Translate>{member.occupation}</Translate>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 text-sm text-gray-500 border-t border-gray-200 font-medium">
              <Translate>EC generally meets once in a quarter</Translate>
            </div>
          </div>

          <div className="text-center mb-12 mt-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary border-b-4 border-accent pb-4 inline-block tracking-tight drop-shadow-sm">
              <Translate>Advisory Panel</Translate>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              <Translate>আমাদের সম্মানীয় উপদেষ্টা মন্ডলী</Translate>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Sl. No</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Name</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Designation</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Nationality</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Male / Female</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b border-r border-primary/20"><Translate>Address</Translate></th>
                    <th className="p-4 font-semibold text-sm border-b"><Translate>Occupation</Translate></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {advisoryMembers.length > 0 ? advisoryMembers.map((member, index) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-900 border-r border-gray-200 text-center">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex-shrink-0 hidden sm:block">
                            {member.imageUrl ? (
                              <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <Image 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name?.replace(/\s+/g, '')}&backgroundColor=c0aede`}
                                alt={member.name || 'Member'}
                                width={40}
                                height={40}
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <Translate>{member.name}</Translate>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-700 border-r border-gray-200">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Translate>{member.designation}</Translate>
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 border-r border-gray-200">
                        <Translate>{member.nationality}</Translate>
                      </td>
                      <td className="p-4 text-sm text-gray-600 border-r border-gray-200">
                        <Translate>{member.gender}</Translate>
                      </td>
                      <td className="p-4 text-sm text-gray-600 border-r border-gray-200">
                        <Translate>{member.address}</Translate>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <Translate>{member.occupation}</Translate>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        <Translate>No advisory members found.</Translate>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
