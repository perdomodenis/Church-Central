import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Announcement_Key {
  id: UUIDString;
  __typename?: 'Announcement_Key';
}

export interface AppointmentRequest_Key {
  id: UUIDString;
  __typename?: 'AppointmentRequest_Key';
}

export interface ApproveAppointmentData {
  appointmentRequest_update?: AppointmentRequest_Key | null;
}

export interface ApproveAppointmentVariables {
  id: UUIDString;
  approvedBy: string;
  selectedSlot: number;
  date: string;
  time: string;
}

export interface AssignPersonalProgramBlockData {
  personalProgramBlock_insert: PersonalProgramBlock_Key;
}

export interface AssignPersonalProgramBlockVariables {
  userId: string;
  assignedBy: string;
  date: string;
  time: string;
  endTime?: string | null;
  title: string;
  description?: string | null;
  location?: string | null;
  category?: string | null;
  type?: string | null;
  hours?: number | null;
  dressCode?: string | null;
}

export interface AssignPersonalReusableBlockData {
  personalReusableBlock_insert: PersonalReusableBlock_Key;
}

export interface AssignPersonalReusableBlockVariables {
  userId: string;
  assignedBy: string;
  title: string;
  description?: string | null;
  time: string;
  endTime?: string | null;
  location?: string | null;
  category?: string | null;
  type?: string | null;
  hours?: number | null;
  dressCode?: string | null;
}

export interface BaptismEvent_Key {
  id: UUIDString;
  __typename?: 'BaptismEvent_Key';
}

export interface BaptismRegistration_Key {
  baptismEventId: UUIDString;
  userUid: string;
  __typename?: 'BaptismRegistration_Key';
}

export interface CancelBaptismRegistrationData {
  baptismRegistration_delete?: BaptismRegistration_Key | null;
  baptismEvent_update?: BaptismEvent_Key | null;
}

export interface CancelBaptismRegistrationVariables {
  baptismEventId: UUIDString;
  userUid: string;
}

export interface CancelEventRegistrationData {
  eventRegistration_delete?: EventRegistration_Key | null;
  event_update?: Event_Key | null;
}

export interface CancelEventRegistrationVariables {
  eventId: UUIDString;
  userUid: string;
}

export interface CreateAnnouncementData {
  announcement_insert: Announcement_Key;
}

export interface CreateAnnouncementVariables {
  content: string;
  scope: string;
  category: string;
  imageUrl?: string | null;
  authorUid: string;
}

export interface CreateAppointmentRequestData {
  appointmentRequest_insert: AppointmentRequest_Key;
}

export interface CreateAppointmentRequestVariables {
  requester: string;
  requesterEmail: string;
  staff: string;
  leaderUid: string;
  paUid?: string | null;
  date1: string;
  time1: string;
  date2: string;
  time2: string;
  date3: string;
  time3: string;
  reason: string;
  type: string;
}

export interface CreateBaptismData {
  baptismEvent_insert: BaptismEvent_Key;
}

export interface CreateBaptismVariables {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  createdByUid: string;
}

export interface CreateEventData {
  event_insert: Event_Key;
}

export interface CreateEventVariables {
  title: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  description: string;
  type: string;
  capacity: number;
  createdByUid: string;
}

export interface CreatePersonalProgramBlockData {
  personalProgramBlock_insert: PersonalProgramBlock_Key;
}

export interface CreatePersonalProgramBlockVariables {
  date: string;
  time: string;
  endTime?: string | null;
  title: string;
  description?: string | null;
  location?: string | null;
  category?: string | null;
  type?: string | null;
  hours?: number | null;
  dressCode?: string | null;
}

export interface CreatePersonalReusableBlockData {
  personalReusableBlock_insert: PersonalReusableBlock_Key;
}

export interface CreatePersonalReusableBlockVariables {
  title: string;
  description?: string | null;
  time: string;
  endTime?: string | null;
  location?: string | null;
  category?: string | null;
  type?: string | null;
  hours?: number | null;
  dressCode?: string | null;
}

export interface CreateProgramBlockData {
  programBlock_insert: ProgramBlock_Key;
}

export interface CreateProgramBlockVariables {
  date: string;
  time: string;
  title: string;
  minister: string;
}

export interface CreateReusableBlockData {
  reusableBlock_insert: ReusableBlock_Key;
}

export interface CreateReusableBlockVariables {
  title: string;
  minister: string;
  time: string;
}

