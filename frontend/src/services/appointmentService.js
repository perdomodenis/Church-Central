import { rtdb } from './firebase';
import { ref, push, get, set, update } from 'firebase/database';

// Get all pending appointment requests
export const getPendingAppointments = async () => {
  try {
    const snapshot = await get(ref(rtdb, 'appointmentRequests'));
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    return Object.keys(data)
      .map(id => ({
        id,
        ...data[id]
      }))
      .filter(app => app.status === 'pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// Get approved appointments
export const getApprovedAppointments = async () => {
  try {
    const snapshot = await get(ref(rtdb, 'appointmentRequests'));
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    return Object.keys(data)
      .map(id => ({
        id,
        ...data[id]
      }))
      .filter(app => app.status === 'approved')
      .sort((a, b) => new Date(b.decidedAt) - new Date(a.decidedAt));
  } catch (error) {
    console.error('Error fetching approved appointments:', error);
    return [];
  }
};

// Get rejected appointments
export const getRejectedAppointments = async () => {
  try {
    const snapshot = await get(ref(rtdb, 'appointmentRequests'));
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    return Object.keys(data)
      .map(id => ({
        id,
        ...data[id]
      }))
      .filter(app => app.status === 'rejected')
      .sort((a, b) => new Date(b.decidedAt) - new Date(a.decidedAt));
  } catch (error) {
    console.error('Error fetching rejected appointments:', error);
    return [];
  }
};

// Create a new appointment request
export const createAppointmentRequest = async (requesterName, requesterEmail, staff, date, time, reason) => {
  try {
    const appointmentRef = ref(rtdb, 'appointmentRequests');
    const newAppointment = await push(appointmentRef, {
      requester: requesterName,
      requesterEmail,
      staff,
      date,
      time,
      reason,
      type: 'Consultation',
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    return newAppointment.key;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Approve an appointment
export const approveAppointment = async (appointmentId, approvedBy) => {
  try {
    await update(ref(rtdb, `appointmentRequests/${appointmentId}`), {
      status: 'approved',
      approvedBy,
      decidedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error approving appointment:', error);
    throw error;
  }
};

// Reject an appointment
export const rejectAppointment = async (appointmentId, rejectedBy, reason) => {
  try {
    await update(ref(rtdb, `appointmentRequests/${appointmentId}`), {
      status: 'rejected',
      rejectedBy,
      rejectionReason: reason,
      decidedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    throw error;
  }
};
