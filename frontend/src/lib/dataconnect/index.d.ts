import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

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

interface UpsertUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  operationName: string;
}
export const upsertUserProfileRef: UpsertUserProfileRef;

export function upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;
export function upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface CreateAnnouncementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAnnouncementVariables): MutationRef<CreateAnnouncementData, CreateAnnouncementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAnnouncementVariables): MutationRef<CreateAnnouncementData, CreateAnnouncementVariables>;
  operationName: string;
}
export const createAnnouncementRef: CreateAnnouncementRef;

export function createAnnouncement(vars: CreateAnnouncementVariables): MutationPromise<CreateAnnouncementData, CreateAnnouncementVariables>;
export function createAnnouncement(dc: DataConnect, vars: CreateAnnouncementVariables): MutationPromise<CreateAnnouncementData, CreateAnnouncementVariables>;

interface CreateEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
  operationName: string;
}
export const createEventRef: CreateEventRef;

export function createEvent(vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;
export function createEvent(dc: DataConnect, vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

interface RegisterForEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterForEventVariables): MutationRef<RegisterForEventData, RegisterForEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterForEventVariables): MutationRef<RegisterForEventData, RegisterForEventVariables>;
  operationName: string;
}
export const registerForEventRef: RegisterForEventRef;

export function registerForEvent(vars: RegisterForEventVariables): MutationPromise<RegisterForEventData, RegisterForEventVariables>;
export function registerForEvent(dc: DataConnect, vars: RegisterForEventVariables): MutationPromise<RegisterForEventData, RegisterForEventVariables>;

interface CancelEventRegistrationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelEventRegistrationVariables): MutationRef<CancelEventRegistrationData, CancelEventRegistrationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CancelEventRegistrationVariables): MutationRef<CancelEventRegistrationData, CancelEventRegistrationVariables>;
  operationName: string;
}
export const cancelEventRegistrationRef: CancelEventRegistrationRef;

export function cancelEventRegistration(vars: CancelEventRegistrationVariables): MutationPromise<CancelEventRegistrationData, CancelEventRegistrationVariables>;
export function cancelEventRegistration(dc: DataConnect, vars: CancelEventRegistrationVariables): MutationPromise<CancelEventRegistrationData, CancelEventRegistrationVariables>;

interface CreateBaptismRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBaptismVariables): MutationRef<CreateBaptismData, CreateBaptismVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBaptismVariables): MutationRef<CreateBaptismData, CreateBaptismVariables>;
  operationName: string;
}
export const createBaptismRef: CreateBaptismRef;

export function createBaptism(vars: CreateBaptismVariables): MutationPromise<CreateBaptismData, CreateBaptismVariables>;
export function createBaptism(dc: DataConnect, vars: CreateBaptismVariables): MutationPromise<CreateBaptismData, CreateBaptismVariables>;

interface RegisterForBaptismRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterForBaptismVariables): MutationRef<RegisterForBaptismData, RegisterForBaptismVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterForBaptismVariables): MutationRef<RegisterForBaptismData, RegisterForBaptismVariables>;
  operationName: string;
}
export const registerForBaptismRef: RegisterForBaptismRef;

export function registerForBaptism(vars: RegisterForBaptismVariables): MutationPromise<RegisterForBaptismData, RegisterForBaptismVariables>;
export function registerForBaptism(dc: DataConnect, vars: RegisterForBaptismVariables): MutationPromise<RegisterForBaptismData, RegisterForBaptismVariables>;

interface CancelBaptismRegistrationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelBaptismRegistrationVariables): MutationRef<CancelBaptismRegistrationData, CancelBaptismRegistrationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CancelBaptismRegistrationVariables): MutationRef<CancelBaptismRegistrationData, CancelBaptismRegistrationVariables>;
  operationName: string;
}
export const cancelBaptismRegistrationRef: CancelBaptismRegistrationRef;

