"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Projects & Campaigns</h2>
        <p className="text-muted-foreground">Track funding targets and progress for each project.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Winter Clothes Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Raised: ৳45,000</span>
                <span className="text-muted-foreground">Target: ৳100,000</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-right text-muted-foreground">45%</p>
            </div>
            <Button className="mt-4 w-full" variant="outline">Manage Project</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Education For All</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Raised: ৳120,000</span>
                <span className="text-muted-foreground">Target: ৳150,000</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '80%' }}></div>
              </div>
              <p className="text-xs text-right text-muted-foreground">80%</p>
            </div>
            <Button className="mt-4 w-full" variant="outline">Manage Project</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
