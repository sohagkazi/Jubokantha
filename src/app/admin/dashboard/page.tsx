"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Briefcase, Activity } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format, parseISO } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalFunds: 0,
    donorsCount: 0,
    activeProjects: 0,
    activeStaff: 0,
  });
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'year' | 'month' | 'week'>('month');
  const [allDonations, setAllDonations] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Donations
    const donationsUnsub = onSnapshot(collection(db, 'donations'), (snapshot) => {
      let total = 0;
      const uniqueDonors = new Set();
      const donationsList: any[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'Approved' || data.status === 'success') {
          total += (Number(data.amount) || 0);
          const donorName = data.donorName || data.name || 'Unknown';
          if (donorName !== 'Unknown') uniqueDonors.add(donorName);
        }
        
        // Build activity feed list
        let dateStr = new Date().toISOString();
        if (data.date) {
          dateStr = typeof data.date.toDate === 'function' ? data.date.toDate().toISOString() : new Date(data.date).toISOString();
        } else if (data.createdAt) {
          dateStr = typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString();
        }
        donationsList.push({ 
          id: doc.id, 
          ...data, 
          amount: Number(data.amount) || 0,
          date: dateStr,
          donorName: data.donorName || data.name,
          status: data.status === 'success' ? 'Approved' : data.status 
        });
      });

      // Sort and limit recent activities
      const sortedActivities = [...donationsList]
        .filter(d => d.status === 'Approved')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setStats(prev => ({
        ...prev,
        totalFunds: total,
        donorsCount: uniqueDonors.size
      }));
      setRecentActivities(sortedActivities);
      setAllDonations(donationsList.filter(d => d.status === 'Approved'));
    });

    // Fetch Staff/Users
    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      let activeUsers = 0;
      snapshot.forEach(doc => {
        if (doc.data().status === 'Active') activeUsers++;
      });
      setStats(prev => ({ ...prev, activeStaff: activeUsers }));
    });

    // Fetch Projects
    const projectsUnsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setStats(prev => ({ ...prev, activeProjects: snapshot.size }));
      setLoading(false);
    });

    return () => {
      donationsUnsub();
      usersUnsub();
      projectsUnsub();
    };
  }, []);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const now = new Date();

    let incomeAggregator: { [key: string]: number } = {};

    if (timeRange === 'year') {
      incomeAggregator = { 'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0, 'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0 };
    } else if (timeRange === 'month') {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        incomeAggregator[i.toString()] = 0;
      }
    } else if (timeRange === 'week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        incomeAggregator[format(d, 'EEE')] = 0;
      }
    }

    allDonations.forEach((data) => {
      const dateObj = new Date(data.date);
      
      if (timeRange === 'year' && dateObj.getFullYear() === currentYear) {
        const month = format(dateObj, 'MMM');
        if (incomeAggregator[month] !== undefined) {
          incomeAggregator[month] += (data.amount || 0);
        }
      } else if (timeRange === 'month' && dateObj.getFullYear() === currentYear && dateObj.getMonth() === currentMonth) {
        const day = dateObj.getDate().toString();
        if (incomeAggregator[day] !== undefined) {
          incomeAggregator[day] += (data.amount || 0);
        }
      } else if (timeRange === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 6);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(now);
        endOfWeek.setHours(23, 59, 59, 999);
        
        if (dateObj >= startOfWeek && dateObj <= endOfWeek) {
          const day = format(dateObj, 'EEE');
          if (incomeAggregator[day] !== undefined) {
            incomeAggregator[day] += (data.amount || 0);
          }
        }
      }
    });

    const formattedChart = Object.keys(incomeAggregator).map(key => ({
      name: key,
      income: incomeAggregator[key],
      expense: 0
    }));

    setChartData(formattedChart);
  }, [allDonations, timeRange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to the Jubokontho Admin Panel.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading dashboard data...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳ {stats.totalFunds.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time approved</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Donors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.donorsCount}</div>
                <p className="text-xs text-muted-foreground">Unique active donors</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">Ongoing initiatives</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeStaff}</div>
                <p className="text-xs text-muted-foreground">Registered active users</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Income vs Expense</CardTitle>
                <select
                  className="bg-white border border-gray-300 rounded p-1 text-sm text-gray-700 font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as 'year' | 'month' | 'week')}
                >
                  <option value="year">This Year</option>
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                </select>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `৳${value}`} />
                      <Tooltip />
                      <Bar dataKey="income" fill="#138b45" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill="#d2292d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Live Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivities.length === 0 ? (
                    <div className="text-sm text-gray-500">No recent activities found.</div>
                  ) : (
                    recentActivities.map((activity, i) => (
                      <div key={activity.id || i} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Donation Received
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.donorName || 'Unknown'} donated ৳{activity.amount} via {activity.method || 'Unknown'}.
                          </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                          {format(new Date(activity.date), 'dd MMM yyyy')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
