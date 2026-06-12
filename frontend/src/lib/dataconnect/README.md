# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserContext*](#getusercontext)
  - [*GetUserProfile*](#getuserprofile)
  - [*ListMembers*](#listmembers)
  - [*SearchMembers*](#searchmembers)
  - [*ListFeedPosts*](#listfeedposts)
  - [*ListEvents*](#listevents)
  - [*GetEventDetails*](#geteventdetails)
  - [*ListBaptisms*](#listbaptisms)
  - [*ListPendingAppointments*](#listpendingappointments)
  - [*ListApprovedAppointments*](#listapprovedappointments)
  - [*ListRejectedAppointments*](#listrejectedappointments)
  - [*ListProgramBlocks*](#listprogramblocks)
  - [*ListReusableBlocks*](#listreusableblocks)
  - [*ListPersonalProgramBlocks*](#listpersonalprogramblocks)
  - [*ListPersonalReusableBlocks*](#listpersonalreusableblocks)
  - [*ListAssignedPersonalProgramBlocks*](#listassignedpersonalprogramblocks)
  - [*ListAssignedPersonalReusableBlocks*](#listassignedpersonalreusableblocks)
- [**Mutations**](#mutations)
  - [*UpsertUserProfile*](#upsertuserprofile)
  - [*CreateAnnouncement*](#createannouncement)
  - [*CreateEvent*](#createevent)
  - [*RegisterForEvent*](#registerforevent)
  - [*CancelEventRegistration*](#canceleventregistration)
  - [*CreateBaptism*](#createbaptism)
  - [*RegisterForBaptism*](#registerforbaptism)
  - [*CancelBaptismRegistration*](#cancelbaptismregistration)
  - [*DeleteEvent*](#deleteevent)
  - [*DeleteBaptismEvent*](#deletebaptismevent)
  - [*UpdateEvent*](#updateevent)
  - [*CreateAppointmentRequest*](#createappointmentrequest)
  - [*ApproveAppointment*](#approveappointment)
  - [*RejectAppointment*](#rejectappointment)
  - [*CreateProgramBlock*](#createprogramblock)
  - [*DeleteProgramBlock*](#deleteprogramblock)
  - [*CreateReusableBlock*](#createreusableblock)
  - [*DeleteReusableBlock*](#deletereusableblock)
  - [*UpdateReusableBlock*](#updatereusableblock)
  - [*CreatePersonalProgramBlock*](#createpersonalprogramblock)
  - [*DeletePersonalProgramBlock*](#deletepersonalprogramblock)
  - [*CreatePersonalReusableBlock*](#createpersonalreusableblock)
  - [*DeletePersonalReusableBlock*](#deletepersonalreusableblock)
  - [*UpdatePersonalReusableBlock*](#updatepersonalreusableblock)
  - [*AssignPersonalProgramBlock*](#assignpersonalprogramblock)
  - [*AssignPersonalReusableBlock*](#assignpersonalreusableblock)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@church-central/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@church-central/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@church-central/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserContext
You can execute the `GetUserContext` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserContext(vars: GetUserContextVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserContextData, GetUserContextVariables>;

interface GetUserContextRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserContextVariables): QueryRef<GetUserContextData, GetUserContextVariables>;
}
export const getUserContextRef: GetUserContextRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserContext(dc: DataConnect, vars: GetUserContextVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserContextData, GetUserContextVariables>;

interface GetUserContextRef {
  ...
  (dc: DataConnect, vars: GetUserContextVariables): QueryRef<GetUserContextData, GetUserContextVariables>;
}
export const getUserContextRef: GetUserContextRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserContextRef:
```typescript
const name = getUserContextRef.operationName;
console.log(name);
```

### Variables
The `GetUserContext` query requires an argument of type `GetUserContextVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserContextVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetUserContext` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserContextData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserContext`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserContext, GetUserContextVariables } from '@church-central/dataconnect';

// The `GetUserContext` query requires an argument of type `GetUserContextVariables`:
const getUserContextVars: GetUserContextVariables = {
  uid: ..., 
};

// Call the `getUserContext()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserContext(getUserContextVars);
// Variables can be defined inline as well.
const { data } = await getUserContext({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserContext(dataConnect, getUserContextVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserContext(getUserContextVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserContext`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserContextRef, GetUserContextVariables } from '@church-central/dataconnect';

// The `GetUserContext` query requires an argument of type `GetUserContextVariables`:
const getUserContextVars: GetUserContextVariables = {
  uid: ..., 
};

// Call the `getUserContextRef()` function to get a reference to the query.
const ref = getUserContextRef(getUserContextVars);
// Variables can be defined inline as well.
const ref = getUserContextRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserContextRef(dataConnect, getUserContextVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserProfileVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile, GetUserProfileVariables } from '@church-central/dataconnect';

// The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  uid: ..., 
};

// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile(getUserProfileVars);
// Variables can be defined inline as well.
const { data } = await getUserProfile({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect, getUserProfileVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserProfile(getUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef, GetUserProfileVariables } from '@church-central/dataconnect';

// The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  uid: ..., 
};

// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef(getUserProfileVars);
// Variables can be defined inline as well.
const ref = getUserProfileRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect, getUserProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListMembers
You can execute the `ListMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMembers(options?: ExecuteQueryOptions): QueryPromise<ListMembersData, undefined>;

interface ListMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMembersData, undefined>;
}
export const listMembersRef: ListMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMembers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMembersData, undefined>;

interface ListMembersRef {
  ...
  (dc: DataConnect): QueryRef<ListMembersData, undefined>;
}
export const listMembersRef: ListMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMembersRef:
```typescript
const name = listMembersRef.operationName;
console.log(name);
```

### Variables
The `ListMembers` query has no variables.
### Return Type
Recall that executing the `ListMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMembersData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMembers } from '@church-central/dataconnect';


// Call the `listMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMembers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMembers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listMembers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMembersRef } from '@church-central/dataconnect';


// Call the `listMembersRef()` function to get a reference to the query.
const ref = listMembersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMembersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## SearchMembers
You can execute the `SearchMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
searchMembers(vars: SearchMembersVariables, options?: ExecuteQueryOptions): QueryPromise<SearchMembersData, SearchMembersVariables>;

interface SearchMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchMembersVariables): QueryRef<SearchMembersData, SearchMembersVariables>;
}
export const searchMembersRef: SearchMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchMembers(dc: DataConnect, vars: SearchMembersVariables, options?: ExecuteQueryOptions): QueryPromise<SearchMembersData, SearchMembersVariables>;

interface SearchMembersRef {
  ...
  (dc: DataConnect, vars: SearchMembersVariables): QueryRef<SearchMembersData, SearchMembersVariables>;
}
export const searchMembersRef: SearchMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchMembersRef:
```typescript
const name = searchMembersRef.operationName;
console.log(name);
```

### Variables
The `SearchMembers` query requires an argument of type `SearchMembersVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchMembersVariables {
  query: string;
}
```
### Return Type
Recall that executing the `SearchMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchMembersData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `SearchMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchMembers, SearchMembersVariables } from '@church-central/dataconnect';

// The `SearchMembers` query requires an argument of type `SearchMembersVariables`:
const searchMembersVars: SearchMembersVariables = {
  query: ..., 
};

// Call the `searchMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchMembers(searchMembersVars);
// Variables can be defined inline as well.
const { data } = await searchMembers({ query: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchMembers(dataConnect, searchMembersVars);

console.log(data.users);

// Or, you can use the `Promise` API.
searchMembers(searchMembersVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `SearchMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchMembersRef, SearchMembersVariables } from '@church-central/dataconnect';

// The `SearchMembers` query requires an argument of type `SearchMembersVariables`:
const searchMembersVars: SearchMembersVariables = {
  query: ..., 
};

// Call the `searchMembersRef()` function to get a reference to the query.
const ref = searchMembersRef(searchMembersVars);
// Variables can be defined inline as well.
const ref = searchMembersRef({ query: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchMembersRef(dataConnect, searchMembersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## ListFeedPosts
You can execute the `ListFeedPosts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listFeedPosts(options?: ExecuteQueryOptions): QueryPromise<ListFeedPostsData, undefined>;

interface ListFeedPostsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListFeedPostsData, undefined>;
}
export const listFeedPostsRef: ListFeedPostsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFeedPosts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListFeedPostsData, undefined>;

interface ListFeedPostsRef {
  ...
  (dc: DataConnect): QueryRef<ListFeedPostsData, undefined>;
}
export const listFeedPostsRef: ListFeedPostsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFeedPostsRef:
```typescript
const name = listFeedPostsRef.operationName;
console.log(name);
```

### Variables
The `ListFeedPosts` query has no variables.
### Return Type
Recall that executing the `ListFeedPosts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFeedPostsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListFeedPosts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFeedPosts } from '@church-central/dataconnect';


// Call the `listFeedPosts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFeedPosts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFeedPosts(dataConnect);

console.log(data.announcements);

// Or, you can use the `Promise` API.
listFeedPosts().then((response) => {
  const data = response.data;
  console.log(data.announcements);
});
```

### Using `ListFeedPosts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFeedPostsRef } from '@church-central/dataconnect';


// Call the `listFeedPostsRef()` function to get a reference to the query.
const ref = listFeedPostsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFeedPostsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.announcements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.announcements);
});
```

## ListEvents
You can execute the `ListEvents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listEvents(options?: ExecuteQueryOptions): QueryPromise<ListEventsData, undefined>;

interface ListEventsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEventsData, undefined>;
}
export const listEventsRef: ListEventsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEvents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEventsData, undefined>;

interface ListEventsRef {
  ...
  (dc: DataConnect): QueryRef<ListEventsData, undefined>;
}
export const listEventsRef: ListEventsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEventsRef:
```typescript
const name = listEventsRef.operationName;
console.log(name);
```

### Variables
The `ListEvents` query has no variables.
### Return Type
Recall that executing the `ListEvents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEventsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListEvents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEvents } from '@church-central/dataconnect';


// Call the `listEvents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEvents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEvents(dataConnect);

console.log(data.events);

// Or, you can use the `Promise` API.
listEvents().then((response) => {
  const data = response.data;
  console.log(data.events);
});
```

### Using `ListEvents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEventsRef } from '@church-central/dataconnect';


// Call the `listEventsRef()` function to get a reference to the query.
const ref = listEventsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEventsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.events);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.events);
});
```

## GetEventDetails
You can execute the `GetEventDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getEventDetails(vars: GetEventDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetEventDetailsData, GetEventDetailsVariables>;

interface GetEventDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEventDetailsVariables): QueryRef<GetEventDetailsData, GetEventDetailsVariables>;
}
export const getEventDetailsRef: GetEventDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEventDetails(dc: DataConnect, vars: GetEventDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetEventDetailsData, GetEventDetailsVariables>;

interface GetEventDetailsRef {
  ...
  (dc: DataConnect, vars: GetEventDetailsVariables): QueryRef<GetEventDetailsData, GetEventDetailsVariables>;
}
export const getEventDetailsRef: GetEventDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEventDetailsRef:
```typescript
const name = getEventDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetEventDetails` query requires an argument of type `GetEventDetailsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEventDetailsVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetEventDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEventDetailsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetEventDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEventDetails, GetEventDetailsVariables } from '@church-central/dataconnect';

// The `GetEventDetails` query requires an argument of type `GetEventDetailsVariables`:
const getEventDetailsVars: GetEventDetailsVariables = {
  id: ..., 
};

// Call the `getEventDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEventDetails(getEventDetailsVars);
// Variables can be defined inline as well.
const { data } = await getEventDetails({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEventDetails(dataConnect, getEventDetailsVars);

console.log(data.event);

// Or, you can use the `Promise` API.
getEventDetails(getEventDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.event);
});
```

### Using `GetEventDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEventDetailsRef, GetEventDetailsVariables } from '@church-central/dataconnect';

// The `GetEventDetails` query requires an argument of type `GetEventDetailsVariables`:
const getEventDetailsVars: GetEventDetailsVariables = {
  id: ..., 
};

// Call the `getEventDetailsRef()` function to get a reference to the query.
const ref = getEventDetailsRef(getEventDetailsVars);
// Variables can be defined inline as well.
const ref = getEventDetailsRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEventDetailsRef(dataConnect, getEventDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.event);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.event);
});
```

## ListBaptisms
You can execute the `ListBaptisms` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listBaptisms(options?: ExecuteQueryOptions): QueryPromise<ListBaptismsData, undefined>;

interface ListBaptismsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBaptismsData, undefined>;
}
export const listBaptismsRef: ListBaptismsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBaptisms(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBaptismsData, undefined>;

interface ListBaptismsRef {
  ...
  (dc: DataConnect): QueryRef<ListBaptismsData, undefined>;
}
export const listBaptismsRef: ListBaptismsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBaptismsRef:
```typescript
const name = listBaptismsRef.operationName;
console.log(name);
```

### Variables
The `ListBaptisms` query has no variables.
### Return Type
Recall that executing the `ListBaptisms` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBaptismsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListBaptisms`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBaptisms } from '@church-central/dataconnect';


// Call the `listBaptisms()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBaptisms();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBaptisms(dataConnect);

console.log(data.baptismEvents);

// Or, you can use the `Promise` API.
listBaptisms().then((response) => {
  const data = response.data;
  console.log(data.baptismEvents);
});
```

### Using `ListBaptisms`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBaptismsRef } from '@church-central/dataconnect';


// Call the `listBaptismsRef()` function to get a reference to the query.
const ref = listBaptismsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBaptismsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.baptismEvents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.baptismEvents);
});
```

## ListPendingAppointments
You can execute the `ListPendingAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listPendingAppointments(options?: ExecuteQueryOptions): QueryPromise<ListPendingAppointmentsData, undefined>;

interface ListPendingAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPendingAppointmentsData, undefined>;
}
export const listPendingAppointmentsRef: ListPendingAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPendingAppointments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPendingAppointmentsData, undefined>;

interface ListPendingAppointmentsRef {
  ...
  (dc: DataConnect): QueryRef<ListPendingAppointmentsData, undefined>;
}
export const listPendingAppointmentsRef: ListPendingAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPendingAppointmentsRef:
```typescript
const name = listPendingAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `ListPendingAppointments` query has no variables.
### Return Type
Recall that executing the `ListPendingAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPendingAppointmentsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListPendingAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPendingAppointments } from '@church-central/dataconnect';


// Call the `listPendingAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPendingAppointments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPendingAppointments(dataConnect);

console.log(data.appointmentRequests);

// Or, you can use the `Promise` API.
listPendingAppointments().then((response) => {
  const data = response.data;
  console.log(data.appointmentRequests);
});
```

### Using `ListPendingAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPendingAppointmentsRef } from '@church-central/dataconnect';


// Call the `listPendingAppointmentsRef()` function to get a reference to the query.
const ref = listPendingAppointmentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPendingAppointmentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointmentRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequests);
});
```

## ListApprovedAppointments
You can execute the `ListApprovedAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listApprovedAppointments(options?: ExecuteQueryOptions): QueryPromise<ListApprovedAppointmentsData, undefined>;

interface ListApprovedAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListApprovedAppointmentsData, undefined>;
}
export const listApprovedAppointmentsRef: ListApprovedAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listApprovedAppointments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListApprovedAppointmentsData, undefined>;

interface ListApprovedAppointmentsRef {
  ...
  (dc: DataConnect): QueryRef<ListApprovedAppointmentsData, undefined>;
}
export const listApprovedAppointmentsRef: ListApprovedAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listApprovedAppointmentsRef:
```typescript
const name = listApprovedAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `ListApprovedAppointments` query has no variables.
### Return Type
Recall that executing the `ListApprovedAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListApprovedAppointmentsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListApprovedAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listApprovedAppointments } from '@church-central/dataconnect';


// Call the `listApprovedAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listApprovedAppointments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listApprovedAppointments(dataConnect);

console.log(data.appointmentRequests);

// Or, you can use the `Promise` API.
listApprovedAppointments().then((response) => {
  const data = response.data;
  console.log(data.appointmentRequests);
});
```

### Using `ListApprovedAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listApprovedAppointmentsRef } from '@church-central/dataconnect';


// Call the `listApprovedAppointmentsRef()` function to get a reference to the query.
const ref = listApprovedAppointmentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listApprovedAppointmentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointmentRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequests);
});
```

## ListRejectedAppointments
You can execute the `ListRejectedAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listRejectedAppointments(options?: ExecuteQueryOptions): QueryPromise<ListRejectedAppointmentsData, undefined>;

interface ListRejectedAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRejectedAppointmentsData, undefined>;
}
export const listRejectedAppointmentsRef: ListRejectedAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listRejectedAppointments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRejectedAppointmentsData, undefined>;

interface ListRejectedAppointmentsRef {
  ...
  (dc: DataConnect): QueryRef<ListRejectedAppointmentsData, undefined>;
}
export const listRejectedAppointmentsRef: ListRejectedAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listRejectedAppointmentsRef:
```typescript
const name = listRejectedAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `ListRejectedAppointments` query has no variables.
### Return Type
Recall that executing the `ListRejectedAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListRejectedAppointmentsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListRejectedAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listRejectedAppointments } from '@church-central/dataconnect';


// Call the `listRejectedAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listRejectedAppointments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listRejectedAppointments(dataConnect);

console.log(data.appointmentRequests);

// Or, you can use the `Promise` API.
listRejectedAppointments().then((response) => {
  const data = response.data;
  console.log(data.appointmentRequests);
});
```

### Using `ListRejectedAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listRejectedAppointmentsRef } from '@church-central/dataconnect';


// Call the `listRejectedAppointmentsRef()` function to get a reference to the query.
const ref = listRejectedAppointmentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listRejectedAppointmentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointmentRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequests);
});
```

## ListProgramBlocks
You can execute the `ListProgramBlocks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listProgramBlocks(options?: ExecuteQueryOptions): QueryPromise<ListProgramBlocksData, undefined>;

interface ListProgramBlocksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProgramBlocksData, undefined>;
}
export const listProgramBlocksRef: ListProgramBlocksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProgramBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProgramBlocksData, undefined>;

interface ListProgramBlocksRef {
  ...
  (dc: DataConnect): QueryRef<ListProgramBlocksData, undefined>;
}
export const listProgramBlocksRef: ListProgramBlocksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProgramBlocksRef:
```typescript
const name = listProgramBlocksRef.operationName;
console.log(name);
```

### Variables
The `ListProgramBlocks` query has no variables.
### Return Type
Recall that executing the `ListProgramBlocks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProgramBlocksData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProgramBlocksData {
  programBlocks: ({
    id: UUIDString;
    date: string;
    time: string;
    title: string;
    minister: string;
  } & ProgramBlock_Key)[];
}
```
### Using `ListProgramBlocks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProgramBlocks } from '@church-central/dataconnect';


// Call the `listProgramBlocks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProgramBlocks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProgramBlocks(dataConnect);

console.log(data.programBlocks);

// Or, you can use the `Promise` API.
listProgramBlocks().then((response) => {
  const data = response.data;
  console.log(data.programBlocks);
});
```

### Using `ListProgramBlocks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProgramBlocksRef } from '@church-central/dataconnect';


// Call the `listProgramBlocksRef()` function to get a reference to the query.
const ref = listProgramBlocksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProgramBlocksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.programBlocks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.programBlocks);
});
```

## ListReusableBlocks
You can execute the `ListReusableBlocks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listReusableBlocks(options?: ExecuteQueryOptions): QueryPromise<ListReusableBlocksData, undefined>;

interface ListReusableBlocksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListReusableBlocksData, undefined>;
}
export const listReusableBlocksRef: ListReusableBlocksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReusableBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListReusableBlocksData, undefined>;

interface ListReusableBlocksRef {
  ...
  (dc: DataConnect): QueryRef<ListReusableBlocksData, undefined>;
}
export const listReusableBlocksRef: ListReusableBlocksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReusableBlocksRef:
```typescript
const name = listReusableBlocksRef.operationName;
console.log(name);
```

### Variables
The `ListReusableBlocks` query has no variables.
### Return Type
Recall that executing the `ListReusableBlocks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReusableBlocksData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListReusableBlocksData {
  reusableBlocks: ({
    id: UUIDString;
    title: string;
    minister: string;
    time: string;
  } & ReusableBlock_Key)[];
}
```
### Using `ListReusableBlocks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReusableBlocks } from '@church-central/dataconnect';


// Call the `listReusableBlocks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReusableBlocks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReusableBlocks(dataConnect);

console.log(data.reusableBlocks);

// Or, you can use the `Promise` API.
listReusableBlocks().then((response) => {
  const data = response.data;
  console.log(data.reusableBlocks);
});
```

### Using `ListReusableBlocks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReusableBlocksRef } from '@church-central/dataconnect';


// Call the `listReusableBlocksRef()` function to get a reference to the query.
const ref = listReusableBlocksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReusableBlocksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reusableBlocks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reusableBlocks);
});
```

## ListPersonalProgramBlocks
You can execute the `ListPersonalProgramBlocks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listPersonalProgramBlocks(options?: ExecuteQueryOptions): QueryPromise<ListPersonalProgramBlocksData, undefined>;

interface ListPersonalProgramBlocksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPersonalProgramBlocksData, undefined>;
}
export const listPersonalProgramBlocksRef: ListPersonalProgramBlocksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPersonalProgramBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPersonalProgramBlocksData, undefined>;

interface ListPersonalProgramBlocksRef {
  ...
  (dc: DataConnect): QueryRef<ListPersonalProgramBlocksData, undefined>;
}
export const listPersonalProgramBlocksRef: ListPersonalProgramBlocksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPersonalProgramBlocksRef:
```typescript
const name = listPersonalProgramBlocksRef.operationName;
console.log(name);
```

### Variables
The `ListPersonalProgramBlocks` query has no variables.
### Return Type
Recall that executing the `ListPersonalProgramBlocks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPersonalProgramBlocksData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListPersonalProgramBlocks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPersonalProgramBlocks } from '@church-central/dataconnect';


// Call the `listPersonalProgramBlocks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPersonalProgramBlocks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPersonalProgramBlocks(dataConnect);

console.log(data.personalProgramBlocks);

// Or, you can use the `Promise` API.
listPersonalProgramBlocks().then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlocks);
});
```

### Using `ListPersonalProgramBlocks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPersonalProgramBlocksRef } from '@church-central/dataconnect';


// Call the `listPersonalProgramBlocksRef()` function to get a reference to the query.
const ref = listPersonalProgramBlocksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPersonalProgramBlocksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.personalProgramBlocks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlocks);
});
```

## ListPersonalReusableBlocks
You can execute the `ListPersonalReusableBlocks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listPersonalReusableBlocks(options?: ExecuteQueryOptions): QueryPromise<ListPersonalReusableBlocksData, undefined>;

interface ListPersonalReusableBlocksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPersonalReusableBlocksData, undefined>;
}
export const listPersonalReusableBlocksRef: ListPersonalReusableBlocksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPersonalReusableBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPersonalReusableBlocksData, undefined>;

interface ListPersonalReusableBlocksRef {
  ...
  (dc: DataConnect): QueryRef<ListPersonalReusableBlocksData, undefined>;
}
export const listPersonalReusableBlocksRef: ListPersonalReusableBlocksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPersonalReusableBlocksRef:
```typescript
const name = listPersonalReusableBlocksRef.operationName;
console.log(name);
```

### Variables
The `ListPersonalReusableBlocks` query has no variables.
### Return Type
Recall that executing the `ListPersonalReusableBlocks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPersonalReusableBlocksData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListPersonalReusableBlocks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPersonalReusableBlocks } from '@church-central/dataconnect';


// Call the `listPersonalReusableBlocks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPersonalReusableBlocks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPersonalReusableBlocks(dataConnect);

console.log(data.personalReusableBlocks);

// Or, you can use the `Promise` API.
listPersonalReusableBlocks().then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlocks);
});
```

### Using `ListPersonalReusableBlocks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPersonalReusableBlocksRef } from '@church-central/dataconnect';


// Call the `listPersonalReusableBlocksRef()` function to get a reference to the query.
const ref = listPersonalReusableBlocksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPersonalReusableBlocksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.personalReusableBlocks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlocks);
});
```

## ListAssignedPersonalProgramBlocks
You can execute the `ListAssignedPersonalProgramBlocks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listAssignedPersonalProgramBlocks(options?: ExecuteQueryOptions): QueryPromise<ListAssignedPersonalProgramBlocksData, undefined>;

interface ListAssignedPersonalProgramBlocksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAssignedPersonalProgramBlocksData, undefined>;
}
export const listAssignedPersonalProgramBlocksRef: ListAssignedPersonalProgramBlocksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAssignedPersonalProgramBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAssignedPersonalProgramBlocksData, undefined>;

interface ListAssignedPersonalProgramBlocksRef {
  ...
  (dc: DataConnect): QueryRef<ListAssignedPersonalProgramBlocksData, undefined>;
}
export const listAssignedPersonalProgramBlocksRef: ListAssignedPersonalProgramBlocksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAssignedPersonalProgramBlocksRef:
```typescript
const name = listAssignedPersonalProgramBlocksRef.operationName;
console.log(name);
```

### Variables
The `ListAssignedPersonalProgramBlocks` query has no variables.
### Return Type
Recall that executing the `ListAssignedPersonalProgramBlocks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAssignedPersonalProgramBlocksData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAssignedPersonalProgramBlocks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAssignedPersonalProgramBlocks } from '@church-central/dataconnect';


// Call the `listAssignedPersonalProgramBlocks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAssignedPersonalProgramBlocks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAssignedPersonalProgramBlocks(dataConnect);

console.log(data.personalProgramBlocks);

// Or, you can use the `Promise` API.
listAssignedPersonalProgramBlocks().then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlocks);
});
```

### Using `ListAssignedPersonalProgramBlocks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAssignedPersonalProgramBlocksRef } from '@church-central/dataconnect';


