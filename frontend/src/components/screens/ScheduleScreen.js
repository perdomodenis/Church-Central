import React, { useState, useEffect } from 'react';
import { getAllEvents, deleteEvent } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import AddEventModal from './AddEventModal';
import { formatEventDate, formatEventTime } from '../../services/calendarService';
import { useLanguage } from '../../context/LanguageContext';
import {
  listProgramBlocks,
  listReusableBlocks,
  createProgramBlock,
  deleteProgramBlock,
  createReusableBlock,
  deleteReusableBlock,
  updateReusableBlock,
  listPersonalProgramBlocks,
  listPersonalReusableBlocks,
  createPersonalProgramBlock,
  assignPersonalProgramBlock,
  listMembers,
  listAssignedPersonalProgramBlocks,
  assignPersonalReusableBlock,
  deletePersonalProgramBlock,
  createPersonalReusableBlock,
  deletePersonalReusableBlock,
  updatePersonalReusableBlock
} from '../../lib/dataconnect';

const isValidEvent = (event) => {
  return event.title && event.title !== 'TBD' && event.startTime && event.startTime !== 'TBD';
};

// Static department attendance roster
const DEPARTMENT_MEMBERS = [
  { id: 1, name: 'Alice Johnson', role: 'Team Lead', present: true },
  { id: 2, name: 'Bob Smith', role: 'Member', present: false },
  { id: 3, name: 'Charlie Davis', role: 'Member', present: true },
  { id: 4, name: 'Diana Evans', role: 'Coordinator', present: true },
  { id: 5, name: 'Evan Harris', role: 'Member', present: false },
];

const getMinutesSinceMidnight = (timeStr) => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const convertTime24To12Hr = (time24) => {
  if (!time24) return '';
  try {
    const dateStr = `2026-01-01T${time24}:00`;
    const tempDate = new Date(dateStr);
    if (isNaN(tempDate.getTime())) return '';
    const formatted = formatEventTime(tempDate, tempDate);
    if (formatted && formatted !== 'TBD') {
      return formatted.split(' - ')[0];
    }
  } catch (e) {
    console.error('Error converting time:', e);
  }
  return '';
};

