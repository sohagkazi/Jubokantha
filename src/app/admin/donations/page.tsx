"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, CheckCircle2, XCircle, Clock, DollarSign, FileText } from 'lucide-react';
import { format, isToday, isThisMonth, isThisYear, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DonationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [summaryFilter, setSummaryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'donations')); // Removed orderBy to include documents missing the 'date' field
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        let dateStr = new Date().toISOString();
        if (d.date) {
          dateStr = typeof d.date.toDate === 'function' ? d.date.toDate().toISOString() : new Date(d.date).toISOString();
        } else if (d.createdAt) {
          dateStr = typeof d.createdAt.toDate === 'function' ? d.createdAt.toDate().toISOString() : new Date(d.createdAt).toISOString();
        }
        return {
          id: doc.id,
          ...d,
          date: dateStr,
          amount: Number(d.amount) || 0,
          status: (d.status === 'success' ? 'Approved' : d.status) || 'Pending',
          donorName: d.donorName || d.name || 'Unknown Donor',
          mobile: d.mobile || 'N/A',
          method: d.method || 'EPS Payment',
          isRecurring: !!d.isRecurring
        };
      });
      // Sort in memory by date descending
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setDonations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredDonations = donations.filter(d => {
    if (activeTab === 'approved' && d.status !== 'Approved') return false;
    if (activeTab === 'pending' && d.status !== 'pending') return false;
    if (activeTab === 'cancelled' && d.status !== 'cancelled') return false;
    if (activeTab === 'failed' && d.status !== 'Failed') return false;
    if (activeTab === 'recurring' && !d.isRecurring) return false;
    
    // Time filter
    const date = parseISO(d.date);
    if (summaryFilter === 'today' && !isToday(date)) return false;
    if (summaryFilter === 'month' && !isThisMonth(date)) return false;
    if (summaryFilter === 'year' && !isThisYear(date)) return false;
    if (summaryFilter === 'custom') {
      if (startDate && new Date(startDate) > date) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (end < date) return false;
      }
    }

    return d.donorName.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />;
      case 'Failed': return <XCircle className="h-4 w-4 text-red-500 mr-2" />;
      default: return <Clock className="h-4 w-4 text-yellow-500 mr-2" />;
    }
  };

  const handleDownloadReceipt = (id: string) => {
    const donation = filteredDonations.find(d => d.id === id);
    if (!donation) return;

    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // A nice blue color
    doc.text('Jubokantha Society', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text('Donation Receipt', 105, 30, { align: 'center' });
    
    // Add line separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);
    
    // Add Receipt Details
    doc.setFontSize(12);
    doc.setTextColor(50);
    
    const startY = 50;
    const lineSpacing = 10;
    
    doc.text(`Receipt No: ${donation.id}`, 20, startY);
    doc.text(`Date: ${format(new Date(donation.date), 'dd MMM yyyy, hh:mm a')}`, 20, startY + lineSpacing);
    
    doc.text(`Donor Name: ${donation.donorName}`, 20, startY + lineSpacing * 2);
    doc.text(`Payment Method: ${donation.method}`, 20, startY + lineSpacing * 3);
    doc.text(`Status: ${donation.status}`, 20, startY + lineSpacing * 4);
    if (donation.fund) {
      doc.text(`Fund: ${donation.fund}`, 20, startY + lineSpacing * 5);
    }
    
    // Add Amount
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(`Amount: ${donation.amount} BDT`, 20, startY + lineSpacing * 7);
    
    // Add Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for your generous donation!', 105, 270, { align: 'center' });
    doc.text('This is an electronically generated receipt and does not require a signature.', 105, 276, { align: 'center' });
    
    doc.save(`receipt_${donation.id}.pdf`);
  };

  const totalCollected = useMemo(() => {
    return filteredDonations
      .filter(d => d.status === 'Approved')
      .reduce((sum, current) => sum + current.amount, 0);
  }, [filteredDonations]);

  const handleExportExcel = () => {
    const title = [['Jubokantha Society - Donations Report']];
    const exportData = filteredDonations.map(d => ({
      'Donation ID': d.id,
      'Donor Name': d.donorName,
      'Mobile Number': d.mobile,
      'Amount (BDT)': d.amount,
      'Method': d.method,
      'Date': format(new Date(d.date), 'dd MMM yyyy, hh:mm a'),
      'Status': d.status,
      'Recurring': d.isRecurring ? 'Yes' : 'No'
    })) as any[];
    
    exportData.push({
      'Donation ID': `Total Collected (${summaryFilter === 'custom' ? 'Custom Date' : summaryFilter})`,
      'Donor Name': '',
      'Mobile Number': '',
      'Amount (BDT)': totalCollected,
      'Method': '',
      'Date': '',
      'Status': '',
      'Recurring': ''
    });

    // @ts-ignore
    const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: "A3" });
    XLSX.utils.sheet_add_aoa(worksheet, title, { origin: "A1" });
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Donations');
    
    XLSX.writeFile(workbook, 'donations_report.xlsx');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Jubokantha Society - Donations Report`, 14, 15);
    
    const tableColumn = ["Donation ID", "Donor Name", "Mobile", "Amount (BDT)", "Method", "Date", "Status"];
    const tableRows = filteredDonations.map(d => [
      d.id,
      d.donorName,
      d.mobile,
      d.amount.toString(),
      d.method,
      format(new Date(d.date), 'dd MMM yyyy'),
      d.status
    ]);

    tableRows.push([`Total Collected (${summaryFilter === 'custom' ? 'Custom Date' : summaryFilter})`, "", "", totalCollected.toString(), "", "", ""]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save('donations_report.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Donations Management</h2>
          <p className="text-muted-foreground">Track and manage automated donations, receipts, and recurring profiles.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadPDF} variant="outline" className="border-primary text-primary hover:bg-primary/5">
            <FileText className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button onClick={handleExportExcel} className="bg-primary text-white">
            <Download className="mr-2 h-4 w-4" /> Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                Total Collected
                <DollarSign className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-3xl font-bold text-primary">
                ৳{totalCollected.toLocaleString()}
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Filter by period:</label>
                  <select 
                    className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={summaryFilter}
                    onChange={(e) => setSummaryFilter(e.target.value)}
                  >
                    <option value="today">Today</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                    <option value="custom">Custom Date</option>
                  </select>
                </div>
                
                {summaryFilter === 'custom' && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div>
                      <label className="text-xs font-medium text-gray-500">From:</label>
                      <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">To:</label>
                      <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-8 text-sm" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Data Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant={activeTab === 'all' ? 'default' : 'outline'} onClick={() => setActiveTab('all')} size="sm">All</Button>
                  <Button variant={activeTab === 'approved' ? 'default' : 'outline'} onClick={() => setActiveTab('approved')} size="sm">Approved</Button>
                  <Button variant={activeTab === 'pending' ? 'default' : 'outline'} onClick={() => setActiveTab('pending')} size="sm">Pending</Button>
                  <Button variant={activeTab === 'recurring' ? 'default' : 'outline'} onClick={() => setActiveTab('recurring')} size="sm">Recurring</Button>
                  <Button variant={activeTab === 'failed' ? 'default' : 'outline'} onClick={() => setActiveTab('failed')} size="sm">Failed</Button>
                  <Button variant={activeTab === 'cancelled' ? 'default' : 'outline'} onClick={() => setActiveTab('cancelled')} size="sm">Cancelled</Button>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="text" 
                    placeholder="Search donor or ID..." 
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
                      <th className="px-4 py-3">Donation ID</th>
                      <th className="px-4 py-3">Donor Name</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Loading donations...
                        </td>
                      </tr>
                    ) : filteredDonations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          No donations found.
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((donation) => (
                        <tr key={donation.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{donation.id}</td>
                          <td className="px-4 py-3">
                            {donation.donorName}
                            {donation.isRecurring && <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Recurring</span>}
                          </td>
                          <td className="px-4 py-3">{donation.mobile}</td>
                          <td className="px-4 py-3 font-semibold">৳{donation.amount}</td>
                          <td className="px-4 py-3">{donation.method}</td>
                          <td className="px-4 py-3">{format(new Date(donation.date), 'dd MMM yyyy, hh:mm a')}</td>
                          <td className="px-4 py-3 flex items-center">
                            {getStatusIcon(donation.status)}
                            {donation.status}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {donation.status === 'Approved' && (
                              <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(donation.id)}>
                                Receipt
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
