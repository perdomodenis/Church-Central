import { rtdb } from './firebase';
import { ref, set, get, update, push } from 'firebase/database';
import { updateUserProfile } from './userService';

export const requestDepartmentJoin = async (userId, userName, departmentName) => {
  try {
    const requestsRef = ref(rtdb, 'departmentRequests');
    const newRequestRef = push(requestsRef);
    
    await set(newRequestRef, {
      id: newRequestRef.key,
      userId,
      userName,
      departmentName,
      status: 'pending',
      requestedAt: new Date().toISOString()
    });

    return newRequestRef.key;
  } catch (error) {
    console.error('Error requesting department join:', error);
    throw error;
  }
};

export const getDepartmentRequests = async () => {
  try {
    const requestsRef = ref(rtdb, 'departmentRequests');
    const snapshot = await get(requestsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data).sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    }
    return [];
  } catch (error) {
    console.error('Error fetching department requests:', error);
    return [];
  }
};

export const approveDepartmentRequest = async (requestId, userId, departmentName, approvedBy) => {
  try {
    // Update the request status
    const requestRef = ref(rtdb, `departmentRequests/${requestId}`);
    await update(requestRef, {
      status: 'approved',
      approvedBy,
      decidedAt: new Date().toISOString()
    });

    // Actually update the user's profile to assign them to the department
    await updateUserProfile(userId, { dept: departmentName });

    return true;
  } catch (error) {
    console.error('Error approving department request:', error);
    throw error;
  }
};

export const rejectDepartmentRequest = async (requestId, rejectedBy) => {
  try {
    const requestRef = ref(rtdb, `departmentRequests/${requestId}`);
    await update(requestRef, {
      status: 'rejected',
      rejectedBy,
      decidedAt: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error rejecting department request:', error);
    throw error;
  }
};
