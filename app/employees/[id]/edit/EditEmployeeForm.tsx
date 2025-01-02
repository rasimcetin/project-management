'use client';

import { useFormStatus } from 'react-dom';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmployee } from '@/_actions/employe';
import { EmployeeFormState } from '@/_actions/employe';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { toast } from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const positions = [
  "Software Engineer",
  "Senior Software Engineer",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
  "QA Engineer",
  "Technical Lead",
  "Project Manager",
  "Business Analyst",
] as const;

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Quality Assurance",
  "Operations",
  "Management",
] as const;

const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').nullable().transform(val => val || ''),
  position: z.enum(positions, {
    errorMap: () => ({ message: 'Please select a valid position' }),
  }),
  department: z.enum(departments, {
    errorMap: () => ({ message: 'Please select a valid department' }),
  }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function EditEmployeeForm({
  employee,
}: {
  employee: {
    id: string;
    name: string;
    email: string | null;
    position: string;
    department: string;
  };
}) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    reset,
    watch,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email || '',
      position: employee.position as typeof positions[number],
      department: employee.department as typeof departments[number],
    },
  });
  
  const onSubmit = async (data: EmployeeFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (dirtyFields[key as keyof EmployeeFormValues]) {
        formData.append(key, value);
      }
    });

    startTransition(async () => {
      try {
        const result = await updateEmployee(employee.id, { errors: {} }, formData);
        if (result.errors) {
          // Handle validation errors from server
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              toast.error(`${field}: ${messages[0]}`);
            }
          });
        } else {
          toast.success('Employee updated successfully');
          reset(data);
          router.push('/employees');
          router.refresh();
        }
      } catch (error) {
        toast.error('Failed to update employee');
      } finally {
        setIsConfirmOpen(false);
      }
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center">Edit Employee Details</h2>
        <p className="text-muted-foreground text-center">Update the information for {employee.name}</p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Enter the employee's full name</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                {...register('name')}
                aria-describedby="name-error"
                className={`w-full transition-all ${errors.name ? 'border-destructive' : ''}`}
                placeholder="John Doe"
              />
              {errors.name && (
                <div id="name-error" className="text-sm text-destructive mt-1 animate-in fade-in-50">
                  <p className="flex items-center gap-1">
                    <span>⚠️</span> {errors.name.message}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Enter the work email address</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                {...register('email')}
                type="email"
                className={`w-full transition-all ${errors.email ? 'border-destructive' : ''}`}
                placeholder="john.doe@company.com"
              />
              {errors.email && (
                <div id="email-error" className="text-sm text-destructive mt-1 animate-in fade-in-50">
                  <p className="flex items-center gap-1">
                    <span>⚠️</span> {errors.email.message}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Select the employee's job title</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                onValueChange={(value) => {
                  const event = { target: { name: 'position', value } };
                  register('position').onChange(event);
                }}
                value={watch('position')}
                defaultValue={employee.position}
              >
                <SelectTrigger className={`w-full ${errors.position ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && (
                <div id="position-error" className="text-sm text-destructive mt-1 animate-in fade-in-50">
                  <p className="flex items-center gap-1">
                    <span>⚠️</span> {errors.position.message}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Select the employee's department</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                onValueChange={(value) => {
                  const event = { target: { name: 'department', value } };
                  register('department').onChange(event);
                }}
                value={watch('department')}
                defaultValue={employee.department}
              >
                <SelectTrigger className={`w-full ${errors.department ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <div id="department-error" className="text-sm text-destructive mt-1 animate-in fade-in-50">
                  <p className="flex items-center gap-1">
                    <span>⚠️</span> {errors.department.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-w-[140px]"
            onClick={() => {
              if (isDirty) {
                setIsConfirmOpen(true);
              } else {
                router.back();
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="min-w-[140px]"
            disabled={!isDirty || isPending}
            onClick={() => setIsConfirmOpen(true)}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          
          <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to update this employee's information? This action will modify their records in the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isPending}
                  >
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </form>
    </Card>
  );
}
