"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VolunteersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Volunteer Management</h2>
        <p className="text-muted-foreground">Manage volunteer applications and assignments.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground mb-4">A Kanban board or data table for volunteers will go here.</p>
           <Button>View All Volunteers</Button>
        </CardContent>
      </Card>
    </div>
  );
}
