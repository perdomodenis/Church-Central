// Definieren der Rollen und Berechtigungen für die Anwendung
export const ROLES = {
  ADMIN: 'admin',
  LEADER: 'leader',
  MEMBER: 'member'
};

export const PERMISSIONS = {
  admin: {
    canCreateEvent: true,
    canEditAllEvents: true,
    canDeleteEvents: true,
    canUploadDocument: true,
    canDeleteDocument: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canViewAllDocuments: true
  },
  leader: {
    canCreateEvent: true,
    canEditAllEvents: true,
    canDeleteEvents: false,
    canUploadDocument: true,
    canDeleteDocument: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canViewAllDocuments: true
  },
  member: {
    canCreateEvent: false,
    canEditAllEvents: false,
    canDeleteEvents: false,
    canUploadDocument: false,
    canDeleteDocument: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canViewAllDocuments: false
  }
};

// prüft ob ein Benutzer eine bestimmte Berechtigung hat
export function canUserAccess(userRole, permission) {
  return PERMISSIONS[userRole]?.[permission] === true;
}

// prüft den Anzeigenamen der Benutzerrolle
export function getRoleDisplayName(role) {
  const names = {
    admin: 'Administrator',
    leader: 'Leiter',
    member: 'Mitglied'
  };
  return names[role] || role;
}