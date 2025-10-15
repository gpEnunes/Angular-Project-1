import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cell } from '../cell/cell';
import { PathfindingService } from '../../services/pathfinding';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
}

@Component({
  selector: 'grid',
  standalone: true,
  imports: [CommonModule, Cell],
  templateUrl: './grid.html',
  styleUrls: ['./grid.scss']
})
export class Grid {
  grid: Node[][] = [];
  mouseIsPressed = false;
  startNode = { row: 10, col: 5 };
  endNode = { row: 10, col: 25 };
  private animationStop$ = new Subject<void>();
  isRunning = false;

  constructor(
    private pathfinding: PathfindingService,
    private zone: NgZone
  ) {
    this.initializeGrid();
  }

  initializeGrid(): void {
    const cellSize = 25; // px
    const rows = Math.floor(window.innerHeight / cellSize);
    const panelWidth = 250;
    const cols = Math.floor((window.innerWidth - panelWidth) / cellSize);
    this.grid = [];

    for (let row = 0; row < rows; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === this.startNode.row && col === this.startNode.col,
          isEnd: row === this.endNode.row && col === this.endNode.col,
          isWall: false,
          isVisited: false,
          isPath: false
        });
      }
      this.grid.push(currentRow);
    }
  }

  getNodeClass(node: Node): string {
    if (node.isStart) return 'start';
    if (node.isEnd) return 'end';
    if (node.isWall) return 'wall';
    if (node.isPath) return 'path';
    if (node.isVisited) return 'visited';
    return '';
  }

  handleMouseDown(node: Node): void {
    this.mouseIsPressed = true;
    this.toggleWall(node);
  }

  handleMouseEnter(node: Node): void {
    if (!this.mouseIsPressed) return;
    this.toggleWall(node);
  }

  handleMouseUp(): void {
    this.mouseIsPressed = false;
  }

  toggleWall(node: Node): void {
    if (!node.isStart && !node.isEnd) {
      node.isWall = !node.isWall;
    }
  }

  clearSearchState(): void {
    for (const row of this.grid) {
      for (const node of row) {
        node.isVisited = false;
        node.isPath = false;
      }
    }
  }

  resetGrid(): void {
    this.animationStop$.next();
    for (const row of this.grid) {
      for (const node of row) {
        node.isWall = false;
        node.isVisited = false;
        node.isPath = false;
        node.isStart = false;
        node.isEnd = false;
      }
    }

    const start = this.grid[this.startNode.row][this.startNode.col];
    const end = this.grid[this.endNode.row][this.endNode.col];
    start.isStart = true;
    end.isEnd = true;
  }

  randomizeStartEnd(): void {
    this.animationStop$.next();
    const rows = this.grid.length;
    const cols = this.grid[0].length;

    for (const row of this.grid) {
      for (const node of row) {
        node.isStart = false;
        node.isEnd = false;
        node.isVisited = false;
        node.isPath = false;
      }
    }

    let startRow = Math.floor(Math.random() * rows);
    let startCol = Math.floor(Math.random() * cols);
    let endRow = Math.floor(Math.random() * rows);
    let endCol = Math.floor(Math.random() * cols);

    while (startRow === endRow && startCol === endCol) {
      endRow = Math.floor(Math.random() * rows);
      endCol = Math.floor(Math.random() * cols);
    }

    this.grid[startRow][startCol].isStart = true;
    this.grid[endRow][endCol].isEnd = true;

    this.startNode = { row: startRow, col: startCol };
    this.endNode = { row: endRow, col: endCol };
  }

  runAlgorithm(): void {
    this.clearSearchState();
    this.animationStop$.next();

    const start = this.grid[this.startNode.row][this.startNode.col];
    const end = this.grid[this.endNode.row][this.endNode.col];
    const visited = this.pathfinding.runDijkstra(this.grid, start, end);

    let index = 0;

    this.zone.runOutsideAngular(() => {
      interval(30).pipe(takeUntil(this.animationStop$)).subscribe(() => {
        if (index >= visited.length) {
          this.animationStop$.next();
          return;
        }

        const node = visited[index];
        this.grid[node.row][node.col].isVisited = true;

        this.zone.run(() => { }); // força detecção de mudança

        index++;
      });
    });
  }
}