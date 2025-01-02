import Link from 'next/link';
import { getProjects } from '../_actions/project';
import { getEmployees } from '../_actions/employe';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'; 
import { PlusCircle, FolderKanban, Clock, ArrowRight, PlusIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Suspense } from 'react';

type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  createdAt: Date;
};

function ProjectSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}

function EmployeeSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link key={project.id} href={`/projects/${project.id}`}>
      <Card className="group h-full transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5 transition-colors duration-300 group-hover:bg-blue-100">
              <FolderKanban className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="line-clamp-1 text-lg">{project.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">Active</Badge>
            </div>
          </div>
          <CardDescription className="mt-3 line-clamp-2 text-sm">
            {project.description || 'No description provided'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <time dateTime={project.createdAt.toISOString()}>
              {new Date(project.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View Project <ArrowRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Link key={employee.id} href={`/employees/${employee.id}`}>
      <Card className="group h-full transition-all duration-300 hover:border-green-300 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2.5 transition-colors duration-300 group-hover:bg-green-100">
              <FolderKanban className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="line-clamp-1 text-lg">{employee.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">{employee.position}</Badge>
            </div>
          </div>
          <CardDescription className="mt-3 line-clamp-2 text-sm">
            {employee.department} • {employee.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <time dateTime={employee.createdAt.toISOString()}>
              {new Date(employee.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View Employee <ArrowRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default async function Home() {
  const projects: Project[] = await getProjects();
  const employees: Employee[] = await getEmployees();

  return (
    <div className="space-y-12 p-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
            <p className="mt-2 text-lg text-gray-600">Manage and track all your projects in one place.</p>
          </div>
          <Link
            href="/projects/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            New Project
          </Link>
        </div>

        <Suspense fallback={
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        }>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Suspense>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Employees</h1>
            <p className="mt-2 text-lg text-gray-600">View and manage your team members.</p>
          </div>
          <Link
            href="/employees/new"
            className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            New Employee
          </Link>
        </div>

        <Suspense fallback={
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <EmployeeSkeleton key={i} />
            ))}
          </div>
        }>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
