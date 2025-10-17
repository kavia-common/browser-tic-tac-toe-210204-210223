import { Injectable, signal } from '@angular/core';
import { AuditEntry, AuditAction, BoardStateSnapshot } from '../models/audit.models';

/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-AUD-002
// User Story: Capture all user actions with timestamps and before/after states.
// Acceptance Criteria: In-memory log with ISO timestamps; errors included.
// GxP Impact: YES - Audit trail scaffold aligns to ALCOA+ (Attributable, Accurate, etc.).
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001
// ============================================================================
//
// IMPORTS AND DEPENDENCIES
// - Angular Injectable (19.2.x)
// - Signals for reactive state
// ============================================================================
//
// FEATURE IMPLEMENTATION
// - Provides logging APIs for MOVE, RESET, ERROR
// - Stores entries in memory; exposes read-only list
// - No external persistence (demo scope)
// ============================================================================ */

@Injectable({ providedIn: 'root' })
export class AuditService {
  private _entries = signal<AuditEntry[]>([]);

  // PUBLIC_INTERFACE
  get entries() {
    /** Read-only signal with audit entries */
    return this._entries.asReadonly();
  }

  // PUBLIC_INTERFACE
  log(entry: AuditEntry): void {
    /**
     * Append an audit entry (frontend scaffold).
     * Parameters: entry (validated minimally).
     * Throws: none (non-critical; best-effort).
     * Audit: This is the sink for all audit logging in the demo.
     */
    if (!entry.userId || !entry.action || !entry.timestamp) {
      // minimal validation
      // In a production environment, raise error or enforce schema
      console.warn('Audit entry missing required fields', entry);
    }
    this._entries.update(arr => [entry, ...arr].slice(0, 200)); // cap to recent 200
  }

  // PUBLIC_INTERFACE
  clear(): void {
    /** Clear the audit log (demo only) */
    this._entries.set([]);
  }

  // PUBLIC_INTERFACE
  logMove(userId: string, before: BoardStateSnapshot, after: BoardStateSnapshot, details?: string): void {
    this.log({
      userId,
      action: 'MOVE',
      timestamp: new Date().toISOString(),
      details,
      beforeState: before,
      afterState: after
    });
  }

  // PUBLIC_INTERFACE
  logReset(userId: string, before: BoardStateSnapshot, after: BoardStateSnapshot): void {
    this.log({
      userId,
      action: 'RESET',
      timestamp: new Date().toISOString(),
      beforeState: before,
      afterState: after
    });
  }
}