export function cancelBaptismRegistration(vars: CancelBaptismRegistrationVariables): MutationPromise<CancelBaptismRegistrationData, CancelBaptismRegistrationVariables>;
export function cancelBaptismRegistration(dc: DataConnect, vars: CancelBaptismRegistrationVariables): MutationPromise<CancelBaptismRegistrationData, CancelBaptismRegistrationVariables>;

interface DeleteEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEventVariables): MutationRef<DeleteEventData, DeleteEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEventVariables): MutationRef<DeleteEventData, DeleteEventVariables>;
  operationName: string;
}
export const deleteEventRef: DeleteEventRef;

export function deleteEvent(vars: DeleteEventVariables): MutationPromise<DeleteEventData, DeleteEventVariables>;
export function deleteEvent(dc: DataConnect, vars: DeleteEventVariables): MutationPromise<DeleteEventData, DeleteEventVariables>;

interface DeleteBaptismEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBaptismEventVariables): MutationRef<DeleteBaptismEventData, DeleteBaptismEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBaptismEventVariables): MutationRef<DeleteBaptismEventData, DeleteBaptismEventVariables>;
  operationName: string;
}
export const deleteBaptismEventRef: DeleteBaptismEventRef;

export function deleteBaptismEvent(vars: DeleteBaptismEventVariables): MutationPromise<DeleteBaptismEventData, DeleteBaptismEventVariables>;
export function deleteBaptismEvent(dc: DataConnect, vars: DeleteBaptismEventVariables): MutationPromise<DeleteBaptismEventData, DeleteBaptismEventVariables>;

interface UpdateEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEventVariables): MutationRef<UpdateEventData, UpdateEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEventVariables): MutationRef<UpdateEventData, UpdateEventVariables>;
  operationName: string;
}
export const updateEventRef: UpdateEventRef;

export function updateEvent(vars: UpdateEventVariables): MutationPromise<UpdateEventData, UpdateEventVariables>;
export function updateEvent(dc: DataConnect, vars: UpdateEventVariables): MutationPromise<UpdateEventData, UpdateEventVariables>;

interface CreateAppointmentRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAppointmentRequestVariables): MutationRef<CreateAppointmentRequestData, CreateAppointmentRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAppointmentRequestVariables): MutationRef<CreateAppointmentRequestData, CreateAppointmentRequestVariables>;
  operationName: string;
}
export const createAppointmentRequestRef: CreateAppointmentRequestRef;

export function createAppointmentRequest(vars: CreateAppointmentRequestVariables): MutationPromise<CreateAppointmentRequestData, CreateAppointmentRequestVariables>;
export function createAppointmentRequest(dc: DataConnect, vars: CreateAppointmentRequestVariables): MutationPromise<CreateAppointmentRequestData, CreateAppointmentRequestVariables>;

interface ApproveAppointmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApproveAppointmentVariables): MutationRef<ApproveAppointmentData, ApproveAppointmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ApproveAppointmentVariables): MutationRef<ApproveAppointmentData, ApproveAppointmentVariables>;
  operationName: string;
}
export const approveAppointmentRef: ApproveAppointmentRef;

export function approveAppointment(vars: ApproveAppointmentVariables): MutationPromise<ApproveAppointmentData, ApproveAppointmentVariables>;
export function approveAppointment(dc: DataConnect, vars: ApproveAppointmentVariables): MutationPromise<ApproveAppointmentData, ApproveAppointmentVariables>;

interface RejectAppointmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RejectAppointmentVariables): MutationRef<RejectAppointmentData, RejectAppointmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RejectAppointmentVariables): MutationRef<RejectAppointmentData, RejectAppointmentVariables>;
  operationName: string;
}
export const rejectAppointmentRef: RejectAppointmentRef;

export function rejectAppointment(vars: RejectAppointmentVariables): MutationPromise<RejectAppointmentData, RejectAppointmentVariables>;
export function rejectAppointment(dc: DataConnect, vars: RejectAppointmentVariables): MutationPromise<RejectAppointmentData, RejectAppointmentVariables>;

