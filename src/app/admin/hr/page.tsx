"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, CalendarClock } from 'lucide-react';

export default function HRPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">HR & Payroll</h2>
        <p className="text-muted-foreground">Manage staff directory, payroll, and attendance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <Button variant="link" className="px-0">View Directory</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generate Payroll</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">Run payroll for current month</p>
            <Button size="sm">Run Payroll</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">3 Pending</div>
            <Button variant="link" className="px-0">Review Requests</Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Staff Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory (Preview)</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground">Staff directory table will be rendered here...</p>
        </CardContent>
      </Card>
    </div>
  );
}