export interface DeleteBaptismEventData {
  baptismEvent_delete?: BaptismEvent_Key | null;
}

export interface DeleteBaptismEventVariables {
  id: UUIDString;
}

export interface DeleteEventData {
  event_delete?: Event_Key | null;
}

export interface DeleteEventVariables {
  id: UUIDString;
}

export interface DeletePersonalProgramBlockData {
  personalProgramBlock_delete?: PersonalProgramBlock_Key | null;
}

export interface DeletePersonalProgramBlockVariables {
  id: UUIDString;
}

export interface DeletePersonalReusableBlockData {
  personalReusableBlock_delete?: PersonalReusableBlock_Key | null;
}

export interface DeletePersonalReusableBlockVariables {
  id: UUIDString;
}

export interface DeleteProgramBlockData {
  programBlock_delete?: ProgramBlock_Key | null;
}

export interface DeleteProgramBlockVariables {
  id: UUIDString;
}

export interface DeleteReusableBlockData {
  reusableBlock_delete?: ReusableBlock_Key | null;
}

export interface DeleteReusableBlockVariables {
  id: UUIDString;
}

export interface EventRegistration_Key {
  eventId: UUIDString;
  userUid: string;
  __typename?: 'EventRegistration_Key';
}

export interface Event_Key {
  id: UUIDString;
  __typename?: 'Event_Key';
}

export interface GetEventDetailsData {
  event?: {
    id: UUIDString;
    title: string;
    date: string;
    time: string;
    endTime: string;
    location: string;
    description: string;
    type: string;
    capacity: number;
    registered: number;
    createdAt: TimestampString;
    createdBy: {
      uid: string;
      first: string;
      last: string;
    } & User_Key;
      eventRegistrations_on_event: ({
        user: {
          uid: string;
          first: string;
          last: string;
          profilePhoto?: string | null;
        } & User_Key;
      })[];
  } & Event_Key;
}

export interface GetEventDetailsVariables {
  id: UUIDString;
}

export interface GetUserContextData {
  user?: {
    uid: string;
    court?: string | null;
    courts?: string[] | null;
    dept?: string | null;
    depts?: string[] | null;
    district?: string | null;
    gender?: string | null;
    schoolClass?: string | null;
    position?: string | null;
    authorizedPostAsChurch?: boolean | null;
    authorizedPostAsDept?: boolean | null;
    authorizedPostAsCourt?: boolean | null;
    authorizedCreateProgram?: boolean | null;
  } & User_Key;
}

export interface GetUserContextVariables {
  uid: string;
}

export interface GetUserProfileData {
  user?: {
    uid: string;
    email: string;
    first: string;
    last: string;
    zip?: string | null;
    city?: string | null;
    court?: string | null;
    courts?: string[] | null;
    dept?: string | null;
    depts?: string[] | null;
    district?: string | null;
    gender?: string | null;
    schoolClass?: string | null;
    position?: string | null;
    bio?: string | null;
    profilePhoto?: string | null;
    joined?: string | null;
    lastActive?: string | null;
    status?: string | null;
    recentActivity?: string | null;
    interests?: string[] | null;
    pa?: {
      uid: string;
      first: string;
      last: string;
    } & User_Key;
      authorizedPostAsChurch?: boolean | null;
      authorizedPostAsDept?: boolean | null;
      authorizedPostAsCourt?: boolean | null;
      authorizedCreateProgram?: boolean | null;
  } & User_Key;
}

export interface GetUserProfileVariables {
  uid: string;
}

export interface ListApprovedAppointmentsData {
  appointmentRequests: ({
    id: UUIDString;
    requester: string;
    requesterEmail: string;
    staff: string;
    date1: string;
    time1: string;
    date2: string;
    time2: string;
    date3: string;
    time3: string;
    date?: string | null;
    time?: string | null;
    reason: string;
    type: string;
    status: string;
    createdAt: TimestampString;
    approvedBy?: string | null;
    decidedAt?: TimestampString | null;
    selectedSlot?: number | null;
    leader?: {
      uid: string;
      first: string;
      last: string;
      profilePhoto?: string | null;
      position?: string | null;
    } & User_Key;
      pa?: {
        uid: string;
        first: string;
        last: string;
      } & User_Key;
  } & AppointmentRequest_Key)[];
}

