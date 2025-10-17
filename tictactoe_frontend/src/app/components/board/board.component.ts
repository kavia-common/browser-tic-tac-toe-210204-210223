import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cell } from '../../models/audit.models';

/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-UI-BOARD-001
// User Story: As a player, I need a 3x3 grid to play the game with clear feedback.
// Acceptance Criteria: 3x3 grid, highlight winning line, disable on game over.
// GxP Impact: NO (UI-only), but supports compliant interactions.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001 (covered via service tests)
// ============================================================================
 */

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @Input() board: Cell[] = Array<Cell>(9).fill(null);
  @Input() winningLine: number[] | null = null;
  @Input() gameOver = false;

  @Output() cellSelected = new EventEmitter<number>();

  // PUBLIC_INTERFACE
  selectCell(index: number): void {
    /** Emit selection if not over and cell empty */
    if (this.gameOver || this.board[index] !== null) return;
    this.cellSelected.emit(index);
  }

  // PUBLIC_INTERFACE
  isWinning(index: number): boolean {
    /** True if index is part of the winning triplet */
    return !!this.winningLine?.includes(index);
  }
}