// Call the `listAssignedPersonalProgramBlocksRef()` function to get a reference to the query.
const ref = listAssignedPersonalProgramBlocksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAssignedPersonalProgramBlocksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.personalProgramBlocks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlocks);
});
```

## ListAssignedPersonalReusableBlocks
You can execute the `ListAssignedPersonalReusableBlocks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listAssignedPersonalReusableBlocks(options?: ExecuteQueryOptions): QueryPromise<ListAssignedPersonalReusableBlocksData, undefined>;

interface ListAssignedPersonalReusableBlocksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAssignedPersonalReusableBlocksData, undefined>;
}
export const listAssignedPersonalReusableBlocksRef: ListAssignedPersonalReusableBlocksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAssignedPersonalReusableBlocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAssignedPersonalReusableBlocksData, undefined>;

interface ListAssignedPersonalReusableBlocksRef {
  ...
  (dc: DataConnect): QueryRef<ListAssignedPersonalReusableBlocksData, undefined>;
}
export const listAssignedPersonalReusableBlocksRef: ListAssignedPersonalReusableBlocksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAssignedPersonalReusableBlocksRef:
```typescript
const name = listAssignedPersonalReusableBlocksRef.operationName;
console.log(name);
```

### Variables
The `ListAssignedPersonalReusableBlocks` query has no variables.
### Return Type
Recall that executing the `ListAssignedPersonalReusableBlocks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAssignedPersonalReusableBlocksData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAssignedPersonalReusableBlocks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAssignedPersonalReusableBlocks } from '@church-central/dataconnect';


// Call the `listAssignedPersonalReusableBlocks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAssignedPersonalReusableBlocks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAssignedPersonalReusableBlocks(dataConnect);

console.log(data.personalReusableBlocks);

// Or, you can use the `Promise` API.
listAssignedPersonalReusableBlocks().then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlocks);
});
```

### Using `ListAssignedPersonalReusableBlocks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAssignedPersonalReusableBlocksRef } from '@church-central/dataconnect';


// Call the `listAssignedPersonalReusableBlocksRef()` function to get a reference to the query.
const ref = listAssignedPersonalReusableBlocksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAssignedPersonalReusableBlocksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.personalReusableBlocks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlocks);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUserProfile
You can execute the `UpsertUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  (dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserProfileRef:
```typescript
const name = upsertUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserProfileData {
  user_upsert: User_Key;
}
```
### Using `UpsertUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfile, UpsertUserProfileVariables } from '@church-central/dataconnect';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  uid: ..., 
  email: ..., 
  first: ..., 
  last: ..., 
  zip: ..., // optional
  city: ..., // optional
  court: ..., // optional
  courts: ..., // optional
  dept: ..., // optional
  depts: ..., // optional
  district: ..., // optional
  gender: ..., // optional
  schoolClass: ..., // optional
  position: ..., // optional
  bio: ..., // optional
  profilePhoto: ..., // optional
  joined: ..., // optional
  lastActive: ..., // optional
  status: ..., // optional
  recentActivity: ..., // optional
  interests: ..., // optional
  paUid: ..., // optional
  authorizedPostAsChurch: ..., // optional
  authorizedPostAsDept: ..., // optional
  authorizedPostAsCourt: ..., // optional
  authorizedCreateProgram: ..., // optional
};

// Call the `upsertUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserProfile(upsertUserProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertUserProfile({ uid: ..., email: ..., first: ..., last: ..., zip: ..., city: ..., court: ..., courts: ..., dept: ..., depts: ..., district: ..., gender: ..., schoolClass: ..., position: ..., bio: ..., profilePhoto: ..., joined: ..., lastActive: ..., status: ..., recentActivity: ..., interests: ..., paUid: ..., authorizedPostAsChurch: ..., authorizedPostAsDept: ..., authorizedPostAsCourt: ..., authorizedCreateProgram: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserProfile(dataConnect, upsertUserProfileVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUserProfile(upsertUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfileRef, UpsertUserProfileVariables } from '@church-central/dataconnect';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  uid: ..., 
  email: ..., 
  first: ..., 
  last: ..., 
  zip: ..., // optional
  city: ..., // optional
  court: ..., // optional
  courts: ..., // optional
  dept: ..., // optional
  depts: ..., // optional
  district: ..., // optional
  gender: ..., // optional
  schoolClass: ..., // optional
  position: ..., // optional
  bio: ..., // optional
  profilePhoto: ..., // optional
  joined: ..., // optional
  lastActive: ..., // optional
  status: ..., // optional
  recentActivity: ..., // optional
  interests: ..., // optional
  paUid: ..., // optional
  authorizedPostAsChurch: ..., // optional
  authorizedPostAsDept: ..., // optional
  authorizedPostAsCourt: ..., // optional
  authorizedCreateProgram: ..., // optional
};

