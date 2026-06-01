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
  date: string;
  time: string;
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
    dept?: string | null;
    position?: string | null;
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
    dept?: string | null;
    position?: string | null;
    bio?: string | null;
    profilePhoto?: string | null;
    joined?: string | null;
    lastActive?: string | null;
    status?: string | null;
    recentActivity?: string | null;
    interests?: string[] | null;
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
    date: string;
    time: string;
    reason: string;
    type: string;
    status: string;
    createdAt: TimestampString;
    approvedBy?: string | null;
    decidedAt?: TimestampString | null;
  } & AppointmentRequest_Key)[];
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
    dept?: string | null;
    position?: string | null;
    bio?: string | null;
    profilePhoto?: string | null;
    joined?: string | null;
    lastActive?: string | null;
    status?: string | null;
    recentActivity?: string | null;
    interests?: string[] | null;
  } & User_Key)[];
}

export interface ListPendingAppointmentsData {
  appointmentRequests: ({
    id: UUIDString;
    requester: string;
    requesterEmail: string;
    staff: string;
    date: string;
    time: string;
    reason: string;
    type: string;
    status: string;
    createdAt: TimestampString;
  } & AppointmentRequest_Key)[];
}

export interface ListRejectedAppointmentsData {
  appointmentRequests: ({
    id: UUIDString;
    requester: string;
    requesterEmail: string;
    staff: string;
    date: string;
    time: string;
    reason: string;
    type: string;
    status: string;
    createdAt: TimestampString;
    rejectedBy?: string | null;
    rejectionReason?: string | null;
    decidedAt?: TimestampString | null;
  } & AppointmentRequest_Key)[];
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

export interface SearchMembersData {
  users: ({
    uid: string;
    email: string;
    first: string;
    last: string;
    zip?: string | null;
    city?: string | null;
    court?: string | null;
    dept?: string | null;
    position?: string | null;
    bio?: string | null;
    profilePhoto?: string | null;
    joined?: string | null;
    lastActive?: string | null;
    status?: string | null;
    recentActivity?: string | null;
    interests?: string[] | null;
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
  dept?: string | null;
  position?: string | null;
  bio?: string | null;
  profilePhoto?: string | null;
  joined?: string | null;
  lastActive?: string | null;
  status?: string | null;
  recentActivity?: string | null;
  interests?: string[] | null;
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

