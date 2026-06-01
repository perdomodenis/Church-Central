# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUserProfile, createAnnouncement, createEvent, registerForEvent, cancelEventRegistration, createBaptism, registerForBaptism, cancelBaptismRegistration, deleteEvent, deleteBaptismEvent } from '@church-central/dataconnect';


// Operation UpsertUserProfile:  For variables, look at type UpsertUserProfileVars in ../index.d.ts
const { data } = await UpsertUserProfile(dataConnect, upsertUserProfileVars);

// Operation CreateAnnouncement:  For variables, look at type CreateAnnouncementVars in ../index.d.ts
const { data } = await CreateAnnouncement(dataConnect, createAnnouncementVars);

// Operation CreateEvent:  For variables, look at type CreateEventVars in ../index.d.ts
const { data } = await CreateEvent(dataConnect, createEventVars);

// Operation RegisterForEvent:  For variables, look at type RegisterForEventVars in ../index.d.ts
const { data } = await RegisterForEvent(dataConnect, registerForEventVars);

// Operation CancelEventRegistration:  For variables, look at type CancelEventRegistrationVars in ../index.d.ts
const { data } = await CancelEventRegistration(dataConnect, cancelEventRegistrationVars);

// Operation CreateBaptism:  For variables, look at type CreateBaptismVars in ../index.d.ts
const { data } = await CreateBaptism(dataConnect, createBaptismVars);

// Operation RegisterForBaptism:  For variables, look at type RegisterForBaptismVars in ../index.d.ts
const { data } = await RegisterForBaptism(dataConnect, registerForBaptismVars);

// Operation CancelBaptismRegistration:  For variables, look at type CancelBaptismRegistrationVars in ../index.d.ts
const { data } = await CancelBaptismRegistration(dataConnect, cancelBaptismRegistrationVars);

// Operation DeleteEvent:  For variables, look at type DeleteEventVars in ../index.d.ts
const { data } = await DeleteEvent(dataConnect, deleteEventVars);

// Operation DeleteBaptismEvent:  For variables, look at type DeleteBaptismEventVars in ../index.d.ts
const { data } = await DeleteBaptismEvent(dataConnect, deleteBaptismEventVars);


```