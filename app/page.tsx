import Link from 'next/link';
import { getProjects } from '../_actions/project';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; 
import { PlusCircle, FolderKanban } from 'lucide-react';
import { prisma } from '@/lib/db';

type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export default async function Home() {
  const projects: Project[] = await getProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
          <p className="mt-2 text-sm text-gray-600">Manage and track all your projects in one place.</p>
        </div>
        <Link href="/projects/new">
          <Button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500">
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: Project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="group h-full transition-all hover:border-blue-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-2 group-hover:bg-blue-100">
                    <FolderKanban className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                </div>
                <CardDescription className="mt-2 line-clamp-2">
                  {project.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <time dateTime={project.createdAt.toISOString()}>
                    {new Date(project.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No projects yet</CardTitle>
                <CardDescription>
                  Create your first project to get started.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
