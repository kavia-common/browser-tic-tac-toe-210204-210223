import { Injectable, signal } from '@angular/core';
import { AuditService } from './audit.service';
import { Cell, Player } from '../models/audit.models';

/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-LOGIC-001
// User Story: As a player I want to play Tic-Tac-Toe with clear rules.
// Acceptance Criteria: X/O turns, invalid move prevention, win/draw detection, reset, winning line highlight.
// GxP Impact: YES - Validation and audit logging for state transitions.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001
// ============================================================================
//
// FEATURE IMPLEMENTATION
// - Board state as 9-cell array
// - Signals for reactive state
// - Input validation and error throw for invalid move
// - Audit Service invoked for move/reset
// ============================================================================ */

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly userId = 'demo-user'; // placeholder; in real app source from auth context

  private _board = signal<Cell[]>(Array<Cell>(9).fill(null));
  private _currentPlayer = signal<Player>('X');
  private _winner = signal<Player | null>(null);
  private _winningLine = signal<number[] | null>(null);

  /** Expose readonly signals for UI */
  // PUBLIC_INTERFACE
  board = () => this._board();
  // PUBLIC_INTERFACE
  currentPlayer = () => this._currentPlayer();
  // PUBLIC_INTERFACE
  winner = () => this._winner();
  // PUBLIC_INTERFACE
  winningLine = () => this._winningLine();

  // PUBLIC_INTERFACE
  isDraw(): boolean {
    /** True if all cells filled and no winner */
    return this._board().every(c => c !== null) && this._winner() === null;
  }

  // PUBLIC_INTERFACE
  reset(): void {
    /** Reset the game to initial state and record audit */
    const before = {
      board: [...this._board()],
      currentPlayer: this._currentPlayer()
    };
    this._board.set(Array<Cell>(9).fill(null));
    this._currentPlayer.set('X');
    this._winner.set(null);
    this._winningLine.set(null);
    const after = {
      board: [...this._board()],
      currentPlayer: this._currentPlayer()
    };
    this.audit.logReset(this.userId, before, after);
  }

  constructor(private readonly audit: AuditService) {}

  // PUBLIC_INTERFACE
  move(index: number): void {
    /**
     * Execute a move with validation and audit logging.
     * Parameters: index [0..8] integer.
     * Throws: Error on invalid input or illegal move.
     * Audit: Logs before/after board states.
     */
    // Input validation
    if (!Number.isInteger(index) || index < 0 || index > 8) {
      throw new Error('Invalid move index.');
    }
    const board = [...this._board()];
    if (this._winner()) {
      throw new Error('Game already finished.');
    }
    if (board[index] !== null) {
      throw new Error('Cell already occupied.');
    }

    const before = {
      board: [...board],
      currentPlayer: this._currentPlayer()
    };

    // Business logic
    board[index] = this._currentPlayer();
    this._board.set(board);

    // Check win
    const lines = this.getWinningLines();
    let foundWin: { player: Player; line: number[] } | null = null;
    for (const line of lines) {
      const [a, b, c] = line;
      const va = board[a], vb = board[b], vc = board[c];
      if (va && va === vb && vb === vc) {
        foundWin = { player: va, line };
        break;
      }
    }

    if (foundWin) {
      this._winner.set(foundWin.player);
      this._winningLine.set(foundWin.line);
    } else if (!this.isDraw()) {
      this._currentPlayer.set(this._currentPlayer() === 'X' ? 'O' : 'X');
    }

    const after = {
      board: [...this._board()],
      currentPlayer: this._currentPlayer()
    };

    // Audit the move
    this.audit.logMove(this.userId, before, after, `Move on cell ${index}`);
  }

  /** Internal helper: all winning triplets */
  private getWinningLines(): number[][] {
    return [
      // Rows
      [0,1,2],[3,4,5],[6,7,8],
      // Cols
      [0,3,6],[1,4,7],[2,5,8],
      // Diagonals
      [0,4,8],[2,4,6]
    ];
  }
}
