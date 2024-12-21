import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { prisma } from '@/lib/db';
import { getProjectRequirements } from '@/_actions/requirement';
import RequirementList from './RequirementList';
import NewRequirementDialog from './NewRequirementDialog';
import type { Requirement } from '@/_actions/requirement';

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

// Utility function for date formatting
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Components
const ProjectHeader = ({ project, requirementsCount }: { project: ProjectData; requirementsCount: number }) => (
  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div className="space-y-4">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Projects
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{project.name}</h1>
        {project.description && (
          <p className="mt-2 text-sm leading-6 text-gray-600">{project.description}</p>
        )}
      </div>
      <ProjectMetadata createdAt={project.createdAt} requirementsCount={requirementsCount} />
    </div>
    <NewRequirementDialog projectId={project.id} />
  </div>
);

const ProjectMetadata = ({ createdAt, requirementsCount }: { createdAt: Date; requirementsCount: number }) => (
  <div className="flex items-center gap-4 text-sm text-gray-500">
    <div className="flex items-center gap-2">
      <span className="font-medium">Created:</span>
      <time dateTime={createdAt.toISOString()}>{formatDate(createdAt)}</time>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-medium">Requirements:</span>
      <span>{requirementsCount}</span>
    </div>
  </div>
);

const RequirementsSection = ({ requirements, projectId }: { requirements: Requirement[]; projectId: string }) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
    <div className="mt-6">
      <RequirementList requirements={requirements} projectId={projectId} />
    </div>
  </div>
);

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      notFound();
    }

    const requirements = await getProjectRequirements(project.id);

    return (
      <div className="space-y-8">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <ProjectHeader project={project} requirementsCount={requirements.length} />
        </div>
        <RequirementsSection requirements={requirements} projectId={project.id} />
      </div>
    );
  } catch (error) {
    console.error('Error loading project:', error);
    throw new Error('Failed to load project');
  }
}
