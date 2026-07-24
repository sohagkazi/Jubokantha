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

// Mock data for donations
const mockDonations = [
  { id: 'DON-1029', donorName: 'Rahim Uddin', amount: 5000, method: 'bKash', status: 'Approved', date: new Date().toISOString(), isRecurring: false }, // Today
  { id: 'DON-1028', donorName: 'Korim Hossain', amount: 2000, method: 'Nagad', status: 'Approved', date: '2026-07-23T14:15:00Z', isRecurring: true },
  { id: 'DON-1027', donorName: 'Jamal Bhuiyan', amount: 1500, method: 'Card', status: 'Failed', date: '2026-07-23T09:45:00Z', isRecurring: false },
  { id: 'DON-1026', donorName: 'Unknown Donor', amount: 500, method: 'bKash', status: 'Pending', date: '2026-07-22T18:20:00Z', isRecurring: false },
];

export default function DonationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [summaryFilter, setSummaryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredDonations = mockDonations.filter(d => {
    if (activeTab === 'approved' && d.status !== 'Approved') return false;
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
    // Logic for PDF generation using jspdf will go here
    alert(`Generating PDF receipt for ${id}...`);
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
      'Amount (BDT)': d.amount,
      'Method': d.method,
      'Date': format(new Date(d.date), 'dd MMM yyyy, hh:mm a'),
      'Status': d.status,
      'Recurring': d.isRecurring ? 'Yes' : 'No'
    })) as any[];
    
    exportData.push({
      'Donation ID': `Total Collected (${summaryFilter === 'custom' ? 'Custom Date' : summaryFilter})`,
      'Donor Name': '',
      'Amount (BDT)': totalCollected,
      'Method': '',
      'Date': '',
      'Status': '',
      'Recurring': ''
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: "A3" });
    XLSX.utils.sheet_add_aoa(worksheet, title, { origin: "A1" });
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Donations');
    
    XLSX.writeFile(workbook, 'donations_report.xlsx');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Jubokantha Society - Donations Report`, 14, 15);
    
    const tableColumn = ["Donation ID", "Donor Name", "Amount (BDT)", "Method", "Date", "Status"];
    const tableRows = filteredDonations.map(d => [
      d.id,
      d.donorName,
      d.amount.toString(),
      d.method,
      format(new Date(d.date), 'dd MMM yyyy'),
      d.status
    ]);

    tableRows.push([`Total Collected (${summaryFilter === 'custom' ? 'Custom Date' : summaryFilter})`, "", totalCollected.toString(), "", "", ""]);

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
                  <Button variant={activeTab === 'recurring' ? 'default' : 'outline'} onClick={() => setActiveTab('recurring')} size="sm">Recurring</Button>
                  <Button variant={activeTab === 'failed' ? 'default' : 'outline'} onClick={() => setActiveTab('failed')} size="sm">Failed</Button>
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
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((donation) => (
                      <tr key={donation.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{donation.id}</td>
                        <td className="px-4 py-3">
                          {donation.donorName}
                          {donation.isRecurring && <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Recurring</span>}
                        </td>
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
                    ))}
                    {filteredDonations.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          No donations found.
                        </td>
                      </tr>
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
