/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-AUD-001
// User Story: As a compliance reviewer, I need an audit trail of user actions.
// Acceptance Criteria: Capture userId, timestamp, action, before/after state, errors.
// GxP Impact: YES - Demonstrates ALCOA+ principles in a frontend scaffold.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001
// ============================================================================
 */

export type Player = 'X' | 'O';
export type Cell = Player | null;

/** Public audit action types for traceability */
// PUBLIC_INTERFACE
export type AuditAction =
  | 'MOVE'
  | 'RESET'
  | 'ERROR';

export interface BoardStateSnapshot {
  board: Cell[];
  currentPlayer: Player;
}

/** Structured audit entry for in-memory capture */
// PUBLIC_INTERFACE
export interface AuditEntry {
  userId: string; // placeholder demo user
  action: AuditAction;
  timestamp: string; // ISO8601
  details?: string;
  beforeState?: BoardStateSnapshot;
  afterState?: BoardStateSnapshot;
  errorMessage?: string;
}