interface CreateProgramBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProgramBlockVariables): MutationRef<CreateProgramBlockData, CreateProgramBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProgramBlockVariables): MutationRef<CreateProgramBlockData, CreateProgramBlockVariables>;
  operationName: string;
}
export const createProgramBlockRef: CreateProgramBlockRef;

export function createProgramBlock(vars: CreateProgramBlockVariables): MutationPromise<CreateProgramBlockData, CreateProgramBlockVariables>;
export function createProgramBlock(dc: DataConnect, vars: CreateProgramBlockVariables): MutationPromise<CreateProgramBlockData, CreateProgramBlockVariables>;

interface DeleteProgramBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProgramBlockVariables): MutationRef<DeleteProgramBlockData, DeleteProgramBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProgramBlockVariables): MutationRef<DeleteProgramBlockData, DeleteProgramBlockVariables>;
  operationName: string;
}
export const deleteProgramBlockRef: DeleteProgramBlockRef;

export function deleteProgramBlock(vars: DeleteProgramBlockVariables): MutationPromise<DeleteProgramBlockData, DeleteProgramBlockVariables>;
export function deleteProgramBlock(dc: DataConnect, vars: DeleteProgramBlockVariables): MutationPromise<DeleteProgramBlockData, DeleteProgramBlockVariables>;

interface CreateReusableBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReusableBlockVariables): MutationRef<CreateReusableBlockData, CreateReusableBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReusableBlockVariables): MutationRef<CreateReusableBlockData, CreateReusableBlockVariables>;
  operationName: string;
}
export const createReusableBlockRef: CreateReusableBlockRef;

export function createReusableBlock(vars: CreateReusableBlockVariables): MutationPromise<CreateReusableBlockData, CreateReusableBlockVariables>;
export function createReusableBlock(dc: DataConnect, vars: CreateReusableBlockVariables): MutationPromise<CreateReusableBlockData, CreateReusableBlockVariables>;

interface DeleteReusableBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReusableBlockVariables): MutationRef<DeleteReusableBlockData, DeleteReusableBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReusableBlockVariables): MutationRef<DeleteReusableBlockData, DeleteReusableBlockVariables>;
  operationName: string;
}
export const deleteReusableBlockRef: DeleteReusableBlockRef;

export function deleteReusableBlock(vars: DeleteReusableBlockVariables): MutationPromise<DeleteReusableBlockData, DeleteReusableBlockVariables>;
export function deleteReusableBlock(dc: DataConnect, vars: DeleteReusableBlockVariables): MutationPromise<DeleteReusableBlockData, DeleteReusableBlockVariables>;

interface UpdateReusableBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReusableBlockVariables): MutationRef<UpdateReusableBlockData, UpdateReusableBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReusableBlockVariables): MutationRef<UpdateReusableBlockData, UpdateReusableBlockVariables>;
  operationName: string;
}
export const updateReusableBlockRef: UpdateReusableBlockRef;

export function updateReusableBlock(vars: UpdateReusableBlockVariables): MutationPromise<UpdateReusableBlockData, UpdateReusableBlockVariables>;
export function updateReusableBlock(dc: DataConnect, vars: UpdateReusableBlockVariables): MutationPromise<UpdateReusableBlockData, UpdateReusableBlockVariables>;

interface CreatePersonalProgramBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePersonalProgramBlockVariables): MutationRef<CreatePersonalProgramBlockData, CreatePersonalProgramBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePersonalProgramBlockVariables): MutationRef<CreatePersonalProgramBlockData, CreatePersonalProgramBlockVariables>;
  operationName: string;
}
export const createPersonalProgramBlockRef: CreatePersonalProgramBlockRef;

export function createPersonalProgramBlock(vars: CreatePersonalProgramBlockVariables): MutationPromise<CreatePersonalProgramBlockData, CreatePersonalProgramBlockVariables>;
export function createPersonalProgramBlock(dc: DataConnect, vars: CreatePersonalProgramBlockVariables): MutationPromise<CreatePersonalProgramBlockData, CreatePersonalProgramBlockVariables>;

