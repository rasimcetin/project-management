export interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface ProjectPageProps {
  params: {
    id: string;
  };
}
