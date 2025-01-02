'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState, useEffect, useActionState } from "react";
import { createEmployee } from "@/_actions/employe";
import type { EmployeeFormState } from "@/_actions/employe";
import toast from "react-hot-toast";

const initialState: EmployeeFormState = {
  errors: {},
  message: null,
};

export default function NewEmployeePage() {
  const router = useRouter();
  const [state, formAction] = useActionState<EmployeeFormState, FormData>(createEmployee, initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.message === 'success') {
      router.push('/employees');
    }
  }, [state.message, router]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      const result = await createEmployee({}, formData);
      if (!result?.errors) {
        toast.success('Employee created successfully!', {
          style: {
            background: '#22c55e',
            color: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '500'
          }
        });
        router.push('/employees');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    } 
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="space-y-2 pb-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Add New Employee</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full hover:bg-secondary"
            >
              ✕
            </Button>
          </div>
          <CardDescription className="text-base text-muted-foreground">
            Fill in the information below to create a new employee profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the employee's full legal name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                    className="transition-all duration-200 h-11 px-4 bg-background hover:bg-secondary/40 focus:bg-background"
                  />
                  {state.errors?.name && (
                    <p className="text-sm text-destructive animate-in slide-in-from-top-1">{state.errors.name[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Work email address for communication</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    required
                    disabled={loading}
                    className="transition-all duration-200 h-11 px-4 bg-background hover:bg-secondary/40 focus:bg-background"
                  />
                  {state.errors?.email && (
                    <p className="text-sm text-destructive animate-in slide-in-from-top-1">{state.errors.email[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the employee's role in the company</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select name="position" required disabled={loading}>
                    <SelectTrigger className="transition-all duration-200 h-11 hover:bg-secondary/40">
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
                    <p className="text-sm text-destructive animate-in slide-in-from-top-1">{state.errors.position[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the department they'll be working in</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select name="department" required disabled={loading}>
                    <SelectTrigger className="transition-all duration-200 h-11 hover:bg-secondary/40">
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
                    <p className="text-sm text-destructive animate-in slide-in-from-top-1">{state.errors.department[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {state.errors?._form && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive animate-in fade-in-50 slide-in-from-top-1">
                <p className="text-sm font-medium">{state.errors._form[0]}</p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none h-11 min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </div>
                ) : (
                  'Create Employee'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 md:flex-none h-11 min-w-[140px] hover:bg-secondary/80 transition-all duration-300"
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