// Call the `upsertUserProfileRef()` function to get a reference to the mutation.
const ref = upsertUserProfileRef(upsertUserProfileVars);
// Variables can be defined inline as well.
const ref = upsertUserProfileRef({ uid: ..., email: ..., first: ..., last: ..., zip: ..., city: ..., court: ..., courts: ..., dept: ..., depts: ..., district: ..., gender: ..., schoolClass: ..., position: ..., bio: ..., profilePhoto: ..., joined: ..., lastActive: ..., status: ..., recentActivity: ..., interests: ..., paUid: ..., authorizedPostAsChurch: ..., authorizedPostAsDept: ..., authorizedPostAsCourt: ..., authorizedCreateProgram: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserProfileRef(dataConnect, upsertUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateAnnouncement
You can execute the `CreateAnnouncement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createAnnouncement(vars: CreateAnnouncementVariables): MutationPromise<CreateAnnouncementData, CreateAnnouncementVariables>;

interface CreateAnnouncementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAnnouncementVariables): MutationRef<CreateAnnouncementData, CreateAnnouncementVariables>;
}
export const createAnnouncementRef: CreateAnnouncementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAnnouncement(dc: DataConnect, vars: CreateAnnouncementVariables): MutationPromise<CreateAnnouncementData, CreateAnnouncementVariables>;

interface CreateAnnouncementRef {
  ...
  (dc: DataConnect, vars: CreateAnnouncementVariables): MutationRef<CreateAnnouncementData, CreateAnnouncementVariables>;
}
export const createAnnouncementRef: CreateAnnouncementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAnnouncementRef:
```typescript
const name = createAnnouncementRef.operationName;
console.log(name);
```

### Variables
The `CreateAnnouncement` mutation requires an argument of type `CreateAnnouncementVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAnnouncementVariables {
  content: string;
  scope: string;
  category: string;
  imageUrl?: string | null;
  authorUid: string;
}
```
### Return Type
Recall that executing the `CreateAnnouncement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAnnouncementData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAnnouncementData {
  announcement_insert: Announcement_Key;
}
```
### Using `CreateAnnouncement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAnnouncement, CreateAnnouncementVariables } from '@church-central/dataconnect';

// The `CreateAnnouncement` mutation requires an argument of type `CreateAnnouncementVariables`:
const createAnnouncementVars: CreateAnnouncementVariables = {
  content: ..., 
  scope: ..., 
  category: ..., 
  imageUrl: ..., // optional
  authorUid: ..., 
};

// Call the `createAnnouncement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAnnouncement(createAnnouncementVars);
// Variables can be defined inline as well.
const { data } = await createAnnouncement({ content: ..., scope: ..., category: ..., imageUrl: ..., authorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAnnouncement(dataConnect, createAnnouncementVars);

console.log(data.announcement_insert);

// Or, you can use the `Promise` API.
createAnnouncement(createAnnouncementVars).then((response) => {
  const data = response.data;
  console.log(data.announcement_insert);
});
```

### Using `CreateAnnouncement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAnnouncementRef, CreateAnnouncementVariables } from '@church-central/dataconnect';

// The `CreateAnnouncement` mutation requires an argument of type `CreateAnnouncementVariables`:
const createAnnouncementVars: CreateAnnouncementVariables = {
  content: ..., 
  scope: ..., 
  category: ..., 
  imageUrl: ..., // optional
  authorUid: ..., 
};

// Call the `createAnnouncementRef()` function to get a reference to the mutation.
const ref = createAnnouncementRef(createAnnouncementVars);
// Variables can be defined inline as well.
const ref = createAnnouncementRef({ content: ..., scope: ..., category: ..., imageUrl: ..., authorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAnnouncementRef(dataConnect, createAnnouncementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.announcement_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.announcement_insert);
});
```

## CreateEvent
You can execute the `CreateEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createEvent(vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

interface CreateEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
}
export const createEventRef: CreateEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEvent(dc: DataConnect, vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

interface CreateEventRef {
  ...
  (dc: DataConnect, vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
}
export const createEventRef: CreateEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEventRef:
```typescript
const name = createEventRef.operationName;
console.log(name);
```

### Variables
The `CreateEvent` mutation requires an argument of type `CreateEventVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEventData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEventData {
  event_insert: Event_Key;
}
```
### Using `CreateEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEvent, CreateEventVariables } from '@church-central/dataconnect';

// The `CreateEvent` mutation requires an argument of type `CreateEventVariables`:
const createEventVars: CreateEventVariables = {
  title: ..., 
  date: ..., 
  time: ..., 
  endTime: ..., 
  location: ..., 
  description: ..., 
  type: ..., 
  capacity: ..., 
  createdByUid: ..., 
};

// Call the `createEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEvent(createEventVars);
// Variables can be defined inline as well.
const { data } = await createEvent({ title: ..., date: ..., time: ..., endTime: ..., location: ..., description: ..., type: ..., capacity: ..., createdByUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEvent(dataConnect, createEventVars);

console.log(data.event_insert);

// Or, you can use the `Promise` API.
createEvent(createEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_insert);
});
```

### Using `CreateEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEventRef, CreateEventVariables } from '@church-central/dataconnect';

// The `CreateEvent` mutation requires an argument of type `CreateEventVariables`:
const createEventVars: CreateEventVariables = {
  title: ..., 
  date: ..., 
  time: ..., 
  endTime: ..., 
  location: ..., 
  description: ..., 
  type: ..., 
  capacity: ..., 
  createdByUid: ..., 
};

// Call the `createEventRef()` function to get a reference to the mutation.
const ref = createEventRef(createEventVars);
// Variables can be defined inline as well.
const ref = createEventRef({ title: ..., date: ..., time: ..., endTime: ..., location: ..., description: ..., type: ..., capacity: ..., createdByUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEventRef(dataConnect, createEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_insert);
});
```

## RegisterForEvent
You can execute the `RegisterForEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
registerForEvent(vars: RegisterForEventVariables): MutationPromise<RegisterForEventData, RegisterForEventVariables>;

interface RegisterForEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterForEventVariables): MutationRef<RegisterForEventData, RegisterForEventVariables>;
}
export const registerForEventRef: RegisterForEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registerForEvent(dc: DataConnect, vars: RegisterForEventVariables): MutationPromise<RegisterForEventData, RegisterForEventVariables>;

interface RegisterForEventRef {
  ...
  (dc: DataConnect, vars: RegisterForEventVariables): MutationRef<RegisterForEventData, RegisterForEventVariables>;
}
export const registerForEventRef: RegisterForEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registerForEventRef:
```typescript
const name = registerForEventRef.operationName;
console.log(name);
```

### Variables
The `RegisterForEvent` mutation requires an argument of type `RegisterForEventVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegisterForEventVariables {
  eventId: UUIDString;
  userUid: string;
}
```
### Return Type
Recall that executing the `RegisterForEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegisterForEventData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegisterForEventData {
  eventRegistration_insert: EventRegistration_Key;
  event_update?: Event_Key | null;
}
```
### Using `RegisterForEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registerForEvent, RegisterForEventVariables } from '@church-central/dataconnect';

// The `RegisterForEvent` mutation requires an argument of type `RegisterForEventVariables`:
const registerForEventVars: RegisterForEventVariables = {
  eventId: ..., 
  userUid: ..., 
};

// Call the `registerForEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registerForEvent(registerForEventVars);
// Variables can be defined inline as well.
const { data } = await registerForEvent({ eventId: ..., userUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registerForEvent(dataConnect, registerForEventVars);

console.log(data.eventRegistration_insert);
console.log(data.event_update);

// Or, you can use the `Promise` API.
registerForEvent(registerForEventVars).then((response) => {
  const data = response.data;
  console.log(data.eventRegistration_insert);
  console.log(data.event_update);
});
```

### Using `RegisterForEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registerForEventRef, RegisterForEventVariables } from '@church-central/dataconnect';

// The `RegisterForEvent` mutation requires an argument of type `RegisterForEventVariables`:
const registerForEventVars: RegisterForEventVariables = {
  eventId: ..., 
  userUid: ..., 
};

// Call the `registerForEventRef()` function to get a reference to the mutation.
const ref = registerForEventRef(registerForEventVars);
// Variables can be defined inline as well.
const ref = registerForEventRef({ eventId: ..., userUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registerForEventRef(dataConnect, registerForEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.eventRegistration_insert);
console.log(data.event_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.eventRegistration_insert);
  console.log(data.event_update);
});
```

## CancelEventRegistration
You can execute the `CancelEventRegistration` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
cancelEventRegistration(vars: CancelEventRegistrationVariables): MutationPromise<CancelEventRegistrationData, CancelEventRegistrationVariables>;

interface CancelEventRegistrationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelEventRegistrationVariables): MutationRef<CancelEventRegistrationData, CancelEventRegistrationVariables>;
}
export const cancelEventRegistrationRef: CancelEventRegistrationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cancelEventRegistration(dc: DataConnect, vars: CancelEventRegistrationVariables): MutationPromise<CancelEventRegistrationData, CancelEventRegistrationVariables>;

interface CancelEventRegistrationRef {
  ...
  (dc: DataConnect, vars: CancelEventRegistrationVariables): MutationRef<CancelEventRegistrationData, CancelEventRegistrationVariables>;
}
export const cancelEventRegistrationRef: CancelEventRegistrationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cancelEventRegistrationRef:
```typescript
const name = cancelEventRegistrationRef.operationName;
console.log(name);
```

### Variables
The `CancelEventRegistration` mutation requires an argument of type `CancelEventRegistrationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CancelEventRegistrationVariables {
  eventId: UUIDString;
  userUid: string;
}
```
### Return Type
Recall that executing the `CancelEventRegistration` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CancelEventRegistrationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CancelEventRegistrationData {
  eventRegistration_delete?: EventRegistration_Key | null;
  event_update?: Event_Key | null;
}
```
### Using `CancelEventRegistration`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cancelEventRegistration, CancelEventRegistrationVariables } from '@church-central/dataconnect';

// The `CancelEventRegistration` mutation requires an argument of type `CancelEventRegistrationVariables`:
const cancelEventRegistrationVars: CancelEventRegistrationVariables = {
  eventId: ..., 
  userUid: ..., 
};

// Call the `cancelEventRegistration()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cancelEventRegistration(cancelEventRegistrationVars);
// Variables can be defined inline as well.
const { data } = await cancelEventRegistration({ eventId: ..., userUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cancelEventRegistration(dataConnect, cancelEventRegistrationVars);

console.log(data.eventRegistration_delete);
console.log(data.event_update);

// Or, you can use the `Promise` API.
cancelEventRegistration(cancelEventRegistrationVars).then((response) => {
  const data = response.data;
  console.log(data.eventRegistration_delete);
  console.log(data.event_update);
});
```

### Using `CancelEventRegistration`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cancelEventRegistrationRef, CancelEventRegistrationVariables } from '@church-central/dataconnect';

// The `CancelEventRegistration` mutation requires an argument of type `CancelEventRegistrationVariables`:
const cancelEventRegistrationVars: CancelEventRegistrationVariables = {
  eventId: ..., 
  userUid: ..., 
};

// Call the `cancelEventRegistrationRef()` function to get a reference to the mutation.
const ref = cancelEventRegistrationRef(cancelEventRegistrationVars);
// Variables can be defined inline as well.
const ref = cancelEventRegistrationRef({ eventId: ..., userUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cancelEventRegistrationRef(dataConnect, cancelEventRegistrationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.eventRegistration_delete);
console.log(data.event_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.eventRegistration_delete);
  console.log(data.event_update);
});
```

## CreateBaptism
You can execute the `CreateBaptism` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createBaptism(vars: CreateBaptismVariables): MutationPromise<CreateBaptismData, CreateBaptismVariables>;

interface CreateBaptismRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBaptismVariables): MutationRef<CreateBaptismData, CreateBaptismVariables>;
}
export const createBaptismRef: CreateBaptismRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBaptism(dc: DataConnect, vars: CreateBaptismVariables): MutationPromise<CreateBaptismData, CreateBaptismVariables>;

interface CreateBaptismRef {
  ...
  (dc: DataConnect, vars: CreateBaptismVariables): MutationRef<CreateBaptismData, CreateBaptismVariables>;
}
export const createBaptismRef: CreateBaptismRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBaptismRef:
```typescript
const name = createBaptismRef.operationName;
console.log(name);
```

### Variables
The `CreateBaptism` mutation requires an argument of type `CreateBaptismVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBaptismVariables {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  createdByUid: string;
}
```
### Return Type
Recall that executing the `CreateBaptism` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBaptismData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBaptismData {
  baptismEvent_insert: BaptismEvent_Key;
}
```
### Using `CreateBaptism`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBaptism, CreateBaptismVariables } from '@church-central/dataconnect';

// The `CreateBaptism` mutation requires an argument of type `CreateBaptismVariables`:
const createBaptismVars: CreateBaptismVariables = {
  title: ..., 
  date: ..., 
  time: ..., 
  location: ..., 
  description: ..., 
  capacity: ..., 
  createdByUid: ..., 
};

// Call the `createBaptism()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBaptism(createBaptismVars);
// Variables can be defined inline as well.
const { data } = await createBaptism({ title: ..., date: ..., time: ..., location: ..., description: ..., capacity: ..., createdByUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBaptism(dataConnect, createBaptismVars);

console.log(data.baptismEvent_insert);

// Or, you can use the `Promise` API.
createBaptism(createBaptismVars).then((response) => {
  const data = response.data;
  console.log(data.baptismEvent_insert);
});
```

### Using `CreateBaptism`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBaptismRef, CreateBaptismVariables } from '@church-central/dataconnect';

// The `CreateBaptism` mutation requires an argument of type `CreateBaptismVariables`:
const createBaptismVars: CreateBaptismVariables = {
  title: ..., 
  date: ..., 
  time: ..., 
  location: ..., 
  description: ..., 
  capacity: ..., 
  createdByUid: ..., 
};

// Call the `createBaptismRef()` function to get a reference to the mutation.
const ref = createBaptismRef(createBaptismVars);
// Variables can be defined inline as well.
const ref = createBaptismRef({ title: ..., date: ..., time: ..., location: ..., description: ..., capacity: ..., createdByUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBaptismRef(dataConnect, createBaptismVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.baptismEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.baptismEvent_insert);
});
```

## RegisterForBaptism
You can execute the `RegisterForBaptism` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
registerForBaptism(vars: RegisterForBaptismVariables): MutationPromise<RegisterForBaptismData, RegisterForBaptismVariables>;

interface RegisterForBaptismRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterForBaptismVariables): MutationRef<RegisterForBaptismData, RegisterForBaptismVariables>;
}
export const registerForBaptismRef: RegisterForBaptismRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registerForBaptism(dc: DataConnect, vars: RegisterForBaptismVariables): MutationPromise<RegisterForBaptismData, RegisterForBaptismVariables>;

interface RegisterForBaptismRef {
  ...
  (dc: DataConnect, vars: RegisterForBaptismVariables): MutationRef<RegisterForBaptismData, RegisterForBaptismVariables>;
}
export const registerForBaptismRef: RegisterForBaptismRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registerForBaptismRef:
```typescript
const name = registerForBaptismRef.operationName;
console.log(name);
```

### Variables
The `RegisterForBaptism` mutation requires an argument of type `RegisterForBaptismVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegisterForBaptismVariables {
  baptismEventId: UUIDString;
  userUid: string;
}
```
### Return Type
Recall that executing the `RegisterForBaptism` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegisterForBaptismData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegisterForBaptismData {
  baptismRegistration_insert: BaptismRegistration_Key;
  baptismEvent_update?: BaptismEvent_Key | null;
}
```
### Using `RegisterForBaptism`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registerForBaptism, RegisterForBaptismVariables } from '@church-central/dataconnect';

// The `RegisterForBaptism` mutation requires an argument of type `RegisterForBaptismVariables`:
const registerForBaptismVars: RegisterForBaptismVariables = {
  baptismEventId: ..., 
  userUid: ..., 
};

// Call the `registerForBaptism()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registerForBaptism(registerForBaptismVars);
// Variables can be defined inline as well.
const { data } = await registerForBaptism({ baptismEventId: ..., userUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registerForBaptism(dataConnect, registerForBaptismVars);

console.log(data.baptismRegistration_insert);
console.log(data.baptismEvent_update);

// Or, you can use the `Promise` API.
registerForBaptism(registerForBaptismVars).then((response) => {
  const data = response.data;
  console.log(data.baptismRegistration_insert);
  console.log(data.baptismEvent_update);
});
```

### Using `RegisterForBaptism`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registerForBaptismRef, RegisterForBaptismVariables } from '@church-central/dataconnect';

// The `RegisterForBaptism` mutation requires an argument of type `RegisterForBaptismVariables`:
const registerForBaptismVars: RegisterForBaptismVariables = {
  baptismEventId: ..., 
  userUid: ..., 
};

// Call the `registerForBaptismRef()` function to get a reference to the mutation.
const ref = registerForBaptismRef(registerForBaptismVars);
// Variables can be defined inline as well.
const ref = registerForBaptismRef({ baptismEventId: ..., userUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registerForBaptismRef(dataConnect, registerForBaptismVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.baptismRegistration_insert);
console.log(data.baptismEvent_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.baptismRegistration_insert);
  console.log(data.baptismEvent_update);
});
```

## CancelBaptismRegistration
You can execute the `CancelBaptismRegistration` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
cancelBaptismRegistration(vars: CancelBaptismRegistrationVariables): MutationPromise<CancelBaptismRegistrationData, CancelBaptismRegistrationVariables>;

interface CancelBaptismRegistrationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelBaptismRegistrationVariables): MutationRef<CancelBaptismRegistrationData, CancelBaptismRegistrationVariables>;
}
export const cancelBaptismRegistrationRef: CancelBaptismRegistrationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cancelBaptismRegistration(dc: DataConnect, vars: CancelBaptismRegistrationVariables): MutationPromise<CancelBaptismRegistrationData, CancelBaptismRegistrationVariables>;

interface CancelBaptismRegistrationRef {
  ...
  (dc: DataConnect, vars: CancelBaptismRegistrationVariables): MutationRef<CancelBaptismRegistrationData, CancelBaptismRegistrationVariables>;
}
export const cancelBaptismRegistrationRef: CancelBaptismRegistrationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cancelBaptismRegistrationRef:
```typescript
const name = cancelBaptismRegistrationRef.operationName;
console.log(name);
```

### Variables
The `CancelBaptismRegistration` mutation requires an argument of type `CancelBaptismRegistrationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CancelBaptismRegistrationVariables {
  baptismEventId: UUIDString;
  userUid: string;
}
```
### Return Type
Recall that executing the `CancelBaptismRegistration` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CancelBaptismRegistrationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CancelBaptismRegistrationData {
  baptismRegistration_delete?: BaptismRegistration_Key | null;
  baptismEvent_update?: BaptismEvent_Key | null;
}
```
### Using `CancelBaptismRegistration`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cancelBaptismRegistration, CancelBaptismRegistrationVariables } from '@church-central/dataconnect';

// The `CancelBaptismRegistration` mutation requires an argument of type `CancelBaptismRegistrationVariables`:
const cancelBaptismRegistrationVars: CancelBaptismRegistrationVariables = {
  baptismEventId: ..., 
  userUid: ..., 
};

// Call the `cancelBaptismRegistration()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cancelBaptismRegistration(cancelBaptismRegistrationVars);
// Variables can be defined inline as well.
const { data } = await cancelBaptismRegistration({ baptismEventId: ..., userUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cancelBaptismRegistration(dataConnect, cancelBaptismRegistrationVars);

console.log(data.baptismRegistration_delete);
console.log(data.baptismEvent_update);

// Or, you can use the `Promise` API.
cancelBaptismRegistration(cancelBaptismRegistrationVars).then((response) => {
  const data = response.data;
  console.log(data.baptismRegistration_delete);
  console.log(data.baptismEvent_update);
});
```

### Using `CancelBaptismRegistration`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cancelBaptismRegistrationRef, CancelBaptismRegistrationVariables } from '@church-central/dataconnect';

// The `CancelBaptismRegistration` mutation requires an argument of type `CancelBaptismRegistrationVariables`:
const cancelBaptismRegistrationVars: CancelBaptismRegistrationVariables = {
  baptismEventId: ..., 
  userUid: ..., 
};

// Call the `cancelBaptismRegistrationRef()` function to get a reference to the mutation.
const ref = cancelBaptismRegistrationRef(cancelBaptismRegistrationVars);
// Variables can be defined inline as well.
const ref = cancelBaptismRegistrationRef({ baptismEventId: ..., userUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cancelBaptismRegistrationRef(dataConnect, cancelBaptismRegistrationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.baptismRegistration_delete);
console.log(data.baptismEvent_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.baptismRegistration_delete);
  console.log(data.baptismEvent_update);
});
```

## DeleteEvent
You can execute the `DeleteEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteEvent(vars: DeleteEventVariables): MutationPromise<DeleteEventData, DeleteEventVariables>;

interface DeleteEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEventVariables): MutationRef<DeleteEventData, DeleteEventVariables>;
}
export const deleteEventRef: DeleteEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteEvent(dc: DataConnect, vars: DeleteEventVariables): MutationPromise<DeleteEventData, DeleteEventVariables>;

interface DeleteEventRef {
  ...
  (dc: DataConnect, vars: DeleteEventVariables): MutationRef<DeleteEventData, DeleteEventVariables>;
}
export const deleteEventRef: DeleteEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteEventRef:
```typescript
const name = deleteEventRef.operationName;
console.log(name);
```

### Variables
The `DeleteEvent` mutation requires an argument of type `DeleteEventVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteEventVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteEventData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteEventData {
  event_delete?: Event_Key | null;
}
```
### Using `DeleteEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteEvent, DeleteEventVariables } from '@church-central/dataconnect';

// The `DeleteEvent` mutation requires an argument of type `DeleteEventVariables`:
const deleteEventVars: DeleteEventVariables = {
  id: ..., 
};

// Call the `deleteEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteEvent(deleteEventVars);
// Variables can be defined inline as well.
const { data } = await deleteEvent({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteEvent(dataConnect, deleteEventVars);

console.log(data.event_delete);

// Or, you can use the `Promise` API.
deleteEvent(deleteEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_delete);
});
```

### Using `DeleteEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteEventRef, DeleteEventVariables } from '@church-central/dataconnect';

// The `DeleteEvent` mutation requires an argument of type `DeleteEventVariables`:
const deleteEventVars: DeleteEventVariables = {
  id: ..., 
};

// Call the `deleteEventRef()` function to get a reference to the mutation.
const ref = deleteEventRef(deleteEventVars);
// Variables can be defined inline as well.
const ref = deleteEventRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteEventRef(dataConnect, deleteEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_delete);
});
```

## DeleteBaptismEvent
You can execute the `DeleteBaptismEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteBaptismEvent(vars: DeleteBaptismEventVariables): MutationPromise<DeleteBaptismEventData, DeleteBaptismEventVariables>;

interface DeleteBaptismEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBaptismEventVariables): MutationRef<DeleteBaptismEventData, DeleteBaptismEventVariables>;
}
export const deleteBaptismEventRef: DeleteBaptismEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBaptismEvent(dc: DataConnect, vars: DeleteBaptismEventVariables): MutationPromise<DeleteBaptismEventData, DeleteBaptismEventVariables>;

