
export interface Resource {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

export interface ResourceInput {
  name: string;
  email: string;
  role?: string;
}

export interface Allocation {
  id: string;
  resourceId: string;
  projectName: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface AllocationInput {
  resourceId: string;
  projectName: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
}

export interface ResourceAllocation extends Resource {
  allocations: Allocation[];
  totalAllocation: number;
}

export interface MeetingRecording {
  id: string;
  meetingId: string;
  recordingUrl: string;
  recordingDate: string;
  fileSize?: number;
  duration?: number;
  createdAt: string;
}
