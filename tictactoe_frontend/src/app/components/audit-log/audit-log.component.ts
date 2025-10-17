import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit.service';
import { AuditEntry } from '../../models/audit.models';

/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-AUD-UI-001
// User Story: As a user, I can view a panel showing recent audit entries.
// Acceptance Criteria: Toggle panel shows entries with timestamps and actions.
// GxP Impact: YES - Read-only display of audit trail content.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001
// ============================================================================
 */

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent {
  private readonly audit = inject(AuditService);
  entries = computed<AuditEntry[]>(() => this.audit.entries());
}
