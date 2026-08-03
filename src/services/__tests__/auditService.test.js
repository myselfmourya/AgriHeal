import { describe, it, expect, beforeEach } from 'vitest';
import { auditService } from '../auditService';

describe('auditService', () => {
  beforeEach(() => {
    localStorage.clear();
    // Clear localStorage before each test
  });

  it('should log an action and retrieve it', () => {
    const success = auditService.logAction('DATA_EXPORT', { type: 'json' }, 'test-user');
    
    expect(success).toBe(true);
    
    const logs = auditService.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].actionType).toBe('DATA_EXPORT');
    expect(logs[0].userId).toBe('test-user');
    expect(logs[0].details.type).toBe('json');
    expect(logs[0].client).toBe('web-prototype');
    expect(logs[0].id).toBeDefined();
    expect(logs[0].timestamp).toBeDefined();
  });

  it('should trim logs to a maximum of 1000 entries', () => {
    // We can simulate having 1000 logs in localStorage
    const fakeLogs = Array.from({ length: 1000 }).map((_, i) => ({
      id: `id-${i}`,
      actionType: 'TEST',
      timestamp: new Date().toISOString()
    }));
    
    localStorage.setItem('ah_audit_logs', JSON.stringify(fakeLogs));
    
    // Log the 1001th action
    auditService.logAction('NEW_ACTION', {});
    
    const logs = auditService.getLogs();
    expect(logs.length).toBe(1000);
    // The first item should now be id-1 instead of id-0
    expect(logs[0].id).toBe('id-1');
    expect(logs[999].actionType).toBe('NEW_ACTION');
  });
});
