'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createEmployee } from "@/_actions/employe";
import { useFormState } from "react-dom";
import type { EmployeeFormState } from "@/_actions/employe";

export default function NewEmployeePage() {
  const router = useRouter();
  const [state, formAction] = useFormState<EmployeeFormState, FormData>(createEmployee, {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.message === 'success') {
      router.push('/employees');
    }
  }, [state.message, router]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Add New Employee</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fill in the information below to create a new employee profile.
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                    className="transition-all duration-200"
                  />
                  {state.errors?.name && (
                    <p className="text-sm text-destructive animate-in fade-in">{state.errors.name[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    required
                    disabled={loading}
                    className="transition-all duration-200"
                  />
                  {state.errors?.email && (
                    <p className="text-sm text-destructive animate-in fade-in">{state.errors.email[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select name="position" required disabled={loading}>
                    <SelectTrigger className="transition-all duration-200">
                      <SelectValue placeholder="Choose a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software-engineer">Software Engineer</SelectItem>
                      <SelectItem value="product-manager">Product Manager</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="marketing">Marketing Specialist</SelectItem>
                      <SelectItem value="hr">HR Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.errors?.position && (
                    <p className="text-sm text-destructive animate-in fade-in">{state.errors.position[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select name="department" required disabled={loading}>
                    <SelectTrigger className="transition-all duration-200">
                      <SelectValue placeholder="Choose a department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.errors?.department && (
                    <p className="text-sm text-destructive animate-in fade-in">{state.errors.department[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {state.errors?._form && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive animate-in fade-in">
                <p className="text-sm">{state.errors._form[0]}</p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⭮</span>
                    Creating...
                  </>
                ) : (
                  'Create Employee'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 md:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
