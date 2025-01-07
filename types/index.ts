export interface Employee {
    id: string;
    name: string;
    email?: string;
    role?: string;
}

export interface Requirement {
    id: string;
    title: string;
    description?: string;
    projectId: string;
    status?: string;
    priority?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export type Task = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    requirementId: string;
    requirement: {
      id: string;
      title: string;
      // ... other requirement fields
    };
    employee: {
      id: string;
      name: string;
      // ... other employee fields
    };
    duration: number;
    startDate: Date;
    endDate: Date;
    estimate: number;
    actual: number;
    employeeId: string;
    createdAt: Date;
    updatedAt: Date;
  };
