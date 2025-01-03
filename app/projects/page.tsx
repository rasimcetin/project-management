import Link from 'next/link';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { getProjects, deleteProject } from '@/_actions/project';
import { revalidatePath } from 'next/cache';
import DeleteProjectButton from '@/components/DeleteProjectButton';

type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  async function handleDelete(id: string) {
    'use server';
    await deleteProject(id);
    revalidatePath('/projects');
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage and track all your ongoing projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Project
          </Link>
        </div>
      </div>
      
      <div className="mt-10">
        {projects.length === 0 ? (
          <div className="rounded-lg bg-white shadow-sm border-2 border-dashed border-gray-300 p-12">
            <div className="text-center">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No projects</h3>
              <p className="mt-1 text-gray-500">Get started by creating a new project</p>
              <div className="mt-6">
                <Link
                  href="/projects/new"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Project
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => (
              <li key={project.id} className="col-span-1 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="h-full flex flex-col">
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between">
                      <Link 
                        href={`/projects/${project.id}`}
                        className="focus:outline-none group"
                      >
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                          {project.name}
                        </h2>
                      </Link>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    </div>
                    <p className="mt-3 text-gray-600 line-clamp-2">
                      {project.description || 'No description provided'}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1.5" />
                      Created {formatDate(project.createdAt)}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-xl">
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                      >
                        View details →
                      </Link>
                      <form action={handleDelete.bind(null, project.id)}>
                        <DeleteProjectButton onDelete={handleDelete.bind(null, project.id)} />
                      </form>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
