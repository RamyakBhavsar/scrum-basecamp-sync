
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Briefcase, Download, FileBarChart, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseApi } from '@/services/supabaseApi';
import { ResourceAllocation } from '@/models/Resource';
import { ResourceDialog } from '@/components/resources/ResourceDialog';
import { AllocationDialog } from '@/components/resources/AllocationDialog';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const ResourcePool = () => {
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceAllocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  
  // Get resources from API
  const { 
    data: resources = [], 
    isLoading: isLoadingResources, 
    refetch: refetchResources 
  } = useQuery({
    queryKey: ['resources', 'allocations'],
    queryFn: supabaseApi.allocations.getResourceAllocations
  });
  
  // Filter resources based on search, role, and availability
  const filterResources = (resources: ResourceAllocation[]) => {
    return resources.filter(resource => {
      // Filter by search term
      const matchesSearch = 
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resource.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.role && resource.role.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by role
      const matchesRole = roleFilter === 'all' || 
        (resource.role && resource.role.toLowerCase() === roleFilter.toLowerCase());
      
      // Filter by availability
      let matchesAvailability = true;
      if (availabilityFilter === 'available') {
        matchesAvailability = resource.totalAllocation < 100;
      } else if (availabilityFilter === 'overallocated') {
        matchesAvailability = resource.totalAllocation >= 100;
      } else if (availabilityFilter === 'nearCapacity') {
        matchesAvailability = resource.totalAllocation >= 80 && resource.totalAllocation < 100;
      }
      
      return matchesSearch && matchesRole && matchesAvailability;
    });
  };
  
  const filteredResources = filterResources(resources);
  
  // Get a list of unique roles from resources
  const roles = ['all', ...new Set(resources.filter(r => r.role).map(r => r.role?.toLowerCase() || ''))];
  
  // Handlers
  const handleResourceCreated = () => {
    refetchResources();
  };
  
  const handleAllocationCreated = () => {
    refetchResources();
  };
  
  // Add or edit resource
  const handleAddEditResource = (resource?: ResourceAllocation) => {
    setSelectedResource(resource || null);
    setIsResourceDialogOpen(true);
  };
  
  // Add allocation
  const handleAddAllocation = (resource?: ResourceAllocation) => {
    setSelectedResource(resource || null);
    setIsAllocationDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resource Pool</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their availability.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => handleAddEditResource()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
            <Button variant="outline" onClick={() => handleAddAllocation()}>
              <Briefcase className="mr-2 h-4 w-4" />
              Create Allocation
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Resource Pool Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
                      <h3 className="text-3xl font-bold mt-1">{resources.length}</h3>
                    </div>
                    <Users className="h-8 w-8 text-brand-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available Resources</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {resources.filter(r => r.totalAllocation < 100).length}
                      </h3>
                    </div>
                    <Briefcase className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overallocated Resources</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {resources.filter(r => r.totalAllocation >= 100).length}
                      </h3>
                    </div>
                    <FileBarChart className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.filter(r => r !== 'all').map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="nearCapacity">Near Capacity</SelectItem>
                  <SelectItem value="overallocated">Overallocated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoadingResources ? (
              <div className="text-center py-10">Loading resources...</div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No resources found matching your criteria.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Allocation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map(resource => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>{resource.role || '-'}</TableCell>
                      <TableCell>{resource.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={resource.totalAllocation} className="h-2 w-[100px]" />
                          <span>{resource.totalAllocation}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resource.totalAllocation >= 100 
                            ? 'bg-red-100 text-red-800' 
                            : resource.totalAllocation >= 80
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {resource.totalAllocation >= 100 
                            ? 'Overallocated' 
                            : resource.totalAllocation >= 80
                            ? 'Near Capacity'
                            : `${100 - resource.totalAllocation}% Available`}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddAllocation(resource)}
                          >
                            Allocate
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddEditResource(resource)}
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Resource Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ResourceDialog 
        open={isResourceDialogOpen}
        onOpenChange={setIsResourceDialogOpen}
        resource={selectedResource}
        onResourceSaved={handleResourceCreated}
      />
      
      <AllocationDialog
        open={isAllocationDialogOpen}
        onOpenChange={setIsAllocationDialogOpen}
        resourceId={selectedResource?.id}
        onAllocationSaved={handleAllocationCreated}
      />
    </MainLayout>
  );
};

export default ResourcePool;