interface DeleteBaptismEventRef {
  ...
  (dc: DataConnect, vars: DeleteBaptismEventVariables): MutationRef<DeleteBaptismEventData, DeleteBaptismEventVariables>;
}
export const deleteBaptismEventRef: DeleteBaptismEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBaptismEventRef:
```typescript
const name = deleteBaptismEventRef.operationName;
console.log(name);
```

### Variables
The `DeleteBaptismEvent` mutation requires an argument of type `DeleteBaptismEventVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBaptismEventVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteBaptismEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBaptismEventData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBaptismEventData {
  baptismEvent_delete?: BaptismEvent_Key | null;
}
```
### Using `DeleteBaptismEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBaptismEvent, DeleteBaptismEventVariables } from '@church-central/dataconnect';

// The `DeleteBaptismEvent` mutation requires an argument of type `DeleteBaptismEventVariables`:
const deleteBaptismEventVars: DeleteBaptismEventVariables = {
  id: ..., 
};

// Call the `deleteBaptismEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBaptismEvent(deleteBaptismEventVars);
// Variables can be defined inline as well.
const { data } = await deleteBaptismEvent({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBaptismEvent(dataConnect, deleteBaptismEventVars);

console.log(data.baptismEvent_delete);

// Or, you can use the `Promise` API.
deleteBaptismEvent(deleteBaptismEventVars).then((response) => {
  const data = response.data;
  console.log(data.baptismEvent_delete);
});
```

### Using `DeleteBaptismEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBaptismEventRef, DeleteBaptismEventVariables } from '@church-central/dataconnect';

// The `DeleteBaptismEvent` mutation requires an argument of type `DeleteBaptismEventVariables`:
const deleteBaptismEventVars: DeleteBaptismEventVariables = {
  id: ..., 
};

// Call the `deleteBaptismEventRef()` function to get a reference to the mutation.
const ref = deleteBaptismEventRef(deleteBaptismEventVars);
// Variables can be defined inline as well.
const ref = deleteBaptismEventRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBaptismEventRef(dataConnect, deleteBaptismEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.baptismEvent_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.baptismEvent_delete);
});
```

## UpdateEvent
You can execute the `UpdateEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateEvent(vars: UpdateEventVariables): MutationPromise<UpdateEventData, UpdateEventVariables>;

interface UpdateEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEventVariables): MutationRef<UpdateEventData, UpdateEventVariables>;
}
export const updateEventRef: UpdateEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEvent(dc: DataConnect, vars: UpdateEventVariables): MutationPromise<UpdateEventData, UpdateEventVariables>;

interface UpdateEventRef {
  ...
  (dc: DataConnect, vars: UpdateEventVariables): MutationRef<UpdateEventData, UpdateEventVariables>;
}
export const updateEventRef: UpdateEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEventRef:
```typescript
const name = updateEventRef.operationName;
console.log(name);
```

### Variables
The `UpdateEvent` mutation requires an argument of type `UpdateEventVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEventData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEventData {
  event_update?: Event_Key | null;
}
```
### Using `UpdateEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEvent, UpdateEventVariables } from '@church-central/dataconnect';

// The `UpdateEvent` mutation requires an argument of type `UpdateEventVariables`:
const updateEventVars: UpdateEventVariables = {
  id: ..., 
  title: ..., // optional
  date: ..., // optional
  time: ..., // optional
  endTime: ..., // optional
  location: ..., // optional
  description: ..., // optional
  type: ..., // optional
  capacity: ..., // optional
};

// Call the `updateEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEvent(updateEventVars);
// Variables can be defined inline as well.
const { data } = await updateEvent({ id: ..., title: ..., date: ..., time: ..., endTime: ..., location: ..., description: ..., type: ..., capacity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEvent(dataConnect, updateEventVars);

console.log(data.event_update);

// Or, you can use the `Promise` API.
updateEvent(updateEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_update);
});
```

### Using `UpdateEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEventRef, UpdateEventVariables } from '@church-central/dataconnect';

// The `UpdateEvent` mutation requires an argument of type `UpdateEventVariables`:
const updateEventVars: UpdateEventVariables = {
  id: ..., 
  title: ..., // optional
  date: ..., // optional
  time: ..., // optional
  endTime: ..., // optional
  location: ..., // optional
  description: ..., // optional
  type: ..., // optional
  capacity: ..., // optional
};

// Call the `updateEventRef()` function to get a reference to the mutation.
const ref = updateEventRef(updateEventVars);
// Variables can be defined inline as well.
const ref = updateEventRef({ id: ..., title: ..., date: ..., time: ..., endTime: ..., location: ..., description: ..., type: ..., capacity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEventRef(dataConnect, updateEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_update);
});
```

## CreateAppointmentRequest
You can execute the `CreateAppointmentRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createAppointmentRequest(vars: CreateAppointmentRequestVariables): MutationPromise<CreateAppointmentRequestData, CreateAppointmentRequestVariables>;

interface CreateAppointmentRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAppointmentRequestVariables): MutationRef<CreateAppointmentRequestData, CreateAppointmentRequestVariables>;
}
export const createAppointmentRequestRef: CreateAppointmentRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAppointmentRequest(dc: DataConnect, vars: CreateAppointmentRequestVariables): MutationPromise<CreateAppointmentRequestData, CreateAppointmentRequestVariables>;

interface CreateAppointmentRequestRef {
  ...
  (dc: DataConnect, vars: CreateAppointmentRequestVariables): MutationRef<CreateAppointmentRequestData, CreateAppointmentRequestVariables>;
}
export const createAppointmentRequestRef: CreateAppointmentRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAppointmentRequestRef:
```typescript
const name = createAppointmentRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateAppointmentRequest` mutation requires an argument of type `CreateAppointmentRequestVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateAppointmentRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAppointmentRequestData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAppointmentRequestData {
  appointmentRequest_insert: AppointmentRequest_Key;
}
```
### Using `CreateAppointmentRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAppointmentRequest, CreateAppointmentRequestVariables } from '@church-central/dataconnect';

// The `CreateAppointmentRequest` mutation requires an argument of type `CreateAppointmentRequestVariables`:
const createAppointmentRequestVars: CreateAppointmentRequestVariables = {
  requester: ..., 
  requesterEmail: ..., 
  staff: ..., 
  leaderUid: ..., 
  paUid: ..., // optional
  date1: ..., 
  time1: ..., 
  date2: ..., 
  time2: ..., 
  date3: ..., 
  time3: ..., 
  reason: ..., 
  type: ..., 
};

// Call the `createAppointmentRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAppointmentRequest(createAppointmentRequestVars);
// Variables can be defined inline as well.
const { data } = await createAppointmentRequest({ requester: ..., requesterEmail: ..., staff: ..., leaderUid: ..., paUid: ..., date1: ..., time1: ..., date2: ..., time2: ..., date3: ..., time3: ..., reason: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAppointmentRequest(dataConnect, createAppointmentRequestVars);

console.log(data.appointmentRequest_insert);

// Or, you can use the `Promise` API.
createAppointmentRequest(createAppointmentRequestVars).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequest_insert);
});
```

### Using `CreateAppointmentRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAppointmentRequestRef, CreateAppointmentRequestVariables } from '@church-central/dataconnect';

// The `CreateAppointmentRequest` mutation requires an argument of type `CreateAppointmentRequestVariables`:
const createAppointmentRequestVars: CreateAppointmentRequestVariables = {
  requester: ..., 
  requesterEmail: ..., 
  staff: ..., 
  leaderUid: ..., 
  paUid: ..., // optional
  date1: ..., 
  time1: ..., 
  date2: ..., 
  time2: ..., 
  date3: ..., 
  time3: ..., 
  reason: ..., 
  type: ..., 
};

// Call the `createAppointmentRequestRef()` function to get a reference to the mutation.
const ref = createAppointmentRequestRef(createAppointmentRequestVars);
// Variables can be defined inline as well.
const ref = createAppointmentRequestRef({ requester: ..., requesterEmail: ..., staff: ..., leaderUid: ..., paUid: ..., date1: ..., time1: ..., date2: ..., time2: ..., date3: ..., time3: ..., reason: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAppointmentRequestRef(dataConnect, createAppointmentRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointmentRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequest_insert);
});
```

## ApproveAppointment
You can execute the `ApproveAppointment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
approveAppointment(vars: ApproveAppointmentVariables): MutationPromise<ApproveAppointmentData, ApproveAppointmentVariables>;

interface ApproveAppointmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApproveAppointmentVariables): MutationRef<ApproveAppointmentData, ApproveAppointmentVariables>;
}
export const approveAppointmentRef: ApproveAppointmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
approveAppointment(dc: DataConnect, vars: ApproveAppointmentVariables): MutationPromise<ApproveAppointmentData, ApproveAppointmentVariables>;

interface ApproveAppointmentRef {
  ...
  (dc: DataConnect, vars: ApproveAppointmentVariables): MutationRef<ApproveAppointmentData, ApproveAppointmentVariables>;
}
export const approveAppointmentRef: ApproveAppointmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the approveAppointmentRef:
```typescript
const name = approveAppointmentRef.operationName;
console.log(name);
```

### Variables
The `ApproveAppointment` mutation requires an argument of type `ApproveAppointmentVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ApproveAppointmentVariables {
  id: UUIDString;
  approvedBy: string;
  selectedSlot: number;
  date: string;
  time: string;
}
```
### Return Type
Recall that executing the `ApproveAppointment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ApproveAppointmentData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ApproveAppointmentData {
  appointmentRequest_update?: AppointmentRequest_Key | null;
}
```
### Using `ApproveAppointment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, approveAppointment, ApproveAppointmentVariables } from '@church-central/dataconnect';

// The `ApproveAppointment` mutation requires an argument of type `ApproveAppointmentVariables`:
const approveAppointmentVars: ApproveAppointmentVariables = {
  id: ..., 
  approvedBy: ..., 
  selectedSlot: ..., 
  date: ..., 
  time: ..., 
};

// Call the `approveAppointment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await approveAppointment(approveAppointmentVars);
// Variables can be defined inline as well.
const { data } = await approveAppointment({ id: ..., approvedBy: ..., selectedSlot: ..., date: ..., time: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await approveAppointment(dataConnect, approveAppointmentVars);

console.log(data.appointmentRequest_update);

// Or, you can use the `Promise` API.
approveAppointment(approveAppointmentVars).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequest_update);
});
```

### Using `ApproveAppointment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, approveAppointmentRef, ApproveAppointmentVariables } from '@church-central/dataconnect';

// The `ApproveAppointment` mutation requires an argument of type `ApproveAppointmentVariables`:
const approveAppointmentVars: ApproveAppointmentVariables = {
  id: ..., 
  approvedBy: ..., 
  selectedSlot: ..., 
  date: ..., 
  time: ..., 
};

// Call the `approveAppointmentRef()` function to get a reference to the mutation.
const ref = approveAppointmentRef(approveAppointmentVars);
// Variables can be defined inline as well.
const ref = approveAppointmentRef({ id: ..., approvedBy: ..., selectedSlot: ..., date: ..., time: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = approveAppointmentRef(dataConnect, approveAppointmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointmentRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequest_update);
});
```

## RejectAppointment
You can execute the `RejectAppointment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
rejectAppointment(vars: RejectAppointmentVariables): MutationPromise<RejectAppointmentData, RejectAppointmentVariables>;

