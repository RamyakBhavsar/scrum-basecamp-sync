
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Briefcase, Calendar, Download, Edit, Trash, FileBarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabaseApi } from '@/services/supabaseApi';
import { ResourceAllocation } from '@/models/Resource';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { ResourceDialog } from '@/components/resources/ResourceDialog';
import { AllocationDialog } from '@/components/resources/AllocationDialog';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ResourceManagement = () => {
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceAllocation | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [allocationToDelete, setAllocationToDelete] = useState<string | null>(null);
  
  // Get resources from API
  const { 
    data: resources = [], 
    isLoading: isLoadingResources, 
    refetch: refetchResources 
  } = useQuery({
    queryKey: ['resources', 'allocations'],
    queryFn: supabaseApi.allocations.getResourceAllocations
  });
  
  // Handlers
  const handleResourceCreated = () => {
    refetchResources();
  };
  
  const handleAllocationCreated = () => {
    refetchResources();
  };
  
  const handleDeleteResource = async (id: string) => {
    try {
      await supabaseApi.resources.delete(id);
      refetchResources();
      setResourceToDelete(null);
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };
  
  const handleDeleteAllocation = async (id: string) => {
    try {
      await supabaseApi.allocations.delete(id);
      refetchResources();
      setAllocationToDelete(null);
    } catch (error) {
      console.error('Failed to delete allocation:', error);
    }
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
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resource Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and their project allocations.
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
        
        <Tabs defaultValue="resources">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="allocations">Allocation Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="mt-6">
            <div className="space-y-4">
              {isLoadingResources ? (
                <div className="text-center py-10">Loading resources...</div>
              ) : resources.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No resources found. Add your first team member.
                </div>
              ) : (
                resources.map(resource => (
                  <Card key={resource.id} className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">{resource.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{resource.role || 'Team Member'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileBarChart className="h-4 w-4" />
                            <span>Current allocation: {resource.totalAllocation}%</span>
                          </div>
                          <Progress value={resource.totalAllocation} className="h-2 mt-1" />
                        </div>
                        
                        <div className="flex flex-row md:flex-col gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            className="flex-1 md:w-auto"
                            onClick={() => handleAddAllocation(resource)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Allocate
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 md:w-auto"
                            onClick={() => handleAddEditResource(resource)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="flex-1 md:w-auto"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this resource? This will also remove all allocations associated with this resource.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteResource(resource.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      
                      {resource.allocations.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Project Allocations</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead>Allocation</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {resource.allocations.map(allocation => (
                                <TableRow key={allocation.id}>
                                  <TableCell>{allocation.projectName}</TableCell>
                                  <TableCell>{allocation.allocationPercentage}%</TableCell>
                                  <TableCell>
                                    {formatDate(allocation.startDate)} - {formatDate(allocation.endDate)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Allocation</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete this allocation?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleDeleteAllocation(allocation.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="allocations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation Report</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingResources ? (
                  <div className="text-center py-10">Loading allocation data...</div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No resources available for reporting.
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Resource</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Current Allocation</TableHead>
                          <TableHead>Project Count</TableHead>
                          <TableHead>Availability</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resources.map(resource => {
                          const currentDate = new Date();
                          const activeProjects = resource.allocations.filter(a => {
                            const startDate = new Date(a.startDate);
                            const endDate = new Date(a.endDate);
                            return startDate <= currentDate && endDate >= currentDate;
                          });
                          
                          return (
                            <TableRow key={resource.id}>
                              <TableCell className="font-medium">{resource.name}</TableCell>
                              <TableCell>{resource.role || 'Team Member'}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={resource.totalAllocation} className="h-2 w-[100px]" />
                                  <span>{resource.totalAllocation}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{activeProjects.length}</TableCell>
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
                                    : `${100 - resource.totalAllocation}% Available`}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    
                    <div className="pt-6">
                      <h3 className="text-lg font-medium mb-4">Project Allocation Overview</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Project</TableHead>
                            <TableHead>Resources Assigned</TableHead>
                            <TableHead>Total Allocation</TableHead>
                            <TableHead>Timeline</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Create a unique list of projects from all allocations */}
                          {Array.from(new Set(
                            resources.flatMap(r => r.allocations.map(a => a.projectName))
                          )).map(projectName => {
                            // Get all allocations for this project
                            const projectAllocations = resources.flatMap(r => 
                              r.allocations.filter(a => a.projectName === projectName)
                            );
                            
                            // Calculate total current allocation
                            const currentDate = new Date();
                            const activeAllocations = projectAllocations.filter(a => {
                              const startDate = new Date(a.startDate);
                              const endDate = new Date(a.endDate);
                              return startDate <= currentDate && endDate >= currentDate;
                            });
                            
                            // Calculate the date range (earliest start to latest end)
                            const startDates = projectAllocations.map(a => new Date(a.startDate));
                            const endDates = projectAllocations.map(a => new Date(a.endDate));
                            const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())));
                            const latestEnd = new Date(Math.max(...endDates.map(d => d.getTime())));
                            
                            return (
                              <TableRow key={projectName}>
                                <TableCell className="font-medium">{projectName}</TableCell>
                                <TableCell>{activeAllocations.length}</TableCell>
                                <TableCell>
                                  {activeAllocations.reduce((sum, a) => sum + a.allocationPercentage, 0)}%
                                </TableCell>
                                <TableCell>
                                  {formatDate(earliestStart.toISOString())} - {formatDate(latestEnd.toISOString())}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

export default ResourceManagement;
