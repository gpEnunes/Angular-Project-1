import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Node } from '../grid/grid'; // importa a interface Node

@Component({
  selector: 'cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.html',
  styleUrls: ['./cell.scss']
})
export class Cell {
  @Input() node!: Node;
  @Output() mouseDown = new EventEmitter<Node>();
  @Output() mouseEnter = new EventEmitter<Node>();
  @Output() mouseUp = new EventEmitter<void>();

  getNodeClass(): string {
    if (this.node.isStart) return 'start';
    if (this.node.isEnd) return 'end';
    if (this.node.isWall) return 'wall';
    if (this.node.isPath) return 'path';
    if (this.node.isVisited) return 'visited';
    return '';
  }

  handleMouseDown(): void {
    this.mouseDown.emit(this.node);
  }

  handleMouseEnter(): void {
    this.mouseEnter.emit(this.node);
  }

  handleMouseUp(): void {
    this.mouseUp.emit();
  }
}