interface DeletePersonalProgramBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePersonalProgramBlockVariables): MutationRef<DeletePersonalProgramBlockData, DeletePersonalProgramBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePersonalProgramBlockVariables): MutationRef<DeletePersonalProgramBlockData, DeletePersonalProgramBlockVariables>;
  operationName: string;
}
export const deletePersonalProgramBlockRef: DeletePersonalProgramBlockRef;

export function deletePersonalProgramBlock(vars: DeletePersonalProgramBlockVariables): MutationPromise<DeletePersonalProgramBlockData, DeletePersonalProgramBlockVariables>;
export function deletePersonalProgramBlock(dc: DataConnect, vars: DeletePersonalProgramBlockVariables): MutationPromise<DeletePersonalProgramBlockData, DeletePersonalProgramBlockVariables>;

interface CreatePersonalReusableBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePersonalReusableBlockVariables): MutationRef<CreatePersonalReusableBlockData, CreatePersonalReusableBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePersonalReusableBlockVariables): MutationRef<CreatePersonalReusableBlockData, CreatePersonalReusableBlockVariables>;
  operationName: string;
}
export const createPersonalReusableBlockRef: CreatePersonalReusableBlockRef;

export function createPersonalReusableBlock(vars: CreatePersonalReusableBlockVariables): MutationPromise<CreatePersonalReusableBlockData, CreatePersonalReusableBlockVariables>;
export function createPersonalReusableBlock(dc: DataConnect, vars: CreatePersonalReusableBlockVariables): MutationPromise<CreatePersonalReusableBlockData, CreatePersonalReusableBlockVariables>;

interface DeletePersonalReusableBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePersonalReusableBlockVariables): MutationRef<DeletePersonalReusableBlockData, DeletePersonalReusableBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePersonalReusableBlockVariables): MutationRef<DeletePersonalReusableBlockData, DeletePersonalReusableBlockVariables>;
  operationName: string;
}
export const deletePersonalReusableBlockRef: DeletePersonalReusableBlockRef;

export function deletePersonalReusableBlock(vars: DeletePersonalReusableBlockVariables): MutationPromise<DeletePersonalReusableBlockData, DeletePersonalReusableBlockVariables>;
export function deletePersonalReusableBlock(dc: DataConnect, vars: DeletePersonalReusableBlockVariables): MutationPromise<DeletePersonalReusableBlockData, DeletePersonalReusableBlockVariables>;

interface UpdatePersonalReusableBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePersonalReusableBlockVariables): MutationRef<UpdatePersonalReusableBlockData, UpdatePersonalReusableBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePersonalReusableBlockVariables): MutationRef<UpdatePersonalReusableBlockData, UpdatePersonalReusableBlockVariables>;
  operationName: string;
}
export const updatePersonalReusableBlockRef: UpdatePersonalReusableBlockRef;

export function updatePersonalReusableBlock(vars: UpdatePersonalReusableBlockVariables): MutationPromise<UpdatePersonalReusableBlockData, UpdatePersonalReusableBlockVariables>;
export function updatePersonalReusableBlock(dc: DataConnect, vars: UpdatePersonalReusableBlockVariables): MutationPromise<UpdatePersonalReusableBlockData, UpdatePersonalReusableBlockVariables>;

interface AssignPersonalProgramBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignPersonalProgramBlockVariables): MutationRef<AssignPersonalProgramBlockData, AssignPersonalProgramBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignPersonalProgramBlockVariables): MutationRef<AssignPersonalProgramBlockData, AssignPersonalProgramBlockVariables>;
  operationName: string;
}
export const assignPersonalProgramBlockRef: AssignPersonalProgramBlockRef;