interface RejectAppointmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RejectAppointmentVariables): MutationRef<RejectAppointmentData, RejectAppointmentVariables>;
}
export const rejectAppointmentRef: RejectAppointmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
rejectAppointment(dc: DataConnect, vars: RejectAppointmentVariables): MutationPromise<RejectAppointmentData, RejectAppointmentVariables>;

interface RejectAppointmentRef {
  ...
  (dc: DataConnect, vars: RejectAppointmentVariables): MutationRef<RejectAppointmentData, RejectAppointmentVariables>;
}
export const rejectAppointmentRef: RejectAppointmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the rejectAppointmentRef:
```typescript
const name = rejectAppointmentRef.operationName;
console.log(name);
```

### Variables
The `RejectAppointment` mutation requires an argument of type `RejectAppointmentVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RejectAppointmentVariables {
  id: UUIDString;
  rejectedBy: string;
  rejectionReason: string;
}
```
### Return Type
Recall that executing the `RejectAppointment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RejectAppointmentData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RejectAppointmentData {
  appointmentRequest_update?: AppointmentRequest_Key | null;
}
```
### Using `RejectAppointment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, rejectAppointment, RejectAppointmentVariables } from '@church-central/dataconnect';

// The `RejectAppointment` mutation requires an argument of type `RejectAppointmentVariables`:
const rejectAppointmentVars: RejectAppointmentVariables = {
  id: ..., 
  rejectedBy: ..., 
  rejectionReason: ..., 
};

// Call the `rejectAppointment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await rejectAppointment(rejectAppointmentVars);
// Variables can be defined inline as well.
const { data } = await rejectAppointment({ id: ..., rejectedBy: ..., rejectionReason: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await rejectAppointment(dataConnect, rejectAppointmentVars);

console.log(data.appointmentRequest_update);

// Or, you can use the `Promise` API.
rejectAppointment(rejectAppointmentVars).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequest_update);
});
```

### Using `RejectAppointment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, rejectAppointmentRef, RejectAppointmentVariables } from '@church-central/dataconnect';

// The `RejectAppointment` mutation requires an argument of type `RejectAppointmentVariables`:
const rejectAppointmentVars: RejectAppointmentVariables = {
  id: ..., 
  rejectedBy: ..., 
  rejectionReason: ..., 
};

// Call the `rejectAppointmentRef()` function to get a reference to the mutation.
const ref = rejectAppointmentRef(rejectAppointmentVars);
// Variables can be defined inline as well.
const ref = rejectAppointmentRef({ id: ..., rejectedBy: ..., rejectionReason: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = rejectAppointmentRef(dataConnect, rejectAppointmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointmentRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointmentRequest_update);
});
```

## CreateProgramBlock
You can execute the `CreateProgramBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createProgramBlock(vars: CreateProgramBlockVariables): MutationPromise<CreateProgramBlockData, CreateProgramBlockVariables>;

interface CreateProgramBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProgramBlockVariables): MutationRef<CreateProgramBlockData, CreateProgramBlockVariables>;
}
export const createProgramBlockRef: CreateProgramBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProgramBlock(dc: DataConnect, vars: CreateProgramBlockVariables): MutationPromise<CreateProgramBlockData, CreateProgramBlockVariables>;

interface CreateProgramBlockRef {
  ...
  (dc: DataConnect, vars: CreateProgramBlockVariables): MutationRef<CreateProgramBlockData, CreateProgramBlockVariables>;
}
export const createProgramBlockRef: CreateProgramBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProgramBlockRef:
```typescript
const name = createProgramBlockRef.operationName;
console.log(name);
```

### Variables
The `CreateProgramBlock` mutation requires an argument of type `CreateProgramBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProgramBlockVariables {
  date: string;
  time: string;
  title: string;
  minister: string;
}
```
### Return Type
Recall that executing the `CreateProgramBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProgramBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProgramBlockData {
  programBlock_insert: ProgramBlock_Key;
}
```
### Using `CreateProgramBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProgramBlock, CreateProgramBlockVariables } from '@church-central/dataconnect';

// The `CreateProgramBlock` mutation requires an argument of type `CreateProgramBlockVariables`:
const createProgramBlockVars: CreateProgramBlockVariables = {
  date: ..., 
  time: ..., 
  title: ..., 
  minister: ..., 
};

// Call the `createProgramBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProgramBlock(createProgramBlockVars);
// Variables can be defined inline as well.
const { data } = await createProgramBlock({ date: ..., time: ..., title: ..., minister: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProgramBlock(dataConnect, createProgramBlockVars);

console.log(data.programBlock_insert);

// Or, you can use the `Promise` API.
createProgramBlock(createProgramBlockVars).then((response) => {
  const data = response.data;
  console.log(data.programBlock_insert);
});
```

### Using `CreateProgramBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProgramBlockRef, CreateProgramBlockVariables } from '@church-central/dataconnect';

// The `CreateProgramBlock` mutation requires an argument of type `CreateProgramBlockVariables`:
const createProgramBlockVars: CreateProgramBlockVariables = {
  date: ..., 
  time: ..., 
  title: ..., 
  minister: ..., 
};

// Call the `createProgramBlockRef()` function to get a reference to the mutation.
const ref = createProgramBlockRef(createProgramBlockVars);
// Variables can be defined inline as well.
const ref = createProgramBlockRef({ date: ..., time: ..., title: ..., minister: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProgramBlockRef(dataConnect, createProgramBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.programBlock_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.programBlock_insert);
});
```

## DeleteProgramBlock
You can execute the `DeleteProgramBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteProgramBlock(vars: DeleteProgramBlockVariables): MutationPromise<DeleteProgramBlockData, DeleteProgramBlockVariables>;

interface DeleteProgramBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProgramBlockVariables): MutationRef<DeleteProgramBlockData, DeleteProgramBlockVariables>;
}
export const deleteProgramBlockRef: DeleteProgramBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProgramBlock(dc: DataConnect, vars: DeleteProgramBlockVariables): MutationPromise<DeleteProgramBlockData, DeleteProgramBlockVariables>;

interface DeleteProgramBlockRef {
  ...
  (dc: DataConnect, vars: DeleteProgramBlockVariables): MutationRef<DeleteProgramBlockData, DeleteProgramBlockVariables>;
}
export const deleteProgramBlockRef: DeleteProgramBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProgramBlockRef:
```typescript
const name = deleteProgramBlockRef.operationName;
console.log(name);
```

### Variables
The `DeleteProgramBlock` mutation requires an argument of type `DeleteProgramBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProgramBlockVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProgramBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProgramBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProgramBlockData {
  programBlock_delete?: ProgramBlock_Key | null;
}
```
### Using `DeleteProgramBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProgramBlock, DeleteProgramBlockVariables } from '@church-central/dataconnect';

// The `DeleteProgramBlock` mutation requires an argument of type `DeleteProgramBlockVariables`:
const deleteProgramBlockVars: DeleteProgramBlockVariables = {
  id: ..., 
};

// Call the `deleteProgramBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProgramBlock(deleteProgramBlockVars);
// Variables can be defined inline as well.
const { data } = await deleteProgramBlock({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProgramBlock(dataConnect, deleteProgramBlockVars);

console.log(data.programBlock_delete);

// Or, you can use the `Promise` API.
deleteProgramBlock(deleteProgramBlockVars).then((response) => {
  const data = response.data;
  console.log(data.programBlock_delete);
});
```

### Using `DeleteProgramBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProgramBlockRef, DeleteProgramBlockVariables } from '@church-central/dataconnect';

// The `DeleteProgramBlock` mutation requires an argument of type `DeleteProgramBlockVariables`:
const deleteProgramBlockVars: DeleteProgramBlockVariables = {
  id: ..., 
};

// Call the `deleteProgramBlockRef()` function to get a reference to the mutation.
const ref = deleteProgramBlockRef(deleteProgramBlockVars);
// Variables can be defined inline as well.
const ref = deleteProgramBlockRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProgramBlockRef(dataConnect, deleteProgramBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.programBlock_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.programBlock_delete);
});
```

## CreateReusableBlock
You can execute the `CreateReusableBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createReusableBlock(vars: CreateReusableBlockVariables): MutationPromise<CreateReusableBlockData, CreateReusableBlockVariables>;

interface CreateReusableBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReusableBlockVariables): MutationRef<CreateReusableBlockData, CreateReusableBlockVariables>;
}
export const createReusableBlockRef: CreateReusableBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReusableBlock(dc: DataConnect, vars: CreateReusableBlockVariables): MutationPromise<CreateReusableBlockData, CreateReusableBlockVariables>;

interface CreateReusableBlockRef {
  ...
  (dc: DataConnect, vars: CreateReusableBlockVariables): MutationRef<CreateReusableBlockData, CreateReusableBlockVariables>;
}
export const createReusableBlockRef: CreateReusableBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReusableBlockRef:
```typescript
const name = createReusableBlockRef.operationName;
console.log(name);
```

### Variables
The `CreateReusableBlock` mutation requires an argument of type `CreateReusableBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReusableBlockVariables {
  title: string;
  minister: string;
  time: string;
}
```
### Return Type
Recall that executing the `CreateReusableBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReusableBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReusableBlockData {
  reusableBlock_insert: ReusableBlock_Key;
}
```
### Using `CreateReusableBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReusableBlock, CreateReusableBlockVariables } from '@church-central/dataconnect';

// The `CreateReusableBlock` mutation requires an argument of type `CreateReusableBlockVariables`:
const createReusableBlockVars: CreateReusableBlockVariables = {
  title: ..., 
  minister: ..., 
  time: ..., 
};

// Call the `createReusableBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReusableBlock(createReusableBlockVars);
// Variables can be defined inline as well.
const { data } = await createReusableBlock({ title: ..., minister: ..., time: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReusableBlock(dataConnect, createReusableBlockVars);

console.log(data.reusableBlock_insert);

// Or, you can use the `Promise` API.
createReusableBlock(createReusableBlockVars).then((response) => {
  const data = response.data;
  console.log(data.reusableBlock_insert);
});
```

### Using `CreateReusableBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReusableBlockRef, CreateReusableBlockVariables } from '@church-central/dataconnect';

// The `CreateReusableBlock` mutation requires an argument of type `CreateReusableBlockVariables`:
const createReusableBlockVars: CreateReusableBlockVariables = {
  title: ..., 
  minister: ..., 
  time: ..., 
};

// Call the `createReusableBlockRef()` function to get a reference to the mutation.
const ref = createReusableBlockRef(createReusableBlockVars);
// Variables can be defined inline as well.
const ref = createReusableBlockRef({ title: ..., minister: ..., time: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReusableBlockRef(dataConnect, createReusableBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reusableBlock_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reusableBlock_insert);
});
```

## DeleteReusableBlock
You can execute the `DeleteReusableBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteReusableBlock(vars: DeleteReusableBlockVariables): MutationPromise<DeleteReusableBlockData, DeleteReusableBlockVariables>;

interface DeleteReusableBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReusableBlockVariables): MutationRef<DeleteReusableBlockData, DeleteReusableBlockVariables>;
}
export const deleteReusableBlockRef: DeleteReusableBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReusableBlock(dc: DataConnect, vars: DeleteReusableBlockVariables): MutationPromise<DeleteReusableBlockData, DeleteReusableBlockVariables>;

interface DeleteReusableBlockRef {
  ...
  (dc: DataConnect, vars: DeleteReusableBlockVariables): MutationRef<DeleteReusableBlockData, DeleteReusableBlockVariables>;
}
export const deleteReusableBlockRef: DeleteReusableBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReusableBlockRef:
```typescript
const name = deleteReusableBlockRef.operationName;
console.log(name);
```

### Variables
The `DeleteReusableBlock` mutation requires an argument of type `DeleteReusableBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReusableBlockVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteReusableBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReusableBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReusableBlockData {
  reusableBlock_delete?: ReusableBlock_Key | null;
}
```
### Using `DeleteReusableBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReusableBlock, DeleteReusableBlockVariables } from '@church-central/dataconnect';

// The `DeleteReusableBlock` mutation requires an argument of type `DeleteReusableBlockVariables`:
const deleteReusableBlockVars: DeleteReusableBlockVariables = {
  id: ..., 
};

// Call the `deleteReusableBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReusableBlock(deleteReusableBlockVars);
// Variables can be defined inline as well.
const { data } = await deleteReusableBlock({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReusableBlock(dataConnect, deleteReusableBlockVars);

console.log(data.reusableBlock_delete);

// Or, you can use the `Promise` API.
deleteReusableBlock(deleteReusableBlockVars).then((response) => {
  const data = response.data;
  console.log(data.reusableBlock_delete);
});
```

### Using `DeleteReusableBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReusableBlockRef, DeleteReusableBlockVariables } from '@church-central/dataconnect';

// The `DeleteReusableBlock` mutation requires an argument of type `DeleteReusableBlockVariables`:
const deleteReusableBlockVars: DeleteReusableBlockVariables = {
  id: ..., 
};

// Call the `deleteReusableBlockRef()` function to get a reference to the mutation.
const ref = deleteReusableBlockRef(deleteReusableBlockVars);
// Variables can be defined inline as well.
const ref = deleteReusableBlockRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReusableBlockRef(dataConnect, deleteReusableBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reusableBlock_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reusableBlock_delete);
});
```

## UpdateReusableBlock
You can execute the `UpdateReusableBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateReusableBlock(vars: UpdateReusableBlockVariables): MutationPromise<UpdateReusableBlockData, UpdateReusableBlockVariables>;

