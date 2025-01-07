"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type RequirementStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type RequirementPriority = "HIGH" | "MEDIUM" | "LOW";

export interface Requirement {
  id: string;
  title: string;
  status: RequirementStatus;
  priority: RequirementPriority;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  parentId: string | null;
  subtasks: Requirement[];
}

type PrismaRequirementBase = {
  id: string;
  title: string;
  status: string;
  priority: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  parentId: string | null;
};

interface PrismaRequirementWithSubtasks extends PrismaRequirementBase {
  subtasks: Array<PrismaRequirementWithSubtasks | PrismaRequirementBase>;
}

function transformRequirement(
  prismaReq: PrismaRequirementWithSubtasks | PrismaRequirementBase
): Requirement {
  return {
    ...prismaReq,
    status: prismaReq.status as RequirementStatus,
    priority: prismaReq.priority as RequirementPriority,
    subtasks:
      "subtasks" in prismaReq
        ? prismaReq.subtasks.map(transformRequirement)
        : [],
  };
}

const requirementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  projectId: z.string().min(1, "Project ID is required"),
  parentId: z.string().optional(),
});

export type RequirementFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    status?: string[];
    priority?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function createRequirement(
  prevState: RequirementFormState,
  formData: FormData
): Promise<RequirementFormState> {
  const validatedFields = requirementSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    projectId: formData.get("projectId"),
    parentId: formData.get("parentId") || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields",
    };
  }

  try {
    await prisma.requirement.create({
      data: validatedFields.data,
    });

    revalidatePath(`/projects/${validatedFields.data.projectId}`);
    return { message: "Requirement created successfully" };
  } catch {
    return {
      message: "Database Error: Failed to create requirement.",
    };
  }
}

export async function updateRequirement(
  id: string,
  data: z.infer<typeof requirementSchema>
) {
  try {
    await prisma.requirement.update({
      where: { id },
      data,
    });
  } catch {
    throw new Error("Failed to update requirement");
  }
}

export async function updateRequirementStatus(
  id: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED",
  projectId: string
) {
  try {
    await prisma.requirement.update({
      where: { id },
      data: { status },
    });
    revalidatePath(`/projects/${projectId}`);
  } catch {
    throw new Error("Failed to update requirement status");
  }
}

export async function getProjectRequirements(projectId: string) {
  try {
    const requirements = await prisma.requirement.findMany({
      where: {
        projectId,
        parentId: null, // Get only top-level requirements
      },
      include: {
        subtasks: {
          include: {
            subtasks: true, // Include nested subtasks
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return requirements.map(transformRequirement);
  } catch {
    throw new Error("Failed to fetch requirements");
  }
}

export async function getRequirements() {
  try {
    return await prisma.requirement.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    throw new Error("Failed to fetch requirements");
  }
}