export interface ListAssignedPersonalProgramBlocksData {
  personalProgramBlocks: ({
    id: UUIDString;
    user: {
      uid: string;
      first: string;
      last: string;
      email: string;
      position?: string | null;
      court?: string | null;
      dept?: string | null;
      district?: string | null;
    } & User_Key;
      date: string;
      time: string;
      endTime?: string | null;
      title: string;
      description?: string | null;
      location?: string | null;
      category?: string | null;
      type?: string | null;
      hours?: number | null;
      dressCode?: string | null;
      assignedBy?: string | null;
  } & PersonalProgramBlock_Key)[];
}

export interface ListAssignedPersonalReusableBlocksData {
  personalReusableBlocks: ({
    id: UUIDString;
    user: {
      uid: string;
      first: string;
      last: string;
      email: string;
      position?: string | null;
      court?: string | null;
      dept?: string | null;
      district?: string | null;
    } & User_Key;
      title: string;
      description?: string | null;
      time: string;
      endTime?: string | null;
      location?: string | null;
      category?: string | null;
      type?: string | null;
      hours?: number | null;
      dressCode?: string | null;
      assignedBy?: string | null;
  } & PersonalReusableBlock_Key)[];
}

export interface ListBaptismsData {
  baptismEvents: ({
    id: UUIDString;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    capacity: number;
    registeredCount: number;
    createdAt: TimestampString;
    createdBy: {
      uid: string;
      first: string;
      last: string;
    } & User_Key;
      baptismRegistrations_on_baptismEvent: ({
        user: {
          uid: string;
          first: string;
          last: string;
          profilePhoto?: string | null;
        } & User_Key;
      })[];
  } & BaptismEvent_Key)[];
}

export interface ListEventsData {
  events: ({
    id: UUIDString;
    title: string;
    date: string;
    time: string;
    endTime: string;
    location: string;
    description: string;
    type: string;
    capacity: number;
    registered: number;
    createdAt: TimestampString;
    createdBy: {
      uid: string;
      first: string;
      last: string;
    } & User_Key;
      eventRegistrations_on_event: ({
        user: {
          uid: string;
          first: string;
          last: string;
        } & User_Key;
      })[];
  } & Event_Key)[];
}

export interface ListFeedPostsData {
  announcements: ({
    id: UUIDString;
    content: string;
    scope: string;
    category: string;
    imageUrl?: string | null;
    likes: number;
    createdAt: TimestampString;
    author: {
      uid: string;
      first: string;
      last: string;
      profilePhoto?: string | null;
      district?: string | null;
      court?: string | null;
    } & User_Key;
  } & Announcement_Key)[];
}

export interface ListMembersData {
  users: ({
    uid: string;
    email: string;
    first: string;
    last: string;
    zip?: string | null;
    city?: string | null;
    court?: string | null;
    courts?: string[] | null;
    dept?: string | null;
    depts?: string[] | null;
    district?: string | null;
    gender?: string | null;
    schoolClass?: string | null;
    position?: string | null;
    bio?: string | null;
    profilePhoto?: string | null;
    joined?: string | null;
    lastActive?: string | null;
    status?: string | null;
    recentActivity?: string | null;
    interests?: string[] | null;
    pa?: {
      uid: string;
      first: string;
      last: string;
    } & User_Key;
      authorizedPostAsChurch?: boolean | null;
      authorizedPostAsDept?: boolean | null;
      authorizedPostAsCourt?: boolean | null;
      authorizedCreateProgram?: boolean | null;
  } & User_Key)[];
}

export interface ListPendingAppointmentsData {
  appointmentRequests: ({
    id: UUIDString;
    requester: string;
    requesterEmail: string;
    staff: string;
    date1: string;
    time1: string;
    date2: string;
    time2: string;
    date3: string;
    time3: string;
    date?: string | null;
    time?: string | null;
    reason: string;
    type: string;
    status: string;
    createdAt: TimestampString;
    leader?: {
      uid: string;
      first: string;
      last: string;
      profilePhoto?: string | null;
      position?: string | null;
    } & User_Key;
      pa?: {
        uid: string;
        first: string;
        last: string;
      } & User_Key;
  } & AppointmentRequest_Key)[];
}

export interface ListPersonalProgramBlocksData {
  personalProgramBlocks: ({
    id: UUIDString;
    date: string;
    time: string;
    endTime?: string | null;
    title: string;
    description?: string | null;
    location?: string | null;
    category?: string | null;
    type?: string | null;
    hours?: number | null;
    dressCode?: string | null;
  } & PersonalProgramBlock_Key)[];
}

