'use server';

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getProjectRequirements } from '@/_actions/requirement';
import { ProjectHeader, ProjectMetadata, RequirementsSection } from './ProjectClient';
import type { ProjectPageProps } from './types';

export default async function ProjectPage({ params }: ProjectPageProps) {
  try {
    const { id: projectId } = await params;
    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
      notFound();
    }

    const requirements = await getProjectRequirements(project.id);

    return (
      <div className="space-y-8">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <ProjectHeader project={project} requirementsCount={requirements.length} />
          <div className="mt-6">
            <ProjectMetadata createdAt={project.createdAt} requirementsCount={requirements.length} />
          </div>
        </div>
        <RequirementsSection requirements={requirements} projectId={project.id} />
      </div>
    );
  } catch (error) {
    console.error('Error in ProjectPage:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to load project: ${error.message}`);
    }
    throw new Error('Failed to load project: An unexpected error occurred');
  }
}
