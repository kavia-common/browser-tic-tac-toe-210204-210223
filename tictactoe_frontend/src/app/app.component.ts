import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { AuditLogComponent } from './components/audit-log/audit-log.component';
import { GameService } from './services/game.service';
import { AuditService } from './services/audit.service';

/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-UI-001
// User Story: As a user, I want to play Tic-Tac-Toe in the browser with a modern UI and see an audit trail.
// Acceptance Criteria: Centered board, current player display, win/draw detection, reset, audit log toggle.
// GxP Impact: YES - Demo-level audit trail (frontend-only) with timestamps and state before/after.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001 (unit tests for game logic)
// ============================================================================

/**
 * Root application component orchestrating the game & audit trail.
 * Includes Ocean Professional styled layout and controls.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BoardComponent, AuditLogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /** Title and UI State */
  title = 'Tic-Tac-Toe';
  showAudit = signal<boolean>(false);

  /** Service injections */
  private readonly game = inject(GameService);
  private readonly audit = inject(AuditService);

  /** Derived view state using computed signals */
  currentPlayer = computed(() => this.game.currentPlayer());
  board = computed(() => this.game.board());
  winner = computed(() => this.game.winner());
  draw = computed(() => this.game.isDraw());
  winningLine = computed(() => this.game.winningLine());

  // PUBLIC_INTERFACE
  toggleAudit(): void {
    /** Toggle the audit trail panel visibility */
    this.showAudit.update(v => !v);
  }

  // PUBLIC_INTERFACE
  onCellSelected(index: number): void {
    /**
     * Process a user move; invalid moves are safely ignored and recorded as error in audit trail.
     */
    try {
      this.game.move(index);
    } catch (err: any) {
      // Record technical error to audit trail
      this.audit.log({
        userId: 'demo-user', // placeholder
        action: 'ERROR',
        timestamp: new Date().toISOString(),
        details: 'Attempted invalid move',
        errorMessage: err?.message ?? String(err),
        beforeState: { board: this.board(), currentPlayer: this.currentPlayer() },
        afterState: { board: this.board(), currentPlayer: this.currentPlayer() },
      });
    }
  }

  // PUBLIC_INTERFACE
  newGame(): void {
    /** Reset the game board and record in audit log. */
    this.game.reset();
  }
}
