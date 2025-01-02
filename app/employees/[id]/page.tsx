import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { deleteEmployee } from '@/_actions/employe';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

async function getEmployee(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
  });
  
  if (!employee) notFound();
  return employee;
}

export default async function EmployeeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: employeeId } = await params;
  const employee = await getEmployee(employeeId);

  return (
    <div className="container mx-auto py-6 max-w-4xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/employees">
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Employee Details</h1>
        </div>
        <div className="flex gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/employees/${employee.id}/edit`}>
                  <Button variant="outline" size="icon" className="hover:bg-secondary hover:text-primary">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Employee</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <form action={async () => {
            'use server';
            await deleteEmployee(employee.id);
          }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="icon" className="hover:bg-destructive/90">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Employee</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight">{employee.name}</h2>
              <div className="flex items-center gap-3">
                <p className="text-muted-foreground">{employee.email}</p>
                <Badge variant="secondary" className="font-medium">
                  {employee.position}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
              <p className="text-base">{employee.department}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Joined Date</h3>
              <p className="text-base">{employee.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            {/* Add more employee details here as needed */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
