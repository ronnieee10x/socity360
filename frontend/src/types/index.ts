// Society360 Type Definitions

export type UserRole =
  | 'PLATFORM_SUPER_ADMIN'
  | 'SOCIETY_ADMIN'
  | 'COMMITTEE_MEMBER'
  | 'FLAT_OWNER'
  | 'TENANT'
  | 'SECURITY_GUARD'
  | 'MAINTENANCE_STAFF';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  societyId?: string;
  societyName?: string;
  societyCode?: string;
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  avatarUrl?: string;
  flatId?: string;
  flatNumber?: string;
  buildingName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Society {
  id: string;
  code: string;
  name: string;
  registrationNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  settings?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocietyApplication {
  id: string;
  societyName: string;
  registrationNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  buildingCount: number;
  flatCount: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  documentUrl?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_INFORMATION_REQUIRED';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Building {
  id: string;
  societyId: string;
  name: string;
  totalFloors: number;
  description?: string;
  createdAt: string;
}

export interface Wing {
  id: string;
  societyId: string;
  buildingId: string;
  buildingName?: string;
  name: string;
  createdAt: string;
}

export interface Flat {
  id: string;
  societyId: string;
  buildingId: string;
  buildingName?: string;
  wingId: string;
  wingName?: string;
  flatNumber: string;
  floorNumber: number;
  flatType: 'STUDIO' | '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'PENTHOUSE' | 'VILLA';
  squareFeet: number;
  occupancyStatus: 'VACANT' | 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED';
  createdAt: string;
}

export interface Occupancy {
  id: string;
  societyId: string;
  flatId: string;
  flatNumber?: string;
  buildingName?: string;
  wingName?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  occupancyType: 'OWNER' | 'TENANT';
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'VACATED';
  documentProofUrl?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export type OccupancyResponseDto = Occupancy;

export interface VisitorEntry {
  id: string;
  societyId: string;
  flatId: string;
  flatNumber?: string;
  buildingName?: string;
  visitorName: string;
  phoneNumber: string;
  purpose: 'GUEST' | 'DELIVERY' | 'CAB' | 'SERVICE_REPAIR' | 'MAINTENANCE' | 'OTHER';
  entryType: 'WALK_IN' | 'PRE_APPROVED';
  passCode?: string;
  status: 'EXPECTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'REJECTED';
  checkInTime?: string;
  checkOutTime?: string;
  guardId?: string;
  guardName?: string;
  approvedBy?: string;
  vehicleNumber?: string;
  photoUrl?: string;
  createdAt: string;
  durationString?: string;
}

export type VisitorEntryResponseDto = VisitorEntry;

export interface Complaint {
  id: string;
  societyId: string;
  flatId: string;
  flatNumber?: string;
  buildingName?: string;
  createdById: string;
  createdByName?: string;
  createdByPhone?: string;
  ticketNumber: string;
  title: string;
  category: string;
  priority: string;
  description: string;
  status: 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  photoUrl?: string;
  assignedToId?: string;
  assignedToName?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ComplaintResponseDto = Complaint;

export interface Invoice {
  id: string;
  societyId: string;
  flatId: string;
  flatNumber?: string;
  invoiceNumber: string;
  billingMonth: string;
  amount: number;
  lateFee: number;
  dueDate: string;
  status: 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  description?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  societyId: string;
  invoiceId: string;
  invoiceNumber?: string;
  paidById: string;
  paidByName?: string;
  receiptNumber: string;
  amountPaid: number;
  paymentMethod: string;
  transactionReference: string;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  paidAt: string;
}

export interface PaymentReceiptDto {
  receiptNumber: string;
  transactionReference: string;
  invoiceNumber: string;
  billingMonth: string;
  societyName: string;
  buildingName?: string;
  flatNumber?: string;
  residentName?: string;
  residentEmail?: string;
  amountPaid: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string;
}

export type InvoiceResponseDto = Invoice & {
  buildingName?: string;
  totalAmount?: number;
  receiptNumber?: string;
  transactionReference?: string;
  paidAt?: string;
  paymentMethod?: string;
};

export type FacilityResponseDto = Facility;
export type FacilityBookingResponseDto = FacilityBooking;
export type NoticeResponseDto = Notice & {
  publishedByRole?: string;
};

export interface Facility {
  id: string;
  societyId: string;
  name: string;
  capacity: number;
  bookingChargePerHour: number;
  openingTime: string;
  closingTime: string;
  status: 'ACTIVE' | 'MAINTENANCE';
  createdAt: string;
}

export interface FacilityBooking {
  id: string;
  societyId: string;
  facilityId: string;
  facilityName?: string;
  bookedById: string;
  bookedByName?: string;
  flatId: string;
  flatNumber?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';
  totalCost: number;
  createdAt: string;
}

export interface Notice {
  id: string;
  societyId: string;
  title: string;
  content: string;
  noticeType: 'GENERAL' | 'EMERGENCY' | 'MAINTENANCE' | 'EVENT' | 'POLL';
  priority: 'NORMAL' | 'URGENT' | 'CRITICAL';
  publishedById: string;
  publishedByName?: string;
  expiresAt?: string;
  createdAt: string;
  readCount?: number;
  isRead?: boolean;
}

export interface AuditLog {
  id: string;
  societyId?: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}