export function assignPersonalProgramBlock(vars: AssignPersonalProgramBlockVariables): MutationPromise<AssignPersonalProgramBlockData, AssignPersonalProgramBlockVariables>;
export function assignPersonalProgramBlock(dc: DataConnect, vars: AssignPersonalProgramBlockVariables): MutationPromise<AssignPersonalProgramBlockData, AssignPersonalProgramBlockVariables>;

interface AssignPersonalReusableBlockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignPersonalReusableBlockVariables): MutationRef<AssignPersonalReusableBlockData, AssignPersonalReusableBlockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignPersonalReusableBlockVariables): MutationRef<AssignPersonalReusableBlockData, AssignPersonalReusableBlockVariables>;
  operationName: string;
}
export const assignPersonalReusableBlockRef: AssignPersonalReusableBlockRef;

export function assignPersonalReusableBlock(vars: AssignPersonalReusableBlockVariables): MutationPromise<AssignPersonalReusableBlockData, AssignPersonalReusableBlockVariables>;
export function assignPersonalReusableBlock(dc: DataConnect, vars: AssignPersonalReusableBlockVariables): MutationPromise<AssignPersonalReusableBlockData, AssignPersonalReusableBlockVariables>;

interface GetUserContextRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserContextVariables): QueryRef<GetUserContextData, GetUserContextVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserContextVariables): QueryRef<GetUserContextData, GetUserContextVariables>;
  operationName: string;
}
export const getUserContextRef: GetUserContextRef;

export function getUserContext(vars: GetUserContextVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserContextData, GetUserContextVariables>;
export function getUserContext(dc: DataConnect, vars: GetUserContextVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserContextData, GetUserContextVariables>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;
export function getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface ListMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMembersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMembersData, undefined>;
  operationName: string;
}
export const listMembersRef: ListMembersRef;

export function listMembers(options?: ExecuteQueryOptions): QueryPromise<ListMembersData, undefined>;
export function listMembers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMembersData, undefined>;

interface SearchMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchMembersVariables): QueryRef<SearchMembersData, SearchMembersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SearchMembersVariables): QueryRef<SearchMembersData, SearchMembersVariables>;
  operationName: string;
}
export const searchMembersRef: SearchMembersRef;

export function searchMembers(vars: SearchMembersVariables, options?: ExecuteQueryOptions): QueryPromise<SearchMembersData, SearchMembersVariables>;
export function searchMembers(dc: DataConnect, vars: SearchMembersVariables, options?: ExecuteQueryOptions): QueryPromise<SearchMembersData, SearchMembersVariables>;

interface ListFeedPostsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListFeedPostsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListFeedPostsData, undefined>;
  operationName: string;
}
export const listFeedPostsRef: ListFeedPostsRef;

export function listFeedPosts(options?: ExecuteQueryOptions): QueryPromise<ListFeedPostsData, undefined>;
export function listFeedPosts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListFeedPostsData, undefined>;

interface ListEventsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEventsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEventsData, undefined>;
  operationName: string;
}
export const listEventsRef: ListEventsRef;

export function listEvents(options?: ExecuteQueryOptions): QueryPromise<ListEventsData, undefined>;
export function listEvents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEventsData, undefined>;

interface GetEventDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEventDetailsVariables): QueryRef<GetEventDetailsData, GetEventDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEventDetailsVariables): QueryRef<GetEventDetailsData, GetEventDetailsVariables>;
  operationName: string;
}
export const getEventDetailsRef: GetEventDetailsRef;

export function getEventDetails(vars: GetEventDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetEventDetailsData, GetEventDetailsVariables>;
export function getEventDetails(dc: DataConnect, vars: GetEventDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetEventDetailsData, GetEventDetailsVariables>;

interface ListBaptismsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBaptismsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListBaptismsData, undefined>;
  operationName: string;
}
export const listBaptismsRef: ListBaptismsRef;

export function listBaptisms(options?: ExecuteQueryOptions): QueryPromise<ListBaptismsData, undefined>;
export function listBaptisms(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBaptismsData, undefined>;

interface ListPendingAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPendingAppointmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPendingAppointmentsData, undefined>;
  operationName: string;
}
export const listPendingAppointmentsRef: ListPendingAppointmentsRef;

export function listPendingAppointments(options?: ExecuteQueryOptions): QueryPromise<ListPendingAppointmentsData, undefined>;
export function listPendingAppointments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPendingAppointmentsData, undefined>;

interface ListApprovedAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListApprovedAppointmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListApprovedAppointmentsData, undefined>;
  operationName: string;
}
export const listApprovedAppointmentsRef: ListApprovedAppointmentsRef;

