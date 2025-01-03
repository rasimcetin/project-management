'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Requirement } from '@/types';

interface RequirementDialogProps {
  onSelect: (requirementId: string) => void;
  selectedRequirementId?: string;
  projectId: string;
}

export function RequirementDialog({ onSelect, selectedRequirementId, projectId }: RequirementDialogProps) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRequirements = async () => {
      const response = await fetch(`/api/projects/${projectId}/requirements`);
      const data = await response.json();
      setRequirements(data);
    };

    if (projectId) {
      fetchRequirements();
    }
  }, [projectId]);

  const handleSelect = (requirementId: string) => {
    onSelect(requirementId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedRequirementId ? 
            requirements.find(r => r.id === selectedRequirementId)?.title || 'Select Requirement' 
            : 'Select Requirement'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Requirement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {requirements.map((requirement) => (
            <Button
              key={requirement.id}
              variant={selectedRequirementId === requirement.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleSelect(requirement.id)}
            >
              {requirement.title}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
