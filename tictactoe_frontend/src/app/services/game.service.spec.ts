import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { AuditService } from './audit.service';

/**
 * Note: UI now renders chess icons (♞ for 'X', ♛ for 'O').
 * These tests assert service state ('X'/'O') only and do not rely on DOM glyphs.
 */
describe('GameService', () => {
  let service: GameService;
  let audit: AuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService, AuditService],
    });
    service = TestBed.inject(GameService);
    audit = TestBed.inject(AuditService);
    audit.clear(); // ensure clean slate
  });

  it('should start with empty board and X as current player', () => {
    expect(service.board()).toEqual([null, null, null, null, null, null, null, null, null]);
    expect(service.currentPlayer()).toBe('X');
    expect(service.winner()).toBeNull();
    expect(service.isDraw()).toBeFalse();
  });

  it('should toggle current player after a valid move', () => {
    service.move(0);
    expect(service.board()[0]).toBe('X');
    expect(service.currentPlayer()).toBe('O');
  });

  it('should prevent moving to an occupied cell', () => {
    service.move(0);
    expect(() => service.move(0)).toThrowError('Cell already occupied.');
  });

  it('should throw for invalid index', () => {
    expect(() => service.move(-1)).toThrow();
    expect(() => service.move(9)).toThrow();
    // @ts-expect-error intentional invalid type
    expect(() => service.move('a')).toThrow();
  });

  it('should detect a row win', () => {
    // X at 0, O at 3, X at 1, O at 4, X at 2 -> X wins on row 0
    service.move(0);
    service.move(3);
    service.move(1);
    service.move(4);
    service.move(2);
    expect(service.winner()).toBe('X');
    expect(service.winningLine()).toEqual([0,1,2]);
  });

  it('should detect a column win', () => {
    service.reset();
    service.move(0); // X
    service.move(1); // O
    service.move(3); // X
    service.move(2); // O
    service.move(6); // X wins col 0
    expect(service.winner()).toBe('X');
    expect(service.winningLine()).toEqual([0,3,6]);
  });

  it('should detect a diagonal win', () => {
    service.reset();
    service.move(0); // X
    service.move(1); // O
    service.move(4); // X
    service.move(2); // O
    service.move(8); // X wins diag
    expect(service.winner()).toBe('X');
    expect(service.winningLine()).toEqual([0,4,8]);
  });

  it('should detect draw correctly', () => {
    service.reset();
    // Fill to draw:
    // X O X
    // X X O
    // O X O
    service.move(0); // X
    service.move(1); // O
    service.move(2); // X
    service.move(5); // O
    service.move(3); // X
    service.move(6); // O
    service.move(4); // X
    service.move(8); // O
    service.move(7); // X
    expect(service.winner()).toBeNull();
    expect(service.isDraw()).toBeTrue();
  });

  it('should not allow move after game finished', () => {
    service.reset();
    service.move(0);
    service.move(3);
    service.move(1);
    service.move(4);
    service.move(2); // X wins
    expect(service.winner()).toBe('X');
    expect(() => service.move(5)).toThrowError('Game already finished.');
  });

  it('reset should clear board, set X as current and log audit', () => {
    service.move(0);
    const entriesBefore = TestBed.inject(AuditService).entries();
    const countBefore = entriesBefore().length;
    service.reset();
    const entriesAfter = TestBed.inject(AuditService).entries();
    expect(service.board()).toEqual([null, null, null, null, null, null, null, null, null]);
    expect(service.currentPlayer()).toBe('X');
    expect(entriesAfter().length).toBeGreaterThanOrEqual(countBefore + 1);
    expect(entriesAfter()[0].action).toBe('RESET');
  });
});