export function listApprovedAppointments(options?: ExecuteQueryOptions): QueryPromise<ListApprovedAppointmentsData, undefined>;
export function listApprovedAppointments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListApprovedAppointmentsData, undefined>;

interface ListRejectedAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRejectedAppointmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListRejectedAppointmentsData, undefined>;
  operationName: string;
}
export const listRejectedAppointmentsRef: ListRejectedAppointmentsRef;

export function listRejectedAppointments(options?: ExecuteQueryOptions): QueryPromise<ListRejectedAppointmentsData, undefined>;
export function listRejectedAppointments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRejectedAppointmentsData, undefined>;

interface ListProgramBlocksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProgramBlocksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProgramBlocksData, undefined>;
  operationName: string;
}
export const listProgramBlocksRef: ListProgramBlocksRef;

export function listProgramBlocks(options?: ExecuteQueryOptions): QueryPromise<ListProgramBlocksData, undefined>;
export function listProgramBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProgramBlocksData, undefined>;

interface ListReusableBlocksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListReusableBlocksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListReusableBlocksData, undefined>;
  operationName: string;
}
export const listReusableBlocksRef: ListReusableBlocksRef;

export function listReusableBlocks(options?: ExecuteQueryOptions): QueryPromise<ListReusableBlocksData, undefined>;
export function listReusableBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListReusableBlocksData, undefined>;

interface ListPersonalProgramBlocksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPersonalProgramBlocksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPersonalProgramBlocksData, undefined>;
  operationName: string;
}
export const listPersonalProgramBlocksRef: ListPersonalProgramBlocksRef;

export function listPersonalProgramBlocks(options?: ExecuteQueryOptions): QueryPromise<ListPersonalProgramBlocksData, undefined>;
export function listPersonalProgramBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPersonalProgramBlocksData, undefined>;

interface ListPersonalReusableBlocksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPersonalReusableBlocksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPersonalReusableBlocksData, undefined>;
  operationName: string;
}
export const listPersonalReusableBlocksRef: ListPersonalReusableBlocksRef;

export function listPersonalReusableBlocks(options?: ExecuteQueryOptions): QueryPromise<ListPersonalReusableBlocksData, undefined>;
export function listPersonalReusableBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPersonalReusableBlocksData, undefined>;

interface ListAssignedPersonalProgramBlocksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAssignedPersonalProgramBlocksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAssignedPersonalProgramBlocksData, undefined>;
  operationName: string;
}
export const listAssignedPersonalProgramBlocksRef: ListAssignedPersonalProgramBlocksRef;

export function listAssignedPersonalProgramBlocks(options?: ExecuteQueryOptions): QueryPromise<ListAssignedPersonalProgramBlocksData, undefined>;
export function listAssignedPersonalProgramBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAssignedPersonalProgramBlocksData, undefined>;

interface ListAssignedPersonalReusableBlocksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAssignedPersonalReusableBlocksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAssignedPersonalReusableBlocksData, undefined>;
  operationName: string;
}
export const listAssignedPersonalReusableBlocksRef: ListAssignedPersonalReusableBlocksRef;

export function listAssignedPersonalReusableBlocks(options?: ExecuteQueryOptions): QueryPromise<ListAssignedPersonalReusableBlocksData, undefined>;
export function listAssignedPersonalReusableBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAssignedPersonalReusableBlocksData, undefined>;