export interface ListPersonalReusableBlocksData {
  personalReusableBlocks: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    time: string;
    endTime?: string | null;
    location?: string | null;
    category?: string | null;
    type?: string | null;
    hours?: number | null;
    dressCode?: string | null;
  } & PersonalReusableBlock_Key)[];
}

export interface ListProgramBlocksData {
  programBlocks: ({
    id: UUIDString;
    date: string;
    time: string;
    title: string;
    minister: string;
  } & ProgramBlock_Key)[];
}

export interface ListRejectedAppointmentsData {
  appointmentRequests: ({
    id: UUIDString;
    requester: string;
    requesterEmail: string;
    staff: string;
    date1: string;
    time1: string;
    date2: string;
    time2: string;
    date3: string;
    time3: string;
    date?: string | null;
    time?: string | null;
    reason: string;
    type: string;
    status: string;
    createdAt: TimestampString;
    rejectedBy?: string | null;
    rejectionReason?: string | null;
    decidedAt?: TimestampString | null;
    leader?: {
      uid: string;
      first: string;
      last: string;
      profilePhoto?: string | null;
      position?: string | null;
    } & User_Key;
      pa?: {
        uid: string;
        first: string;
        last: string;
      } & User_Key;
  } & AppointmentRequest_Key)[];
}

export interface ListReusableBlocksData {
  reusableBlocks: ({
    id: UUIDString;
    title: string;
    minister: string;
    time: string;
  } & ReusableBlock_Key)[];
}

export interface PersonalProgramBlock_Key {
  id: UUIDString;
  __typename?: 'PersonalProgramBlock_Key';
}

export interface PersonalReusableBlock_Key {
  id: UUIDString;
  __typename?: 'PersonalReusableBlock_Key';
}

export interface ProgramBlock_Key {
  id: UUIDString;
  __typename?: 'ProgramBlock_Key';
}

export interface RegisterForBaptismData {
  baptismRegistration_insert: BaptismRegistration_Key;
  baptismEvent_update?: BaptismEvent_Key | null;
}

export interface RegisterForBaptismVariables {
  baptismEventId: UUIDString;
  userUid: string;
}

export interface RegisterForEventData {
  eventRegistration_insert: EventRegistration_Key;
  event_update?: Event_Key | null;
}

export interface RegisterForEventVariables {
  eventId: UUIDString;
  userUid: string;
}

export interface RejectAppointmentData {
  appointmentRequest_update?: AppointmentRequest_Key | null;
}

export interface RejectAppointmentVariables {
  id: UUIDString;
  rejectedBy: string;
  rejectionReason: string;
}

export interface ReusableBlock_Key {
  id: UUIDString;
  __typename?: 'ReusableBlock_Key';
}

export interface SearchMembersData {
  users: ({
    uid: string;
    email: string;
    first: string;
    last: string;
    zip?: string | null;
    city?: string | null;
    court?: string | null;
    courts?: string[] | null;
    dept?: string | null;
    depts?: string[] | null;
    district?: string | null;
    gender?: string | null;
    schoolClass?: string | null;
    position?: string | null;
    bio?: string | null;
    profilePhoto?: string | null;
    joined?: string | null;
    lastActive?: string | null;
    status?: string | null;
    recentActivity?: string | null;
    interests?: string[] | null;
    pa?: {
      uid: string;
      first: string;
      last: string;
    } & User_Key;
      authorizedPostAsChurch?: boolean | null;
      authorizedPostAsDept?: boolean | null;
      authorizedPostAsCourt?: boolean | null;
      authorizedCreateProgram?: boolean | null;
  } & User_Key)[];
}

export interface SearchMembersVariables {
  query: string;
}

export interface UpdateEventData {
  event_update?: Event_Key | null;
}

export interface UpdateEventVariables {
  id: UUIDString;
  title?: string | null;
  date?: string | null;
  time?: string | null;
  endTime?: string | null;
  location?: string | null;
  description?: string | null;
  type?: string | null;
  capacity?: number | null;
}

export interface UpdatePersonalReusableBlockData {
  personalReusableBlock_update?: PersonalReusableBlock_Key | null;
}

export interface UpdatePersonalReusableBlockVariables {
  id: UUIDString;
  title: string;
  description?: string | null;
  time: string;
  endTime?: string | null;
  location?: string | null;
  category?: string | null;
  type?: string | null;
  hours?: number | null;
  dressCode?: string | null;
}

