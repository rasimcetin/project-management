'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Employee } from '@/types';
import { getEmployees } from '@/_actions/employe';

interface AssigneeDialogProps {
  onSelect: (employeeId: string) => void;
  selectedEmployeeId?: string;
}

export function AssigneeDialog({ onSelect, selectedEmployeeId }: AssigneeDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data);
    };

    fetchEmployees();
  }, []);

  const handleSelect = (employeeId: string) => {
    onSelect(employeeId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedEmployeeId ? 
            employees.find(e => e.id === selectedEmployeeId)?.name || 'Select Assignee' 
            : 'Select Assignee'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Assignee</DialogTitle>
          <DialogDescription>
            Choose a team member to assign this task to.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {employees.map((employee) => (
            <Button
              key={employee.id}
              variant={selectedEmployeeId === employee.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleSelect(employee.id)}
            >
              {employee.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}