const ScheduleScreen = ({ user: userProp, refreshKey, onRefresh, openAddEventOnMount, onCloseAddEventOnMount }) => {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('me'); // 'me', 'church', 'department'

  // Dynamic program states
  const [programBlocks, setProgramBlocks] = useState([]);
  const [personalProgramBlocks, setPersonalProgramBlocks] = useState([]);
  const [personalReusableBlocks, setPersonalReusableBlocks] = useState([]);
  const [reusableBlocks, setReusableBlocks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD local format
  const [loadingProgram, setLoadingProgram] = useState(false);
  const [showCreateProgramModal, setShowCreateProgramModal] = useState(false);
  const [newProgramDate, setNewProgramDate] = useState('');
  const [formBlocks, setFormBlocks] = useState([{ time: '', title: '', minister: '', saveAsReusable: false }]);
  const [showManageTemplates, setShowManageTemplates] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [editTemplateForm, setEditTemplateForm] = useState({ time: '', title: '', minister: '' });
  const [newTemplateForm, setNewTemplateForm] = useState({ time: '', title: '', minister: '' });
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const [isPersonalBuilder, setIsPersonalBuilder] = useState(false);
  const [members, setMembers] = useState([]);
  const [assignedBlocks, setAssignedBlocks] = useState([]);
  const [assignedToUsers, setAssignedToUsers] = useState([]);
  const [alsoAssignToSelf, setAlsoAssignToSelf] = useState(false);
  
  const personalSortedBlocks = personalProgramBlocks
    .filter(b => b.date === selectedDate)
    .sort((a, b) => getMinutesSinceMidnight(a.time) - getMinutesSinceMidnight(b.time));

  const HIERARCHY = ['member', 'co-leader', 'leader', 'deacon', 'pastor', 'reverend', 'bishop'];
  const getRank = (position) => {
    const normalized = (position || 'member').toLowerCase();
    const idx = HIERARCHY.indexOf(normalized);
    return idx >= 0 ? idx : 0;
  };
  const myRank = getRank(userProp?.position);

  const subordinates = members.filter(m => getRank(m.position) < myRank);
  console.log("SCHEDULE DEBUG:", { myRank, memberCount: members.length, subordinatesCount: subordinates.length, members });


  useEffect(() => {
    fetchEvents();
    fetchPersonalProgramData();
  }, [refreshKey]);

  useEffect(() => {
    if (activeTab === 'church') {
      fetchProgramData();
    }
  }, [activeTab, refreshKey]);

  useEffect(() => {
    if (openAddEventOnMount) {
      setShowAddModal(true);
      if (onCloseAddEventOnMount) onCloseAddEventOnMount();
    }
  }, [openAddEventOnMount]);

  const fetchEvents = async () => {
    setLoading(true);
    const allEvents = await getAllEvents();
    setEvents(allEvents);
    setLoading(false);
  };

  const fetchPersonalProgramData = async () => {
    try {
      const [blocksRes, reusableRes, membersRes, assignedRes] = await Promise.all([
        listPersonalProgramBlocks({ fetchPolicy: 'SERVER_ONLY' }),
        listPersonalReusableBlocks({ fetchPolicy: 'SERVER_ONLY' }),
        listMembers({ fetchPolicy: 'SERVER_ONLY' }),
        listAssignedPersonalProgramBlocks({ fetchPolicy: 'SERVER_ONLY' })
      ]);
      setPersonalProgramBlocks(blocksRes.data?.personalProgramBlocks || []);
      setPersonalReusableBlocks(reusableRes.data?.personalReusableBlocks || []);
      setMembers(membersRes?.data?.users || []);
      setAssignedBlocks(assignedRes?.data?.personalProgramBlocks || []);
    } catch (err) {
      console.error('Error fetching personal program data:', err);
    }
  };

  const fetchProgramData = async () => {
    setLoadingProgram(true);
    try {
      const [blocksRes, reusableRes] = await Promise.all([
        listProgramBlocks({ fetchPolicy: 'SERVER_ONLY' }),
        listReusableBlocks({ fetchPolicy: 'SERVER_ONLY' })
      ]);
      setProgramBlocks(blocksRes.data?.programBlocks || []);
      setReusableBlocks(reusableRes.data?.reusableBlocks || []);
    } catch (err) {
      console.error('Error fetching church program data:', err);
    } finally {
      setLoadingProgram(false);
    }
  };

  const handleAddEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
  };

  const handleDeleteEvent = async (eventId, createdBy) => {
    if (createdBy !== authUser?.uid) {
      alert(t('onlyDeleteOwnEvents'));
      return;
    }

    if (window.confirm(t('deleteEventConfirm'))) {
      try {
        await deleteEvent(eventId);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } catch (error) {
        alert(t('errorDeletingEvent') + error.message);
      }
    }
  };

  // Sort blocks for the currently selected date
  const sortedBlocks = programBlocks
    .filter(b => b.date === selectedDate)
    .sort((a, b) => getMinutesSinceMidnight(a.time) - getMinutesSinceMidnight(b.time));

  // Determine which block is currently ongoing (only active on today's local date)
  const getOngoingBlockId = (blocks) => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA');
    if (selectedDate !== todayStr) return null;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (let i = 0; i < blocks.length; i++) {
      const item = blocks[i];
      const nextItem = blocks[i + 1];
      const start = getMinutesSinceMidnight(item.time);
      const end = nextItem ? getMinutesSinceMidnight(nextItem.time) : start + 60; // defaults to 60 mins duration for the last item
      if (currentMinutes >= start && currentMinutes < end) {
        return item.id;
      }
    }
    return null;
  };

  const ongoingId = getOngoingBlockId(sortedBlocks);
  const isServiceOffline = selectedDate === new Date().toLocaleDateString('en-CA') && ongoingId === null;
  const canCreateProgram = (userProp?.accessLevel || 1) >= 3 || userProp?.authorizedCreateProgram === true;

  const handleSelectReusable = (index, reusableId) => {
    if (!reusableId) return;
    const block = reusableBlocks.find(b => b.id === reusableId);
    if (block) {
      const updated = [...formBlocks];
      updated[index] = {
        ...updated[index],
        time: block.time || '',
        title: block.title || '',
        minister: block.minister || ''
      };
      setFormBlocks(updated);
    }
  };

  const handleAddFormBlock = () => {
    setFormBlocks(prev => [...prev, { time: '', title: '', minister: '', saveAsReusable: false }]);
  };

  const handleSaveProgram = async () => {
    if (isSavingProgram) return;

    if (!newProgramDate) {
      alert('Please select a date.');
      return;
    }

    // Check for duplicate times
    const times = new Set();
    for (let i = 0; i < formBlocks.length; i++) {
      const b = formBlocks[i];
      if (!b.time.trim() || !b.title.trim() || !b.minister.trim()) {
        alert(`Please fill in Time, Title, and Minister for Block #${i + 1}.`);
        return;
      }
      const normalizedTime = b.time.trim().toLowerCase();
      if (times.has(normalizedTime)) {
        alert(`Duplicate time found: "${b.time.trim()}". Each block must have a unique time.`);
        return;
      }
      times.add(normalizedTime);
    }

    setIsSavingProgram(true);
    try {
      // 1. Delete all existing program blocks for the selected date
      const blocksToDelete = isPersonalBuilder 
        ? personalProgramBlocks.filter(b => b.date === newProgramDate)
        : programBlocks.filter(b => b.date === newProgramDate);
      if (blocksToDelete.length > 0) {
        await Promise.all(blocksToDelete.map(b => 
          isPersonalBuilder ? deletePersonalProgramBlock({ id: b.id }) : deleteProgramBlock({ id: b.id })
        ));
      }

      // 2. Create the new program blocks
      if (isPersonalBuilder) {
        for (const b of formBlocks) {
          if (assignedToUsers.length > 0) {
            for (const uid of assignedToUsers) {
              await assignPersonalProgramBlock({
                userId: uid,
                assignedBy: userProp?.uid,
                date: newProgramDate,
                time: b.time.trim(),
                endTime: b.endTime ? b.endTime.trim() : null,
                title: b.title.trim(),
                description: b.minister.trim(),
                location: b.location ? b.location.trim() : null,
                category: b.category ? b.category.trim() : null,
                type: b.type ? b.type.trim() : null,
                hours: b.hours ? parseFloat(b.hours) : null,
                dressCode: b.dressCode ? b.dressCode.trim() : null
              });
            }
            if (alsoAssignToSelf) {
              await createPersonalProgramBlock({
                date: newProgramDate,
                time: b.time.trim(),
                endTime: b.endTime ? b.endTime.trim() : null,
                title: b.title.trim(),
                description: b.minister.trim(),
                location: b.location ? b.location.trim() : null,
                category: b.category ? b.category.trim() : null,
                type: b.type ? b.type.trim() : null,
                hours: b.hours ? parseFloat(b.hours) : null,
                dressCode: b.dressCode ? b.dressCode.trim() : null
              });
            }
          } else {
            await createPersonalProgramBlock({
              date: newProgramDate,
              time: b.time.trim(),
              endTime: b.endTime ? b.endTime.trim() : null,
              title: b.title.trim(),
              description: b.minister.trim(),
              location: b.location ? b.location.trim() : null,
              category: b.category ? b.category.trim() : null,
              type: b.type ? b.type.trim() : null,
              hours: b.hours ? parseFloat(b.hours) : null,
              dressCode: b.dressCode ? b.dressCode.trim() : null
            });
          }
        }
      } else {
        await Promise.all(formBlocks.map(b => 
          createProgramBlock({
            date: newProgramDate,
            time: b.time.trim(),
            title: b.title.trim(),
            minister: b.minister.trim()
          })
        ));
      }

      // 3. Create the new reusable blocks (if checked and they don't already exist)
      const reusablesToCreate = formBlocks.filter(b => b.saveAsReusable);
      if (reusablesToCreate.length > 0) {
        // Deduplicate new templates within the submitted list first
        const uniqueInForm = [];
        const seen = new Set();
        for (const b of reusablesToCreate) {
          const key = `${b.title.trim().toLowerCase()}|${b.minister.trim().toLowerCase()}|${b.time.trim().toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueInForm.push(b);
          }
        }

        const uniqueNewReusables = uniqueInForm.filter(newRb => {
          const titleNorm = newRb.title.trim().toLowerCase();
          const ministerNorm = newRb.minister.trim().toLowerCase();
          const timeNorm = newRb.time.trim().toLowerCase();
          const listToCheck = isPersonalBuilder ? personalReusableBlocks : reusableBlocks;
          return !listToCheck.some(rb => {
            const rbMinister = isPersonalBuilder ? rb.description : rb.minister;
            return rb.title.trim().toLowerCase() === titleNorm &&
            (rbMinister || '').trim().toLowerCase() === ministerNorm &&
            rb.time.trim().toLowerCase() === timeNorm;
          });
        });

        if (uniqueNewReusables.length > 0) {
          await Promise.all(uniqueNewReusables.map(b => 
            isPersonalBuilder
              ? createPersonalReusableBlock({
                  time: b.time.trim(),
                  endTime: b.endTime ? b.endTime.trim() : null,
                  title: b.title.trim(),
                  description: b.minister.trim(),
                  location: b.location ? b.location.trim() : null,
                  category: b.category ? b.category.trim() : null,
                  type: b.type ? b.type.trim() : null,
                  hours: b.hours ? parseFloat(b.hours) : null,
                  dressCode: b.dressCode ? b.dressCode.trim() : null
                })
              : createReusableBlock({
                  time: b.time.trim(),
                  title: b.title.trim(),
                  minister: b.minister.trim()
                })
          ));
        }
      }

      if (isPersonalBuilder) await fetchPersonalProgramData(); else await fetchProgramData();
      if (onRefresh) onRefresh();
      setShowCreateProgramModal(false);
      alert('Church program updated successfully!');
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program: ' + error.message);
    } finally {
      setIsSavingProgram(false);
    }
  };

  const handleOpenProgramModal = () => {
    setNewProgramDate(selectedDate);
    if (sortedBlocks.length > 0) {
      setFormBlocks(sortedBlocks.map(b => ({
        time: b.time,
        title: b.title,
        minister: b.minister,
        saveAsReusable: false
      })));
    } else {
      setFormBlocks([{ time: '', endTime: '', title: '', minister: '', location: '', category: 'Event', type: 'Personal', hours: '', dressCode: '', saveAsReusable: false, showDetails: false }]);
    }
    setIsPersonalBuilder(false);
    setAssignedToUsers([]);
      setAlsoAssignToSelf(false);
                    setShowCreateProgramModal(true);
  };

  const handleDeleteEntireProgram = async () => {
    if (!window.confirm(`Are you sure you want to delete the entire program for ${selectedDate}?`)) {
      return;
    }
    try {
      const blocksToDelete = programBlocks.filter(b => b.date === selectedDate);
      if (blocksToDelete.length > 0) {
        await Promise.all(blocksToDelete.map(b => deleteProgramBlock({ id: b.id })));
      }
      await fetchProgramData();
      if (onRefresh) onRefresh();
      alert('Church program deleted successfully!');
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program: ' + error.message);
    }
  };

  const handleSaveEditedTemplate = async (id) => {
    if (!editTemplateForm.time.trim() || !editTemplateForm.title.trim() || !editTemplateForm.minister.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    const titleNorm = editTemplateForm.title.trim().toLowerCase();
    const ministerNorm = editTemplateForm.minister.trim().toLowerCase();
    const timeNorm = editTemplateForm.time.trim().toLowerCase();
    const isDuplicate = reusableBlocks.some(rb => 
      rb.id !== id &&
      rb.title.trim().toLowerCase() === titleNorm &&
      rb.minister.trim().toLowerCase() === ministerNorm &&
      rb.time.trim().toLowerCase() === timeNorm
    );
    if (isDuplicate) {
      alert('A template with this title, minister, and time already exists.');
      return;
    }

    try {
      await updateReusableBlock({
        id,
        title: editTemplateForm.title.trim(),
        minister: editTemplateForm.minister.trim(),
        time: editTemplateForm.time.trim()
      });
      setEditingTemplateId(null);
      await fetchProgramData();
      alert('Template updated successfully!');
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template: ' + error.message);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }
    try {
      await deleteReusableBlock({ id });
      await fetchProgramData();
      alert('Template deleted successfully!');
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template: ' + error.message);
    }
  };

  const handleCreateTemplateDirectly = async () => {
    if (!newTemplateForm.time.trim() || !newTemplateForm.title.trim() || !newTemplateForm.minister.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    const titleNorm = newTemplateForm.title.trim().toLowerCase();
    const ministerNorm = newTemplateForm.minister.trim().toLowerCase();
    const timeNorm = newTemplateForm.time.trim().toLowerCase();
    const isDuplicate = reusableBlocks.some(rb => 
      rb.title.trim().toLowerCase() === titleNorm &&
      rb.minister.trim().toLowerCase() === ministerNorm &&
      rb.time.trim().toLowerCase() === timeNorm
    );
    if (isDuplicate) {
      alert('A template with this title, minister, and time already exists.');
      return;
    }

    try {
      await createReusableBlock({
        title: newTemplateForm.title.trim(),
        minister: newTemplateForm.minister.trim(),
        time: newTemplateForm.time.trim()
      });
      setNewTemplateForm({ time: '', title: '', minister: '' });
      await fetchProgramData();
      alert('Template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template: ' + error.message);
    }
  };

  const validEvents = events.filter(isValidEvent);
  const personalEvents = validEvents.filter(e => e.type !== 'Work Shift');
  const workShifts = validEvents.filter(e => e.type === 'Work Shift');
  const totalHours = workShifts.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);

  const renderTabContent = () => {
    if (activeTab === 'church') {
      return (
        <div style={{ marginTop: '16px' }}>
          {isServiceOffline && sortedBlocks.length > 0 && (
            <div style={{
              backgroundColor: '#fff8e1',
              color: '#b78103',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '16px',
              border: '1px solid #ffe082',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>ℹ️</span>
              <span>Church Service is currently offline (no program block matches the current local time).</span>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ margin: 0, color: '#111' }}>{t('upcomingServiceProgram')}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Selected Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.85rem',
                    color: '#333',
                    fontFamily: 'inherit',
                    fontWeight: '600',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
            {canCreateProgram && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleOpenProgramModal}
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(91, 63, 187, 0.2)',
                    transition: 'transform 0.1s, opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {sortedBlocks.length > 0 ? <span>✏️ Edit Program</span> : <span>+ Create Program</span>}
                </button>
                {sortedBlocks.length > 0 && (
                  <button
                    onClick={handleDeleteEntireProgram}
                    style={{
                      backgroundColor: '#fff0f0',
                      color: '#c62828',
                      border: '1px solid #ffcdd2',
                      borderRadius: '10px',
                      padding: '10px 16px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'transform 0.1s, opacity 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    🗑️ Delete Program
                  </button>
                )}
              </div>
            )}
          </div>

          {loadingProgram ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
              {t('loading') || 'Loading program...'}
            </div>
          ) : sortedBlocks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '16px',
              border: '1px dashed #ddd',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              📅 No program scheduled for this date.
              {canCreateProgram && (
                <div style={{ marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      setNewProgramDate(selectedDate);
                      setFormBlocks([{ time: '', endTime: '', title: '', minister: '', location: '', category: 'Event', type: 'Personal', hours: '', dressCode: '', saveAsReusable: false, showDetails: false }]);
                      setIsPersonalBuilder(true);
                  setAssignedToUsers([]);
      setAlsoAssignToSelf(false);
                    setShowCreateProgramModal(true);
                }}
                style={{
                      backgroundColor: 'white',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Create Program
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedBlocks.map((item) => {
                const isOngoing = item.id === ongoingId;
                return (
                  <div 
                    key={item.id} 
                    style={{ 
                      ...cardStyle, 
                      padding: '12px 16px', 
                      gap: '12px',
                      border: isOngoing ? '2px solid #4caf50' : '1px solid #f0f0f0',
                      backgroundColor: isOngoing ? '#f9fdfa' : 'white',
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontWeight: '700', color: isOngoing ? '#2e7d32' : 'var(--accent)', minWidth: '80px' }}>{item.time}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#111' }}>{item.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.minister}</div>
                    </div>
                    {isOngoing && (
                      <span style={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(46, 125, 50, 0.1)',
                        alignSelf: 'center'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#2e7d32',
                          display: 'inline-block'
                        }} />
                        Currently Ongoing
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'department') {
      return (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '16px', color: '#111' }}>{t('departmentMembers')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DEPARTMENT_MEMBERS.map(member => (
              <div key={member.id} style={{ ...cardStyle, padding: '12px 16px', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: member.present ? '#4caf50' : '#f44336'
                }} title={member.present ? t('present') : t('absent')} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#111' }}>{member.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{member.role}</div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: member.present ? '#4caf50' : '#f44336' }}>
                  {member.present ? t('present') : t('absent')}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default: 'me' tab
    const canAddSchedule = (userProp?.accessLevel || 1) >= 3;
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#111' }}>{t('mySchedule')}</h3>
            {totalHours > 0 && (
              <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>
                {t('totalHoursLogged')}<strong style={{ color: 'var(--accent)' }}>{totalHours}h</strong>
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => alert(t('testimonySentAlert'))}
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {t('submitTestimony')}
            </button>
            

            {canAddSchedule && (
              <button
                onClick={() => {
                  setNewProgramDate(selectedDate);
                  if (personalSortedBlocks.length > 0) {
                    setFormBlocks(personalSortedBlocks.map(b => ({
                      time: b.time,
                      endTime: b.endTime || '',
                      title: b.title,
                      minister: b.description || '',
                      location: b.location || '',
                      category: b.category || 'Event',
                      type: b.type || 'Personal',
                      hours: b.hours || '',
                      dressCode: b.dressCode || '',
                      saveAsReusable: false,
                      showDetails: false
                    })));
                  } else {
                    setFormBlocks([{ time: '', endTime: '', title: '', minister: '', location: '', category: 'Event', type: 'Personal', hours: '', dressCode: '', saveAsReusable: false, showDetails: false }]);
                  }
                  setIsPersonalBuilder(true);
                    setAssignedToUsers([]);
      setAlsoAssignToSelf(false);
                    setShowCreateProgramModal(true);
                  }}
                  style={{
                    background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}>
                + Build Blocks
              </button>
            )}

          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {assignedBlocks && assignedBlocks.filter(b => b.date === selectedDate).length > 0 && (
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned By Me</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(assignedBlocks.filter(b => b.date === selectedDate).reduce((acc, b) => {
                  if (!acc[b.time]) acc[b.time] = [];
                  acc[b.time].push(b);
                  return acc;
                }, {})).sort(([tA], [tB]) => tA.localeCompare(tB)).map(([time, blocks]) => (
                  <div key={time} style={{ border: '1px solid #e8e0ff', borderRadius: '12px', backgroundColor: '#faf8ff', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--accent)' }}>{time} — {blocks[0].title}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {blocks.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
                          <span style={{ fontWeight: '600', color: '#333' }}>{item.user?.first} {item.user?.last}</span>
                          <span style={{ fontSize: '0.78rem', color: '#888' }}>({item.user?.position || 'Member'})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {personalSortedBlocks.length > 0 && (
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>My Schedule Blocks</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {personalSortedBlocks.map((item) => (
                  <div key={item.id} style={{ ...cardStyle, padding: '12px 16px', gap: '12px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--accent)', minWidth: '80px' }}>{item.time}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#111' }}>{item.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.description}</div>
                      {item.location && <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '2px' }}>📍 {item.location}</div>}
                      {item.endTime && <div style={{ fontSize: '0.8rem', color: '#888' }}>End: {item.endTime}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
              {t('loadingEvents')}
            </div>
          ) : validEvents.length === 0 ? null : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {workShifts.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Obligatory Attendance</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {workShifts.map(event => renderEventCard(event))}
                  </div>
                </div>
              )}

              {personalEvents.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Group Meetings</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {personalEvents.map(event => renderEventCard(event))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && validEvents.length === 0 && personalSortedBlocks.length === 0 && (!assignedBlocks || assignedBlocks.filter(b => b.date === selectedDate).length === 0) && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
              {t('noEvents')} 📅
            </div>
          )}

        </div>
      </>
    );
  };

  const renderEventCard = (event) => {
    const dateInfo = formatEventDate(event.startTime);
    const timeInfo = formatEventTime(event.startTime, event.endTime);
    const canDelete = authUser?.uid === event.createdBy;

    const shouldShow = {
      time: timeInfo && timeInfo !== 'TBD' && !timeInfo.includes('Invalid'),
      location: event.location && event.location !== 'TBD',
      description: event.description && event.description !== 'TBD',
      category: event.category && event.category !== 'TBD'
    };

    return (
      <div key={event.id} style={cardStyle}>
        <div style={dateColumnStyle}>
          {dateInfo.day && dateInfo.day !== 'TBD' && (
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase' }}>
              {dateInfo.day}
            </span>
          )}
          {dateInfo.date && dateInfo.date !== 'TBD' && (
            <span style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: '1' }}>
              {dateInfo.date}
            </span>
          )}
          {dateInfo.month && dateInfo.month !== 'TBD' && (
            <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600' }}>
              {dateInfo.month}
            </span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#111' }}>{event.title}</h3>
              {event.createdByName && event.createdByName !== 'TBD' && (
                <span style={{ fontSize: '0.75rem', color: '#999' }}>{t('by')} {event.createdByName}</span>
              )}
            </div>
            {shouldShow.category && <span style={tagStyle}>{t(event.category.toLowerCase())}</span>}
          </div>

          {/* Formatted Event Type Indicators */}
          {event.type === 'Work Shift' ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '700', margin: '6px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>⚠️</span>
              <span>Obligatory attendance on {dateInfo.date} {dateInfo.month} at {timeInfo}</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '700', margin: '6px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>👥</span>
              <span>Group meeting at {timeInfo} on {dateInfo.date} {dateInfo.month}</span>
            </div>
          )}

          {shouldShow.time && (
            <div style={infoRowStyle}>
              <span style={{ fontSize: '0.9rem' }}>🕒</span>
              <span style={infoTextStyle}>{timeInfo}</span>
            </div>
          )}

          {shouldShow.location && (
            <div style={infoRowStyle}>
              <span style={{ fontSize: '0.9rem' }}>📍</span>
              <span style={infoTextStyle}>{event.location}</span>
            </div>
          )}

          {event.dressCode && (
            <div style={infoRowStyle}>
              <span style={{ fontSize: '0.9rem' }}>👔</span>
              <span style={infoTextStyle}>{t('dressCode')}: <strong style={{ color: 'var(--accent)' }}>{event.dressCode}</strong></span>
            </div>
          )}

          {shouldShow.description && (
            <div style={{ ...infoRowStyle, marginTop: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#555' }}>{event.description}</span>
            </div>
          )}

          {/* Event Links */}
          {(event.streamUrl || event.videoConferenceUrl) && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {event.streamUrl && (
                <a
                  href={event.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#fff0f0',
                    color: '#e53935',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>▶</span> {t('watchStream')}
                </a>
              )}
              {event.videoConferenceUrl && (
                <a
                  href={event.videoConferenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1e88e5',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>📹</span> {t('joinMeeting')}
                </a>
              )}
            </div>
          )}

          {canDelete && (
            <button
              onClick={() => handleDeleteEvent(event.id, event.createdBy)}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                backgroundColor: '#ffebee',
                color: '#c62828',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
              {t('delete')}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-screen" style={{ padding: '16px', paddingBottom: '80px' }}>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
        {['me', 'church', 'department'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : '#666',
              fontWeight: activeTab === tab ? '700' : '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {renderTabContent()}

      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onEventAdded={handleAddEvent}
          user={authUser}
        />
      )}

      {showCreateProgramModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
          overflowY: 'auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#111' }}>{isPersonalBuilder ? (personalSortedBlocks.length > 0 ? 'Edit Personal Blocks' : 'Build Personal Blocks') : (sortedBlocks.length > 0 ? 'Edit Church Program' : 'Create Church Program')}</h3>
              <button
                onClick={() => setShowCreateProgramModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
              >
                ×
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                
                
                {isPersonalBuilder && subordinates.length > 0 && (
                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f4f8', borderRadius: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '8px' }}>Assign to Subordinates (Optional)</label>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 0, marginBottom: '8px' }}>Select users to assign this schedule to them instead of yourself.</p>
                    
                    <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                      {Object.entries(subordinates.reduce((acc, sub) => {
                        const group = (sub.court || 'No Court') + ' - ' + (sub.dept || 'No Department');
                        if (!acc[group]) acc[group] = [];
                        acc[group].push(sub);
                        return acc;
                      }, {}))
                      .sort(([keyA], [keyB]) => {
                         const myGroup = (userProp?.court || 'No Court') + ' - ' + (userProp?.dept || 'No Department');
                         if (keyA === myGroup && keyB !== myGroup) return -1;
                         if (keyB === myGroup && keyA !== myGroup) return 1;
                         
                         const myCourtStr = (userProp?.court || 'No Court') + ' -';
                         const aIsMyCourt = keyA.startsWith(myCourtStr);
                         const bIsMyCourt = keyB.startsWith(myCourtStr);
                         
                         if (aIsMyCourt && !bIsMyCourt) return -1;
                         if (!aIsMyCourt && bIsMyCourt) return 1;
                         
                         return keyA.localeCompare(keyB);
                      })
                      .map(([groupKey, groupBlocks]) => {
                        const myGroup = (userProp?.court || 'No Court') + ' - ' + (userProp?.dept || 'No Department');
                        const myCourtStr = (userProp?.court || 'No Court') + ' -';
                        
                        return (
                        <details key={groupKey} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px', backgroundColor: 'white' }}>
                          <summary style={{ fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', outline: 'none', color: '#333' }}>
                            {groupKey === myGroup ? '📌 ' : ''}
                            {groupKey.startsWith(myCourtStr) && groupKey !== myGroup ? '📍 ' : ''}
                            {groupKey} ({groupBlocks.length} users)
                          </summary>
                          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                const groupUids = groupBlocks.map(g => g.uid);
                                const allSelected = groupUids.every(uid => assignedToUsers.includes(uid));
                                if (allSelected) {
                                  setAssignedToUsers(assignedToUsers.filter(id => !groupUids.includes(id)));
                                } else {
                                  const newSet = new Set([...assignedToUsers, ...groupUids]);
                                  setAssignedToUsers(Array.from(newSet));
                                }
                              }}
                              style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#fafafa' }}
                            >
                              Toggle Select All
                            </button>
                            {groupBlocks.map(sub => (
                              <label key={sub.uid} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#444', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={assignedToUsers.includes(sub.uid)}
                                  onChange={(e) => {
                                    if (e.target.checked) setAssignedToUsers([...assignedToUsers, sub.uid]);
                                    else setAssignedToUsers(assignedToUsers.filter(id => id !== sub.uid));
                                  }}
                                />
                                {sub.first} {sub.last} <span style={{ color: '#888', fontSize: '0.75rem' }}>({sub.position || 'Member'})</span>
                              </label>
                            ))}
                          </div>
                        </details>
                      );
                      })}
                    </div>

                    {assignedToUsers.length > 0 && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#333', cursor: 'pointer', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                        <input
                          type="checkbox"
                          checked={alsoAssignToSelf}
                          onChange={(e) => setAlsoAssignToSelf(e.target.checked)}
                        />
                        <strong>Also add this schedule to my own personal schedule</strong>
                      </label>
                    )}
                  </div>
                )}
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#555', marginBottom: '6px' }}>{isPersonalBuilder ? 'Date' : 'Program Date'}</label>
                <input
                  type="date"
                  value={newProgramDate}
                  onChange={(e) => setNewProgramDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.85rem', color: '#555', margin: 0 }}>
                    {showManageTemplates ? 'Saved Templates' : (isPersonalBuilder ? 'Personal Blocks' : 'Program Blocks')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowManageTemplates(!showManageTemplates);
                      setEditingTemplateId(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {showManageTemplates ? '← Back to Blocks' : '⚙️ Manage Templates'}
                  </button>
                </div>

                {showManageTemplates ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Add New Template Form */}
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginBottom: '4px'
                    }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--accent)' }}>➕ Add New Template</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>Time:</span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="e.g. 10:00 AM"
                            value={newTemplateForm.time}
                            onChange={(e) => setNewTemplateForm({ ...newTemplateForm, time: e.target.value })}
                            style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', outline: 'none' }}
                          />
                          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                            <input
                              type="time"
                              onChange={(e) => {
                                const formatted = convertTime24To12Hr(e.target.value);
                                if (formatted) {
                                  setNewTemplateForm({ ...newTemplateForm, time: formatted });
                                }
                              }}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '32px',
                                height: '32px',
                                opacity: 0,
                                cursor: 'pointer',
                                zIndex: 2
                              }}
                            />
                            <button
                              type="button"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#555',
                                zIndex: 1
                              }}
                            >
                              🕒
                            </button>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>Title:</span>
                        <input
                          type="text"
                          placeholder="e.g. Praise & Worship"
                          value={newTemplateForm.title}
                          onChange={(e) => setNewTemplateForm({ ...newTemplateForm, title: e.target.value })}
                          style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>Minister:</span>
                        <input
                          type="text"
                          placeholder={isPersonalBuilder ? "e.g. Meeting with team" : "e.g. Pastor John"}
                          value={newTemplateForm.minister}
                          onChange={(e) => setNewTemplateForm({ ...newTemplateForm, minister: e.target.value })}
                          style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={handleCreateTemplateDirectly}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--accent)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Add Template
                        </button>
                      </div>
                    </div>

                    {reusableBlocks.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.85rem', border: '1px dashed #ddd', borderRadius: '12px' }}>
                        No saved templates yet. Check "Save as reusable block template" on a program block to save it.
                      </div>
                    ) : (
                      reusableBlocks.map((rb) => {
                        const isEditing = editingTemplateId === rb.id;
                        return (
                          <div
                            key={rb.id}
                            style={{
                              padding: '12px 16px',
                              backgroundColor: '#f9f9f9',
                              borderRadius: '12px',
                              border: '1px solid #eee',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            {isEditing ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>Time:</span>
                                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <input
                                      type="text"
                                      value={editTemplateForm.time}
                                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, time: e.target.value })}
                                      style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', outline: 'none' }}
                                    />
                                    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                      <input
                                        type="time"
                                        onChange={(e) => {
                                          const formatted = convertTime24To12Hr(e.target.value);
                                          if (formatted) {
                                            setEditTemplateForm({ ...editTemplateForm, time: formatted });
                                          }
                                        }}
                                        style={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          width: '30px',
                                          height: '30px',
                                          opacity: 0,
                                          cursor: 'pointer',
                                          zIndex: 2
                                        }}
                                      />
                                      <button
                                        type="button"
                                        style={{
                                          width: '30px',
                                          height: '30px',
                                          borderRadius: '6px',
                                          border: '1px solid #ddd',
                                          backgroundColor: '#f5f5f5',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          color: '#555',
                                          zIndex: 1
                                        }}
                                      >
                                        🕒
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>Title:</span>
                                  <input
                                    type="text"
                                    value={editTemplateForm.title}
                                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, title: e.target.value })}
                                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                                  />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#666' }}>Minister:</span>
                                  <input
                                    type="text"
                                    value={editTemplateForm.minister}
                                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, minister: e.target.value })}
                                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                                  <button
                                    type="button"
                                    onClick={() => setEditingTemplateId(null)}
                                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEditedTemplate(rb.id)}
                                    style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent)', color: 'white', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent)' }}>{rb.time}</div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>{rb.title}</div>
                                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{rb.minister}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingTemplateId(rb.id);
                                      setEditTemplateForm({ time: rb.time || '', title: rb.title || '', minister: rb.minister || '' });
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
                                    title="Edit Template"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTemplate(rb.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
                                    title="Delete Template"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {formBlocks.map((block, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '16px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '12px',
                            border: '1px solid #eee',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)' }}>Block #{idx + 1}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {reusableBlocks.length > 0 && (
                                <select
                                  onChange={(e) => handleSelectReusable(idx, e.target.value)}
                                  defaultValue=""
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '0.75rem',
                                    color: '#555',
                                    outline: 'none'
                                  }}
                                >
                                  <option value="">Use template...</option>
                                  {reusableBlocks.map(rb => (
                                    <option key={rb.id} value={rb.id}>{rb.title} ({rb.minister}) - {rb.time}</option>
                                  ))}
                                </select>
                              )}
                              {formBlocks.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formBlocks];
                                    updated.splice(idx, 1);
                                    setFormBlocks(updated);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#c62828',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Time</label>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  placeholder="e.g. 10:00 AM"
                                  value={block.time}
                                  onChange={(e) => {
                                    const updated = [...formBlocks];
                                    updated[idx].time = e.target.value;
                                    setFormBlocks(updated);
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '0.85rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                  }}
                                />
                                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                  <input
                                    type="time"
                                    onChange={(e) => {
                                      const formatted = convertTime24To12Hr(e.target.value);
                                      if (formatted) {
                                        const updated = [...formBlocks];
                                        updated[idx].time = formatted;
                                        setFormBlocks(updated);
                                      }
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '36px',
                                      height: '36px',
                                      opacity: 0,
                                      cursor: 'pointer',
                                      zIndex: 2
                                    }}
                                  />
                                  <button
                                    type="button"
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '6px',
                                      border: '1px solid #ddd',
                                      backgroundColor: '#f5f5f5',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      fontSize: '1rem',
                                      color: '#555',
                                      zIndex: 1
                                    }}
                                  >
                                    🕒
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>{isPersonalBuilder ? 'Description' : 'Minister'}</label>
                              <input
                                type="text"
                                placeholder={isPersonalBuilder ? "e.g. Meeting with team" : "e.g. Pastor John"}
                                value={block.minister}
                                onChange={(e) => {
                                  const updated = [...formBlocks];
                                  updated[idx].minister = e.target.value;
                                  setFormBlocks(updated);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #ddd',
                                  fontSize: '0.85rem',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Praise & Worship"
                              value={block.title}
                              onChange={(e) => {
                                const updated = [...formBlocks];
                                updated[idx].title = e.target.value;
                                setFormBlocks(updated);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                fontSize: '0.85rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#555', cursor: 'pointer', marginTop: '4px' }}>
                            <input
                              type="checkbox"
                              checked={!!block.saveAsReusable}
                              onChange={(e) => {
                                const updated = [...formBlocks];
                                updated[idx].saveAsReusable = e.target.checked;
                                setFormBlocks(updated);
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            Save as reusable block template
                          </label>

                          {isPersonalBuilder && (
                            <div style={{ marginTop: '8px', borderTop: '1px solid #ddd', paddingTop: '12px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...formBlocks];
                                  updated[idx].showDetails = !updated[idx].showDetails;
                                  setFormBlocks(updated);
                                }}
                                style={{
                                  background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', padding: 0
                                }}
                              >
                                {block.showDetails ? 'Hide Additional Details ▲' : 'Show Additional Details ▼'}
                              </button>
                              
                              {block.showDetails && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>End Time</label>
                                    <input
                                      type="time"
                                      value={block.endTime || ''}
                                      onChange={(e) => {
                                        const updated = [...formBlocks];
                                        updated[idx].endTime = e.target.value;
                                        setFormBlocks(updated);
                                      }}
                                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Location</label>
                                    <input
                                      type="text"
                                      placeholder="Location"
                                      value={block.location || ''}
                                      onChange={(e) => {
                                        const updated = [...formBlocks];
                                        updated[idx].location = e.target.value;
                                        setFormBlocks(updated);
                                      }}
                                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Category</label>
                                    <select
                                      value={block.category || 'Event'}
                                      onChange={(e) => {
                                        const updated = [...formBlocks];
                                        updated[idx].category = e.target.value;
                                        setFormBlocks(updated);
                                      }}
                                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' }}
                                    >
                                      <option value="Worship">Worship</option>
                                      <option value="Youth">Youth</option>
                                      <option value="Study">Study</option>
                                      <option value="Outreach">Outreach</option>
                                      <option value="Baptism">Baptism</option>
                                      <option value="Event">Event</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Type</label>
                                    <select
                                      value={block.type || 'Personal'}
                                      onChange={(e) => {
                                        const updated = [...formBlocks];
                                        updated[idx].type = e.target.value;
                                        setFormBlocks(updated);
                                      }}
                                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' }}
                                    >
                                      <option value="Personal">Personal Event</option>
                                      <option value="Work Shift">Work Shift</option>
                                    </select>
                                  </div>
                                  {block.type === 'Work Shift' && (
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Hours Logged</label>
                                      <input
                                        type="number"
                                        placeholder="Hours"
                                        value={block.hours || ''}
                                        onChange={(e) => {
                                          const updated = [...formBlocks];
                                          updated[idx].hours = e.target.value;
                                          setFormBlocks(updated);
                                        }}
                                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' }}
                                        step="0.5"
                                        min="0"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Dress Code</label>
                                    <input
                                      type="text"
                                      placeholder="Dress Code"
                                      value={block.dressCode || ''}
                                      onChange={(e) => {
                                        const updated = [...formBlocks];
                                        updated[idx].dressCode = e.target.value;
                                        setFormBlocks(updated);
                                      }}
                                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFormBlock}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px dashed #ddd',
                        backgroundColor: 'white',
                        color: 'var(--accent)',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>+</span> Add Block
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowCreateProgramModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#333',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProgram}
                disabled={isSavingProgram}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: isSavingProgram ? 'not-allowed' : 'pointer',
                  opacity: isSavingProgram ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(91, 63, 187, 0.2)'
                }}
              >
                {isPersonalBuilder ? (isSavingProgram ? 'Saving Blocks...' : 'Save Blocks') : (isSavingProgram ? 'Saving Program...' : 'Save Program')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  display: 'flex',
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  gap: '16px',
  border: '1px solid #f0f0f0'
};

const dateColumnStyle = {
  width: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #eee',
  paddingRight: '16px'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '4px'
};

const infoTextStyle = {
  fontSize: '0.85rem',
  color: '#666',
  fontWeight: '500'
};

const tagStyle = {
  fontSize: '0.65rem',
  fontWeight: '700',
  backgroundColor: '#f0f0f0',
  padding: '2px 8px',
  borderRadius: '100px',
  color: '#666',
  textTransform: 'uppercase'
};

export default ScheduleScreen;