export interface UpdateReusableBlockData {
  reusableBlock_update?: ReusableBlock_Key | null;
}

export interface UpdateReusableBlockVariables {
  id: UUIDString;
  title: string;
  minister: string;
  time: string;
}

export interface UpsertUserProfileData {
  user_upsert: User_Key;
}

export interface UpsertUserProfileVariables {
  uid: string;
  email: string;
  first: string;
  last: string;
  zip?: string | null;
  city?: string | null;
  court?: string | null;
  courts?: string[] | null;
  dept?: string | null;
  depts?: string[] | null;
  district?: string | null;
  gender?: string | null;
  schoolClass?: string | null;
  position?: string | null;
  bio?: string | null;
  profilePhoto?: string | null;
  joined?: string | null;
  lastActive?: string | null;
  status?: string | null;
  recentActivity?: string | null;
  interests?: string[] | null;
  paUid?: string | null;
  authorizedPostAsChurch?: boolean | null;
  authorizedPostAsDept?: boolean | null;
  authorizedPostAsCourt?: boolean | null;
  authorizedCreateProgram?: boolean | null;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'UpsertUserProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertUserProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertUserProfile(vars: UpsertUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'CreateAnnouncement' Mutation. Allow users to execute without passing in DataConnect. */
export function createAnnouncement(dc: DataConnect, vars: CreateAnnouncementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAnnouncementData>>;
/** Generated Node Admin SDK operation action function for the 'CreateAnnouncement' Mutation. Allow users to pass in custom DataConnect instances. */
export function createAnnouncement(vars: CreateAnnouncementVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAnnouncementData>>;

/** Generated Node Admin SDK operation action function for the 'CreateEvent' Mutation. Allow users to execute without passing in DataConnect. */
export function createEvent(dc: DataConnect, vars: CreateEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateEventData>>;
/** Generated Node Admin SDK operation action function for the 'CreateEvent' Mutation. Allow users to pass in custom DataConnect instances. */
export function createEvent(vars: CreateEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateEventData>>;

/** Generated Node Admin SDK operation action function for the 'RegisterForEvent' Mutation. Allow users to execute without passing in DataConnect. */
export function registerForEvent(dc: DataConnect, vars: RegisterForEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RegisterForEventData>>;
/** Generated Node Admin SDK operation action function for the 'RegisterForEvent' Mutation. Allow users to pass in custom DataConnect instances. */
export function registerForEvent(vars: RegisterForEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RegisterForEventData>>;

/** Generated Node Admin SDK operation action function for the 'CancelEventRegistration' Mutation. Allow users to execute without passing in DataConnect. */
export function cancelEventRegistration(dc: DataConnect, vars: CancelEventRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CancelEventRegistrationData>>;
/** Generated Node Admin SDK operation action function for the 'CancelEventRegistration' Mutation. Allow users to pass in custom DataConnect instances. */
export function cancelEventRegistration(vars: CancelEventRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CancelEventRegistrationData>>;

/** Generated Node Admin SDK operation action function for the 'CreateBaptism' Mutation. Allow users to execute without passing in DataConnect. */
export function createBaptism(dc: DataConnect, vars: CreateBaptismVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateBaptismData>>;
/** Generated Node Admin SDK operation action function for the 'CreateBaptism' Mutation. Allow users to pass in custom DataConnect instances. */
export function createBaptism(vars: CreateBaptismVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateBaptismData>>;

/** Generated Node Admin SDK operation action function for the 'RegisterForBaptism' Mutation. Allow users to execute without passing in DataConnect. */
export function registerForBaptism(dc: DataConnect, vars: RegisterForBaptismVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RegisterForBaptismData>>;
/** Generated Node Admin SDK operation action function for the 'RegisterForBaptism' Mutation. Allow users to pass in custom DataConnect instances. */
export function registerForBaptism(vars: RegisterForBaptismVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RegisterForBaptismData>>;

/** Generated Node Admin SDK operation action function for the 'CancelBaptismRegistration' Mutation. Allow users to execute without passing in DataConnect. */
export function cancelBaptismRegistration(dc: DataConnect, vars: CancelBaptismRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CancelBaptismRegistrationData>>;
/** Generated Node Admin SDK operation action function for the 'CancelBaptismRegistration' Mutation. Allow users to pass in custom DataConnect instances. */
export function cancelBaptismRegistration(vars: CancelBaptismRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CancelBaptismRegistrationData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteEvent' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteEvent(dc: DataConnect, vars: DeleteEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteEventData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteEvent' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteEvent(vars: DeleteEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteEventData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteBaptismEvent' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteBaptismEvent(dc: DataConnect, vars: DeleteBaptismEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteBaptismEventData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteBaptismEvent' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteBaptismEvent(vars: DeleteBaptismEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteBaptismEventData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateEvent' Mutation. Allow users to execute without passing in DataConnect. */
export function updateEvent(dc: DataConnect, vars: UpdateEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateEventData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateEvent' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateEvent(vars: UpdateEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateEventData>>;

/** Generated Node Admin SDK operation action function for the 'CreateAppointmentRequest' Mutation. Allow users to execute without passing in DataConnect. */
export function createAppointmentRequest(dc: DataConnect, vars: CreateAppointmentRequestVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAppointmentRequestData>>;
/** Generated Node Admin SDK operation action function for the 'CreateAppointmentRequest' Mutation. Allow users to pass in custom DataConnect instances. */
export function createAppointmentRequest(vars: CreateAppointmentRequestVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAppointmentRequestData>>;

/** Generated Node Admin SDK operation action function for the 'ApproveAppointment' Mutation. Allow users to execute without passing in DataConnect. */
export function approveAppointment(dc: DataConnect, vars: ApproveAppointmentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ApproveAppointmentData>>;
/** Generated Node Admin SDK operation action function for the 'ApproveAppointment' Mutation. Allow users to pass in custom DataConnect instances. */
export function approveAppointment(vars: ApproveAppointmentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ApproveAppointmentData>>;

/** Generated Node Admin SDK operation action function for the 'RejectAppointment' Mutation. Allow users to execute without passing in DataConnect. */
export function rejectAppointment(dc: DataConnect, vars: RejectAppointmentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RejectAppointmentData>>;
/** Generated Node Admin SDK operation action function for the 'RejectAppointment' Mutation. Allow users to pass in custom DataConnect instances. */
export function rejectAppointment(vars: RejectAppointmentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RejectAppointmentData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProgramBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function createProgramBlock(dc: DataConnect, vars: CreateProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProgramBlockData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProgramBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProgramBlock(vars: CreateProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProgramBlockData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProgramBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProgramBlock(dc: DataConnect, vars: DeleteProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProgramBlockData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProgramBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProgramBlock(vars: DeleteProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProgramBlockData>>;

/** Generated Node Admin SDK operation action function for the 'CreateReusableBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function createReusableBlock(dc: DataConnect, vars: CreateReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateReusableBlockData>>;
/** Generated Node Admin SDK operation action function for the 'CreateReusableBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function createReusableBlock(vars: CreateReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateReusableBlockData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteReusableBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteReusableBlock(dc: DataConnect, vars: DeleteReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteReusableBlockData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteReusableBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteReusableBlock(vars: DeleteReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteReusableBlockData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateReusableBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function updateReusableBlock(dc: DataConnect, vars: UpdateReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateReusableBlockData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateReusableBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateReusableBlock(vars: UpdateReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateReusableBlockData>>;

/** Generated Node Admin SDK operation action function for the 'CreatePersonalProgramBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function createPersonalProgramBlock(dc: DataConnect, vars: CreatePersonalProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePersonalProgramBlockData>>;
/** Generated Node Admin SDK operation action function for the 'CreatePersonalProgramBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function createPersonalProgramBlock(vars: CreatePersonalProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePersonalProgramBlockData>>;

/** Generated Node Admin SDK operation action function for the 'DeletePersonalProgramBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function deletePersonalProgramBlock(dc: DataConnect, vars: DeletePersonalProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePersonalProgramBlockData>>;
/** Generated Node Admin SDK operation action function for the 'DeletePersonalProgramBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function deletePersonalProgramBlock(vars: DeletePersonalProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePersonalProgramBlockData>>;

/** Generated Node Admin SDK operation action function for the 'CreatePersonalReusableBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function createPersonalReusableBlock(dc: DataConnect, vars: CreatePersonalReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePersonalReusableBlockData>>;
/** Generated Node Admin SDK operation action function for the 'CreatePersonalReusableBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function createPersonalReusableBlock(vars: CreatePersonalReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePersonalReusableBlockData>>;

/** Generated Node Admin SDK operation action function for the 'DeletePersonalReusableBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function deletePersonalReusableBlock(dc: DataConnect, vars: DeletePersonalReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePersonalReusableBlockData>>;
/** Generated Node Admin SDK operation action function for the 'DeletePersonalReusableBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function deletePersonalReusableBlock(vars: DeletePersonalReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePersonalReusableBlockData>>;

/** Generated Node Admin SDK operation action function for the 'UpdatePersonalReusableBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function updatePersonalReusableBlock(dc: DataConnect, vars: UpdatePersonalReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePersonalReusableBlockData>>;
/** Generated Node Admin SDK operation action function for the 'UpdatePersonalReusableBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function updatePersonalReusableBlock(vars: UpdatePersonalReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePersonalReusableBlockData>>;

/** Generated Node Admin SDK operation action function for the 'AssignPersonalProgramBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function assignPersonalProgramBlock(dc: DataConnect, vars: AssignPersonalProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AssignPersonalProgramBlockData>>;
/** Generated Node Admin SDK operation action function for the 'AssignPersonalProgramBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function assignPersonalProgramBlock(vars: AssignPersonalProgramBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AssignPersonalProgramBlockData>>;

/** Generated Node Admin SDK operation action function for the 'AssignPersonalReusableBlock' Mutation. Allow users to execute without passing in DataConnect. */
export function assignPersonalReusableBlock(dc: DataConnect, vars: AssignPersonalReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AssignPersonalReusableBlockData>>;
/** Generated Node Admin SDK operation action function for the 'AssignPersonalReusableBlock' Mutation. Allow users to pass in custom DataConnect instances. */
export function assignPersonalReusableBlock(vars: AssignPersonalReusableBlockVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AssignPersonalReusableBlockData>>;

/** Generated Node Admin SDK operation action function for the 'GetUserContext' Query. Allow users to execute without passing in DataConnect. */
export function getUserContext(dc: DataConnect, vars: GetUserContextVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserContextData>>;
/** Generated Node Admin SDK operation action function for the 'GetUserContext' Query. Allow users to pass in custom DataConnect instances. */
export function getUserContext(vars: GetUserContextVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserContextData>>;

/** Generated Node Admin SDK operation action function for the 'GetUserProfile' Query. Allow users to execute without passing in DataConnect. */
export function getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetUserProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getUserProfile(vars: GetUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'ListMembers' Query. Allow users to execute without passing in DataConnect. */
export function listMembers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMembersData>>;
/** Generated Node Admin SDK operation action function for the 'ListMembers' Query. Allow users to pass in custom DataConnect instances. */
export function listMembers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMembersData>>;

/** Generated Node Admin SDK operation action function for the 'SearchMembers' Query. Allow users to execute without passing in DataConnect. */
export function searchMembers(dc: DataConnect, vars: SearchMembersVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchMembersData>>;
/** Generated Node Admin SDK operation action function for the 'SearchMembers' Query. Allow users to pass in custom DataConnect instances. */
export function searchMembers(vars: SearchMembersVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchMembersData>>;

/** Generated Node Admin SDK operation action function for the 'ListFeedPosts' Query. Allow users to execute without passing in DataConnect. */
export function listFeedPosts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListFeedPostsData>>;
/** Generated Node Admin SDK operation action function for the 'ListFeedPosts' Query. Allow users to pass in custom DataConnect instances. */
export function listFeedPosts(options?: OperationOptions): Promise<ExecuteOperationResponse<ListFeedPostsData>>;

/** Generated Node Admin SDK operation action function for the 'ListEvents' Query. Allow users to execute without passing in DataConnect. */
export function listEvents(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListEventsData>>;
/** Generated Node Admin SDK operation action function for the 'ListEvents' Query. Allow users to pass in custom DataConnect instances. */
export function listEvents(options?: OperationOptions): Promise<ExecuteOperationResponse<ListEventsData>>;

/** Generated Node Admin SDK operation action function for the 'GetEventDetails' Query. Allow users to execute without passing in DataConnect. */
export function getEventDetails(dc: DataConnect, vars: GetEventDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetEventDetailsData>>;
/** Generated Node Admin SDK operation action function for the 'GetEventDetails' Query. Allow users to pass in custom DataConnect instances. */
export function getEventDetails(vars: GetEventDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetEventDetailsData>>;

/** Generated Node Admin SDK operation action function for the 'ListBaptisms' Query. Allow users to execute without passing in DataConnect. */
export function listBaptisms(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListBaptismsData>>;
/** Generated Node Admin SDK operation action function for the 'ListBaptisms' Query. Allow users to pass in custom DataConnect instances. */
export function listBaptisms(options?: OperationOptions): Promise<ExecuteOperationResponse<ListBaptismsData>>;

/** Generated Node Admin SDK operation action function for the 'ListPendingAppointments' Query. Allow users to execute without passing in DataConnect. */
export function listPendingAppointments(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPendingAppointmentsData>>;
/** Generated Node Admin SDK operation action function for the 'ListPendingAppointments' Query. Allow users to pass in custom DataConnect instances. */
export function listPendingAppointments(options?: OperationOptions): Promise<ExecuteOperationResponse<ListPendingAppointmentsData>>;

/** Generated Node Admin SDK operation action function for the 'ListApprovedAppointments' Query. Allow users to execute without passing in DataConnect. */
export function listApprovedAppointments(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListApprovedAppointmentsData>>;
/** Generated Node Admin SDK operation action function for the 'ListApprovedAppointments' Query. Allow users to pass in custom DataConnect instances. */
export function listApprovedAppointments(options?: OperationOptions): Promise<ExecuteOperationResponse<ListApprovedAppointmentsData>>;

/** Generated Node Admin SDK operation action function for the 'ListRejectedAppointments' Query. Allow users to execute without passing in DataConnect. */
export function listRejectedAppointments(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListRejectedAppointmentsData>>;
/** Generated Node Admin SDK operation action function for the 'ListRejectedAppointments' Query. Allow users to pass in custom DataConnect instances. */
export function listRejectedAppointments(options?: OperationOptions): Promise<ExecuteOperationResponse<ListRejectedAppointmentsData>>;

/** Generated Node Admin SDK operation action function for the 'ListProgramBlocks' Query. Allow users to execute without passing in DataConnect. */
export function listProgramBlocks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProgramBlocksData>>;
/** Generated Node Admin SDK operation action function for the 'ListProgramBlocks' Query. Allow users to pass in custom DataConnect instances. */
export function listProgramBlocks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListProgramBlocksData>>;

/** Generated Node Admin SDK operation action function for the 'ListReusableBlocks' Query. Allow users to execute without passing in DataConnect. */
export function listReusableBlocks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListReusableBlocksData>>;
/** Generated Node Admin SDK operation action function for the 'ListReusableBlocks' Query. Allow users to pass in custom DataConnect instances. */
export function listReusableBlocks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListReusableBlocksData>>;

/** Generated Node Admin SDK operation action function for the 'ListPersonalProgramBlocks' Query. Allow users to execute without passing in DataConnect. */
export function listPersonalProgramBlocks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPersonalProgramBlocksData>>;
/** Generated Node Admin SDK operation action function for the 'ListPersonalProgramBlocks' Query. Allow users to pass in custom DataConnect instances. */
export function listPersonalProgramBlocks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListPersonalProgramBlocksData>>;

/** Generated Node Admin SDK operation action function for the 'ListPersonalReusableBlocks' Query. Allow users to execute without passing in DataConnect. */
export function listPersonalReusableBlocks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPersonalReusableBlocksData>>;
/** Generated Node Admin SDK operation action function for the 'ListPersonalReusableBlocks' Query. Allow users to pass in custom DataConnect instances. */
export function listPersonalReusableBlocks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListPersonalReusableBlocksData>>;

/** Generated Node Admin SDK operation action function for the 'ListAssignedPersonalProgramBlocks' Query. Allow users to execute without passing in DataConnect. */
export function listAssignedPersonalProgramBlocks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAssignedPersonalProgramBlocksData>>;
/** Generated Node Admin SDK operation action function for the 'ListAssignedPersonalProgramBlocks' Query. Allow users to pass in custom DataConnect instances. */
export function listAssignedPersonalProgramBlocks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAssignedPersonalProgramBlocksData>>;

/** Generated Node Admin SDK operation action function for the 'ListAssignedPersonalReusableBlocks' Query. Allow users to execute without passing in DataConnect. */
export function listAssignedPersonalReusableBlocks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAssignedPersonalReusableBlocksData>>;
/** Generated Node Admin SDK operation action function for the 'ListAssignedPersonalReusableBlocks' Query. Allow users to pass in custom DataConnect instances. */
export function listAssignedPersonalReusableBlocks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAssignedPersonalReusableBlocksData>>;

