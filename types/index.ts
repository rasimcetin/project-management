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
