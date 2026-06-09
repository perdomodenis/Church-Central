import { dataConnect } from './firebase';
import { 
  listPendingAppointments, 
  listApprovedAppointments, 
  listRejectedAppointments,
  createAppointmentRequest as dbCreateAppointment,
  approveAppointment as dbApproveAppointment,
  rejectAppointment as dbRejectAppointment
} from '../lib/dataconnect';

// Get all pending appointment requests
export const getPendingAppointments = async () => {
  try {
    const response = await listPendingAppointments(dataConnect);
    return response.data.appointmentRequests || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// Get approved appointments
export const getApprovedAppointments = async () => {
  try {
    const response = await listApprovedAppointments(dataConnect);
    return response.data.appointmentRequests || [];
  } catch (error) {
    console.error('Error fetching approved appointments:', error);
    return [];
  }
};

// Get rejected appointments
export const getRejectedAppointments = async () => {
  try {
    const response = await listRejectedAppointments(dataConnect);
    return response.data.appointmentRequests || [];
  } catch (error) {
    console.error('Error fetching rejected appointments:', error);
    return [];
  }
};

// Create a new appointment request
export const createAppointmentRequest = async (requesterName, requesterEmail, staff, leaderUid, paUid, slots, reason) => {
  try {
    const response = await dbCreateAppointment(dataConnect, {
      requester: requesterName,
      requesterEmail,
      staff,
      leaderUid,
      paUid: paUid || null,
      date1: slots[0].date,
      time1: slots[0].time,
      date2: slots[1].date,
      time2: slots[1].time,
      date3: slots[2].date,
      time3: slots[2].time,
      reason,
      type: 'Consultation'
    });
    return response.data.appointmentRequest_insert.id;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Approve an appointment
export const approveAppointment = async (appointmentId, approvedBy, selectedSlot, date, time) => {
  try {
    await dbApproveAppointment(dataConnect, {
      id: appointmentId,
      approvedBy,
      selectedSlot,
      date,
      time
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
    await dbRejectAppointment(dataConnect, {
      id: appointmentId,
      rejectedBy,
      rejectionReason: reason
    });
    return true;
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    throw error;
  }
};

