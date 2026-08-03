/**
 * Simulates an immutable audit log for critical actions.
 * In a production backend, this would append to a read-only table/ledger.
 */
export const auditService = {
  logAction: (actionType, details, userId = 'local-user') => {
    try {
      const logs = JSON.parse(localStorage.getItem('ah_audit_logs') || '[]');
      
      const newLog = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
        timestamp: new Date().toISOString(),
        userId,
        actionType,
        details,
        // In real app, include IP, userAgent, etc.
        client: 'web-prototype'
      };

      logs.push(newLog);
      
      // Keep only last 1000 logs locally to prevent storage issues
      if (logs.length > 1000) {
        logs.shift();
      }

      localStorage.setItem('ah_audit_logs', JSON.stringify(logs));
      
      // For development visibility
      console.log(`[AUDIT LOG] ${actionType}:`, details);
      
      return true;
    } catch (error) {
      console.error("Failed to write audit log:", error);
      return false;
    }
  },

  getLogs: () => {
    return JSON.parse(localStorage.getItem('ah_audit_logs') || '[]');
  }
};