interface UpdateReusableBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReusableBlockVariables): MutationRef<UpdateReusableBlockData, UpdateReusableBlockVariables>;
}
export const updateReusableBlockRef: UpdateReusableBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReusableBlock(dc: DataConnect, vars: UpdateReusableBlockVariables): MutationPromise<UpdateReusableBlockData, UpdateReusableBlockVariables>;

interface UpdateReusableBlockRef {
  ...
  (dc: DataConnect, vars: UpdateReusableBlockVariables): MutationRef<UpdateReusableBlockData, UpdateReusableBlockVariables>;
}
export const updateReusableBlockRef: UpdateReusableBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReusableBlockRef:
```typescript
const name = updateReusableBlockRef.operationName;
console.log(name);
```

### Variables
The `UpdateReusableBlock` mutation requires an argument of type `UpdateReusableBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReusableBlockVariables {
  id: UUIDString;
  title: string;
  minister: string;
  time: string;
}
```
### Return Type
Recall that executing the `UpdateReusableBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReusableBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReusableBlockData {
  reusableBlock_update?: ReusableBlock_Key | null;
}
```
### Using `UpdateReusableBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReusableBlock, UpdateReusableBlockVariables } from '@church-central/dataconnect';

// The `UpdateReusableBlock` mutation requires an argument of type `UpdateReusableBlockVariables`:
const updateReusableBlockVars: UpdateReusableBlockVariables = {
  id: ..., 
  title: ..., 
  minister: ..., 
  time: ..., 
};

// Call the `updateReusableBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReusableBlock(updateReusableBlockVars);
// Variables can be defined inline as well.
const { data } = await updateReusableBlock({ id: ..., title: ..., minister: ..., time: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReusableBlock(dataConnect, updateReusableBlockVars);

console.log(data.reusableBlock_update);

// Or, you can use the `Promise` API.
updateReusableBlock(updateReusableBlockVars).then((response) => {
  const data = response.data;
  console.log(data.reusableBlock_update);
});
```

### Using `UpdateReusableBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReusableBlockRef, UpdateReusableBlockVariables } from '@church-central/dataconnect';

// The `UpdateReusableBlock` mutation requires an argument of type `UpdateReusableBlockVariables`:
const updateReusableBlockVars: UpdateReusableBlockVariables = {
  id: ..., 
  title: ..., 
  minister: ..., 
  time: ..., 
};

// Call the `updateReusableBlockRef()` function to get a reference to the mutation.
const ref = updateReusableBlockRef(updateReusableBlockVars);
// Variables can be defined inline as well.
const ref = updateReusableBlockRef({ id: ..., title: ..., minister: ..., time: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReusableBlockRef(dataConnect, updateReusableBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reusableBlock_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reusableBlock_update);
});
```

## CreatePersonalProgramBlock
You can execute the `CreatePersonalProgramBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createPersonalProgramBlock(vars: CreatePersonalProgramBlockVariables): MutationPromise<CreatePersonalProgramBlockData, CreatePersonalProgramBlockVariables>;

interface CreatePersonalProgramBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePersonalProgramBlockVariables): MutationRef<CreatePersonalProgramBlockData, CreatePersonalProgramBlockVariables>;
}
export const createPersonalProgramBlockRef: CreatePersonalProgramBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPersonalProgramBlock(dc: DataConnect, vars: CreatePersonalProgramBlockVariables): MutationPromise<CreatePersonalProgramBlockData, CreatePersonalProgramBlockVariables>;

interface CreatePersonalProgramBlockRef {
  ...
  (dc: DataConnect, vars: CreatePersonalProgramBlockVariables): MutationRef<CreatePersonalProgramBlockData, CreatePersonalProgramBlockVariables>;
}
export const createPersonalProgramBlockRef: CreatePersonalProgramBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPersonalProgramBlockRef:
```typescript
const name = createPersonalProgramBlockRef.operationName;
console.log(name);
```

### Variables
The `CreatePersonalProgramBlock` mutation requires an argument of type `CreatePersonalProgramBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreatePersonalProgramBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePersonalProgramBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePersonalProgramBlockData {
  personalProgramBlock_insert: PersonalProgramBlock_Key;
}
```
### Using `CreatePersonalProgramBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPersonalProgramBlock, CreatePersonalProgramBlockVariables } from '@church-central/dataconnect';

// The `CreatePersonalProgramBlock` mutation requires an argument of type `CreatePersonalProgramBlockVariables`:
const createPersonalProgramBlockVars: CreatePersonalProgramBlockVariables = {
  date: ..., 
  time: ..., 
  endTime: ..., // optional
  title: ..., 
  description: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `createPersonalProgramBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPersonalProgramBlock(createPersonalProgramBlockVars);
// Variables can be defined inline as well.
const { data } = await createPersonalProgramBlock({ date: ..., time: ..., endTime: ..., title: ..., description: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPersonalProgramBlock(dataConnect, createPersonalProgramBlockVars);

console.log(data.personalProgramBlock_insert);

// Or, you can use the `Promise` API.
createPersonalProgramBlock(createPersonalProgramBlockVars).then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlock_insert);
});
```

### Using `CreatePersonalProgramBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPersonalProgramBlockRef, CreatePersonalProgramBlockVariables } from '@church-central/dataconnect';

// The `CreatePersonalProgramBlock` mutation requires an argument of type `CreatePersonalProgramBlockVariables`:
const createPersonalProgramBlockVars: CreatePersonalProgramBlockVariables = {
  date: ..., 
  time: ..., 
  endTime: ..., // optional
  title: ..., 
  description: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `createPersonalProgramBlockRef()` function to get a reference to the mutation.
const ref = createPersonalProgramBlockRef(createPersonalProgramBlockVars);
// Variables can be defined inline as well.
const ref = createPersonalProgramBlockRef({ date: ..., time: ..., endTime: ..., title: ..., description: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPersonalProgramBlockRef(dataConnect, createPersonalProgramBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.personalProgramBlock_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlock_insert);
});
```

## DeletePersonalProgramBlock
You can execute the `DeletePersonalProgramBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deletePersonalProgramBlock(vars: DeletePersonalProgramBlockVariables): MutationPromise<DeletePersonalProgramBlockData, DeletePersonalProgramBlockVariables>;

interface DeletePersonalProgramBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePersonalProgramBlockVariables): MutationRef<DeletePersonalProgramBlockData, DeletePersonalProgramBlockVariables>;
}
export const deletePersonalProgramBlockRef: DeletePersonalProgramBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePersonalProgramBlock(dc: DataConnect, vars: DeletePersonalProgramBlockVariables): MutationPromise<DeletePersonalProgramBlockData, DeletePersonalProgramBlockVariables>;

interface DeletePersonalProgramBlockRef {
  ...
  (dc: DataConnect, vars: DeletePersonalProgramBlockVariables): MutationRef<DeletePersonalProgramBlockData, DeletePersonalProgramBlockVariables>;
}
export const deletePersonalProgramBlockRef: DeletePersonalProgramBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePersonalProgramBlockRef:
```typescript
const name = deletePersonalProgramBlockRef.operationName;
console.log(name);
```

### Variables
The `DeletePersonalProgramBlock` mutation requires an argument of type `DeletePersonalProgramBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePersonalProgramBlockVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePersonalProgramBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePersonalProgramBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePersonalProgramBlockData {
  personalProgramBlock_delete?: PersonalProgramBlock_Key | null;
}
```
### Using `DeletePersonalProgramBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePersonalProgramBlock, DeletePersonalProgramBlockVariables } from '@church-central/dataconnect';

// The `DeletePersonalProgramBlock` mutation requires an argument of type `DeletePersonalProgramBlockVariables`:
const deletePersonalProgramBlockVars: DeletePersonalProgramBlockVariables = {
  id: ..., 
};

// Call the `deletePersonalProgramBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePersonalProgramBlock(deletePersonalProgramBlockVars);
// Variables can be defined inline as well.
const { data } = await deletePersonalProgramBlock({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePersonalProgramBlock(dataConnect, deletePersonalProgramBlockVars);

console.log(data.personalProgramBlock_delete);

// Or, you can use the `Promise` API.
deletePersonalProgramBlock(deletePersonalProgramBlockVars).then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlock_delete);
});
```

### Using `DeletePersonalProgramBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePersonalProgramBlockRef, DeletePersonalProgramBlockVariables } from '@church-central/dataconnect';

// The `DeletePersonalProgramBlock` mutation requires an argument of type `DeletePersonalProgramBlockVariables`:
const deletePersonalProgramBlockVars: DeletePersonalProgramBlockVariables = {
  id: ..., 
};

// Call the `deletePersonalProgramBlockRef()` function to get a reference to the mutation.
const ref = deletePersonalProgramBlockRef(deletePersonalProgramBlockVars);
// Variables can be defined inline as well.
const ref = deletePersonalProgramBlockRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePersonalProgramBlockRef(dataConnect, deletePersonalProgramBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.personalProgramBlock_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlock_delete);
});
```

## CreatePersonalReusableBlock
You can execute the `CreatePersonalReusableBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createPersonalReusableBlock(vars: CreatePersonalReusableBlockVariables): MutationPromise<CreatePersonalReusableBlockData, CreatePersonalReusableBlockVariables>;

interface CreatePersonalReusableBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePersonalReusableBlockVariables): MutationRef<CreatePersonalReusableBlockData, CreatePersonalReusableBlockVariables>;
}
export const createPersonalReusableBlockRef: CreatePersonalReusableBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPersonalReusableBlock(dc: DataConnect, vars: CreatePersonalReusableBlockVariables): MutationPromise<CreatePersonalReusableBlockData, CreatePersonalReusableBlockVariables>;

interface CreatePersonalReusableBlockRef {
  ...
  (dc: DataConnect, vars: CreatePersonalReusableBlockVariables): MutationRef<CreatePersonalReusableBlockData, CreatePersonalReusableBlockVariables>;
}
export const createPersonalReusableBlockRef: CreatePersonalReusableBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPersonalReusableBlockRef:
```typescript
const name = createPersonalReusableBlockRef.operationName;
console.log(name);
```

### Variables
The `CreatePersonalReusableBlock` mutation requires an argument of type `CreatePersonalReusableBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreatePersonalReusableBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePersonalReusableBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePersonalReusableBlockData {
  personalReusableBlock_insert: PersonalReusableBlock_Key;
}
```
### Using `CreatePersonalReusableBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPersonalReusableBlock, CreatePersonalReusableBlockVariables } from '@church-central/dataconnect';

// The `CreatePersonalReusableBlock` mutation requires an argument of type `CreatePersonalReusableBlockVariables`:
const createPersonalReusableBlockVars: CreatePersonalReusableBlockVariables = {
  title: ..., 
  description: ..., // optional
  time: ..., 
  endTime: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `createPersonalReusableBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPersonalReusableBlock(createPersonalReusableBlockVars);
// Variables can be defined inline as well.
const { data } = await createPersonalReusableBlock({ title: ..., description: ..., time: ..., endTime: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPersonalReusableBlock(dataConnect, createPersonalReusableBlockVars);

console.log(data.personalReusableBlock_insert);

// Or, you can use the `Promise` API.
createPersonalReusableBlock(createPersonalReusableBlockVars).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlock_insert);
});
```

### Using `CreatePersonalReusableBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPersonalReusableBlockRef, CreatePersonalReusableBlockVariables } from '@church-central/dataconnect';

// The `CreatePersonalReusableBlock` mutation requires an argument of type `CreatePersonalReusableBlockVariables`:
const createPersonalReusableBlockVars: CreatePersonalReusableBlockVariables = {
  title: ..., 
  description: ..., // optional
  time: ..., 
  endTime: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `createPersonalReusableBlockRef()` function to get a reference to the mutation.
const ref = createPersonalReusableBlockRef(createPersonalReusableBlockVars);
// Variables can be defined inline as well.
const ref = createPersonalReusableBlockRef({ title: ..., description: ..., time: ..., endTime: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPersonalReusableBlockRef(dataConnect, createPersonalReusableBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.personalReusableBlock_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlock_insert);
});
```

## DeletePersonalReusableBlock
You can execute the `DeletePersonalReusableBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deletePersonalReusableBlock(vars: DeletePersonalReusableBlockVariables): MutationPromise<DeletePersonalReusableBlockData, DeletePersonalReusableBlockVariables>;

interface DeletePersonalReusableBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePersonalReusableBlockVariables): MutationRef<DeletePersonalReusableBlockData, DeletePersonalReusableBlockVariables>;
}
export const deletePersonalReusableBlockRef: DeletePersonalReusableBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePersonalReusableBlock(dc: DataConnect, vars: DeletePersonalReusableBlockVariables): MutationPromise<DeletePersonalReusableBlockData, DeletePersonalReusableBlockVariables>;

