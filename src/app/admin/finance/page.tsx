"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Loader2 } from 'lucide-react'

export default function FinancePage() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: ''
  });

  useEffect(() => {
    // Listen to donations for income
    const unsubscribeDonations = onSnapshot(collection(db, 'donations'), (snapshot) => {
      let total = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'Approved' || data.status === 'success') {
          total += Number(data.amount) || 0;
        }
      });
      setIncome(total);
    });

    // Listen to expenses
    const unsubscribeExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      let total = 0;
      const expenseList: any[] = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        total += Number(data.amount) || 0;
        return {
          id: doc.id,
          ...data
        };
      });
      // Sort expenses by createdAt descending
      expenseList.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setExpenses(expenseList);
      setTotalExpense(total);
      setLoading(false);
    });

    return () => {
      unsubscribeDonations();
      unsubscribeExpenses();
    };
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'expenses'), {
        description: expenseForm.description,
        amount: Number(expenseForm.amount),
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setExpenseForm({ description: '', amount: '' });
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const netBalance = income - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Finance & Expense</h2>
          <p className="text-muted-foreground">Manage automated income ledgers and manual expenses.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold shadow-sm">Add Manual Expense</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Manual Expense</DialogTitle>
              <DialogDescription>
                Record a new expense. This will instantly deduct from your net balance.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="e.g. Office Supplies, Event Cost"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (৳)</Label>
                <Input 
                  id="amount" 
                  type="number"
                  placeholder="e.g. 5000"
                  min="1"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  required
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Expense'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">৳ {income.toLocaleString('en-IN')}</div>
            <p className="text-sm text-muted-foreground mt-2">From approved donations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">৳ {totalExpense.toLocaleString('en-IN')}</div>
            <p className="text-sm text-muted-foreground mt-2">Manual recorded expenses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-red-600'}`}>
              ৳ {netBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Income minus Expense</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      Loading expenses...
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No expenses recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-gray-50/50">
                      <TableCell className="text-gray-500">
                        {expense.createdAt?.toDate ? format(expense.createdAt.toDate(), 'dd MMM yyyy, hh:mm a') : 'Just now'}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{expense.description}</TableCell>
                      <TableCell className="text-right font-bold text-red-600">
                        - ৳ {Number(expense.amount).toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