interface DeletePersonalReusableBlockRef {
  ...
  (dc: DataConnect, vars: DeletePersonalReusableBlockVariables): MutationRef<DeletePersonalReusableBlockData, DeletePersonalReusableBlockVariables>;
}
export const deletePersonalReusableBlockRef: DeletePersonalReusableBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePersonalReusableBlockRef:
```typescript
const name = deletePersonalReusableBlockRef.operationName;
console.log(name);
```

### Variables
The `DeletePersonalReusableBlock` mutation requires an argument of type `DeletePersonalReusableBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePersonalReusableBlockVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePersonalReusableBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePersonalReusableBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePersonalReusableBlockData {
  personalReusableBlock_delete?: PersonalReusableBlock_Key | null;
}
```
### Using `DeletePersonalReusableBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePersonalReusableBlock, DeletePersonalReusableBlockVariables } from '@church-central/dataconnect';

// The `DeletePersonalReusableBlock` mutation requires an argument of type `DeletePersonalReusableBlockVariables`:
const deletePersonalReusableBlockVars: DeletePersonalReusableBlockVariables = {
  id: ..., 
};

// Call the `deletePersonalReusableBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePersonalReusableBlock(deletePersonalReusableBlockVars);
// Variables can be defined inline as well.
const { data } = await deletePersonalReusableBlock({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePersonalReusableBlock(dataConnect, deletePersonalReusableBlockVars);

console.log(data.personalReusableBlock_delete);

// Or, you can use the `Promise` API.
deletePersonalReusableBlock(deletePersonalReusableBlockVars).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlock_delete);
});
```

### Using `DeletePersonalReusableBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePersonalReusableBlockRef, DeletePersonalReusableBlockVariables } from '@church-central/dataconnect';

// The `DeletePersonalReusableBlock` mutation requires an argument of type `DeletePersonalReusableBlockVariables`:
const deletePersonalReusableBlockVars: DeletePersonalReusableBlockVariables = {
  id: ..., 
};

// Call the `deletePersonalReusableBlockRef()` function to get a reference to the mutation.
const ref = deletePersonalReusableBlockRef(deletePersonalReusableBlockVars);
// Variables can be defined inline as well.
const ref = deletePersonalReusableBlockRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePersonalReusableBlockRef(dataConnect, deletePersonalReusableBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.personalReusableBlock_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlock_delete);
});
```

## UpdatePersonalReusableBlock
You can execute the `UpdatePersonalReusableBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updatePersonalReusableBlock(vars: UpdatePersonalReusableBlockVariables): MutationPromise<UpdatePersonalReusableBlockData, UpdatePersonalReusableBlockVariables>;

interface UpdatePersonalReusableBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePersonalReusableBlockVariables): MutationRef<UpdatePersonalReusableBlockData, UpdatePersonalReusableBlockVariables>;
}
export const updatePersonalReusableBlockRef: UpdatePersonalReusableBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePersonalReusableBlock(dc: DataConnect, vars: UpdatePersonalReusableBlockVariables): MutationPromise<UpdatePersonalReusableBlockData, UpdatePersonalReusableBlockVariables>;

interface UpdatePersonalReusableBlockRef {
  ...
  (dc: DataConnect, vars: UpdatePersonalReusableBlockVariables): MutationRef<UpdatePersonalReusableBlockData, UpdatePersonalReusableBlockVariables>;
}
export const updatePersonalReusableBlockRef: UpdatePersonalReusableBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePersonalReusableBlockRef:
```typescript
const name = updatePersonalReusableBlockRef.operationName;
console.log(name);
```

### Variables
The `UpdatePersonalReusableBlock` mutation requires an argument of type `UpdatePersonalReusableBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdatePersonalReusableBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePersonalReusableBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePersonalReusableBlockData {
  personalReusableBlock_update?: PersonalReusableBlock_Key | null;
}
```
### Using `UpdatePersonalReusableBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePersonalReusableBlock, UpdatePersonalReusableBlockVariables } from '@church-central/dataconnect';

// The `UpdatePersonalReusableBlock` mutation requires an argument of type `UpdatePersonalReusableBlockVariables`:
const updatePersonalReusableBlockVars: UpdatePersonalReusableBlockVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
  time: ..., 
  endTime: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `updatePersonalReusableBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePersonalReusableBlock(updatePersonalReusableBlockVars);
// Variables can be defined inline as well.
const { data } = await updatePersonalReusableBlock({ id: ..., title: ..., description: ..., time: ..., endTime: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePersonalReusableBlock(dataConnect, updatePersonalReusableBlockVars);

console.log(data.personalReusableBlock_update);

// Or, you can use the `Promise` API.
updatePersonalReusableBlock(updatePersonalReusableBlockVars).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlock_update);
});
```

### Using `UpdatePersonalReusableBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePersonalReusableBlockRef, UpdatePersonalReusableBlockVariables } from '@church-central/dataconnect';

// The `UpdatePersonalReusableBlock` mutation requires an argument of type `UpdatePersonalReusableBlockVariables`:
const updatePersonalReusableBlockVars: UpdatePersonalReusableBlockVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
  time: ..., 
  endTime: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `updatePersonalReusableBlockRef()` function to get a reference to the mutation.
const ref = updatePersonalReusableBlockRef(updatePersonalReusableBlockVars);
// Variables can be defined inline as well.
const ref = updatePersonalReusableBlockRef({ id: ..., title: ..., description: ..., time: ..., endTime: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePersonalReusableBlockRef(dataConnect, updatePersonalReusableBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.personalReusableBlock_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlock_update);
});
```

## AssignPersonalProgramBlock
You can execute the `AssignPersonalProgramBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
assignPersonalProgramBlock(vars: AssignPersonalProgramBlockVariables): MutationPromise<AssignPersonalProgramBlockData, AssignPersonalProgramBlockVariables>;

interface AssignPersonalProgramBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignPersonalProgramBlockVariables): MutationRef<AssignPersonalProgramBlockData, AssignPersonalProgramBlockVariables>;
}
export const assignPersonalProgramBlockRef: AssignPersonalProgramBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignPersonalProgramBlock(dc: DataConnect, vars: AssignPersonalProgramBlockVariables): MutationPromise<AssignPersonalProgramBlockData, AssignPersonalProgramBlockVariables>;

interface AssignPersonalProgramBlockRef {
  ...
  (dc: DataConnect, vars: AssignPersonalProgramBlockVariables): MutationRef<AssignPersonalProgramBlockData, AssignPersonalProgramBlockVariables>;
}
export const assignPersonalProgramBlockRef: AssignPersonalProgramBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignPersonalProgramBlockRef:
```typescript
const name = assignPersonalProgramBlockRef.operationName;
console.log(name);
```

### Variables
The `AssignPersonalProgramBlock` mutation requires an argument of type `AssignPersonalProgramBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AssignPersonalProgramBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignPersonalProgramBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignPersonalProgramBlockData {
  personalProgramBlock_insert: PersonalProgramBlock_Key;
}
```
### Using `AssignPersonalProgramBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignPersonalProgramBlock, AssignPersonalProgramBlockVariables } from '@church-central/dataconnect';

// The `AssignPersonalProgramBlock` mutation requires an argument of type `AssignPersonalProgramBlockVariables`:
const assignPersonalProgramBlockVars: AssignPersonalProgramBlockVariables = {
  userId: ..., 
  assignedBy: ..., 
  date: ..., 
  time: ..., 
  endTime: ..., // optional
  title: ..., 
  description: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `assignPersonalProgramBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignPersonalProgramBlock(assignPersonalProgramBlockVars);
// Variables can be defined inline as well.
const { data } = await assignPersonalProgramBlock({ userId: ..., assignedBy: ..., date: ..., time: ..., endTime: ..., title: ..., description: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignPersonalProgramBlock(dataConnect, assignPersonalProgramBlockVars);

console.log(data.personalProgramBlock_insert);

// Or, you can use the `Promise` API.
assignPersonalProgramBlock(assignPersonalProgramBlockVars).then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlock_insert);
});
```

### Using `AssignPersonalProgramBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignPersonalProgramBlockRef, AssignPersonalProgramBlockVariables } from '@church-central/dataconnect';

// The `AssignPersonalProgramBlock` mutation requires an argument of type `AssignPersonalProgramBlockVariables`:
const assignPersonalProgramBlockVars: AssignPersonalProgramBlockVariables = {
  userId: ..., 
  assignedBy: ..., 
  date: ..., 
  time: ..., 
  endTime: ..., // optional
  title: ..., 
  description: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `assignPersonalProgramBlockRef()` function to get a reference to the mutation.
const ref = assignPersonalProgramBlockRef(assignPersonalProgramBlockVars);
// Variables can be defined inline as well.
const ref = assignPersonalProgramBlockRef({ userId: ..., assignedBy: ..., date: ..., time: ..., endTime: ..., title: ..., description: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignPersonalProgramBlockRef(dataConnect, assignPersonalProgramBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.personalProgramBlock_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.personalProgramBlock_insert);
});
```

## AssignPersonalReusableBlock
You can execute the `AssignPersonalReusableBlock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
assignPersonalReusableBlock(vars: AssignPersonalReusableBlockVariables): MutationPromise<AssignPersonalReusableBlockData, AssignPersonalReusableBlockVariables>;

interface AssignPersonalReusableBlockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignPersonalReusableBlockVariables): MutationRef<AssignPersonalReusableBlockData, AssignPersonalReusableBlockVariables>;
}
export const assignPersonalReusableBlockRef: AssignPersonalReusableBlockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignPersonalReusableBlock(dc: DataConnect, vars: AssignPersonalReusableBlockVariables): MutationPromise<AssignPersonalReusableBlockData, AssignPersonalReusableBlockVariables>;

interface AssignPersonalReusableBlockRef {
  ...
  (dc: DataConnect, vars: AssignPersonalReusableBlockVariables): MutationRef<AssignPersonalReusableBlockData, AssignPersonalReusableBlockVariables>;
}
export const assignPersonalReusableBlockRef: AssignPersonalReusableBlockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignPersonalReusableBlockRef:
```typescript
const name = assignPersonalReusableBlockRef.operationName;
console.log(name);
```

### Variables
The `AssignPersonalReusableBlock` mutation requires an argument of type `AssignPersonalReusableBlockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AssignPersonalReusableBlock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignPersonalReusableBlockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignPersonalReusableBlockData {
  personalReusableBlock_insert: PersonalReusableBlock_Key;
}
```
### Using `AssignPersonalReusableBlock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignPersonalReusableBlock, AssignPersonalReusableBlockVariables } from '@church-central/dataconnect';

// The `AssignPersonalReusableBlock` mutation requires an argument of type `AssignPersonalReusableBlockVariables`:
const assignPersonalReusableBlockVars: AssignPersonalReusableBlockVariables = {
  userId: ..., 
  assignedBy: ..., 
  title: ..., 
  description: ..., // optional
  time: ..., 
  endTime: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `assignPersonalReusableBlock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignPersonalReusableBlock(assignPersonalReusableBlockVars);
// Variables can be defined inline as well.
const { data } = await assignPersonalReusableBlock({ userId: ..., assignedBy: ..., title: ..., description: ..., time: ..., endTime: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignPersonalReusableBlock(dataConnect, assignPersonalReusableBlockVars);

console.log(data.personalReusableBlock_insert);

// Or, you can use the `Promise` API.
assignPersonalReusableBlock(assignPersonalReusableBlockVars).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlock_insert);
});
```

### Using `AssignPersonalReusableBlock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignPersonalReusableBlockRef, AssignPersonalReusableBlockVariables } from '@church-central/dataconnect';

// The `AssignPersonalReusableBlock` mutation requires an argument of type `AssignPersonalReusableBlockVariables`:
const assignPersonalReusableBlockVars: AssignPersonalReusableBlockVariables = {
  userId: ..., 
  assignedBy: ..., 
  title: ..., 
  description: ..., // optional
  time: ..., 
  endTime: ..., // optional
  location: ..., // optional
  category: ..., // optional
  type: ..., // optional
  hours: ..., // optional
  dressCode: ..., // optional
};

// Call the `assignPersonalReusableBlockRef()` function to get a reference to the mutation.
const ref = assignPersonalReusableBlockRef(assignPersonalReusableBlockVars);
// Variables can be defined inline as well.
const ref = assignPersonalReusableBlockRef({ userId: ..., assignedBy: ..., title: ..., description: ..., time: ..., endTime: ..., location: ..., category: ..., type: ..., hours: ..., dressCode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignPersonalReusableBlockRef(dataConnect, assignPersonalReusableBlockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.personalReusableBlock_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.personalReusableBlock_insert);
});
```

