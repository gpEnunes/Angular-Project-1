import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'control-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './control-panel.html',
  styleUrls: ['./control-panel.scss']
})
export class ControlPanel {
  @Output() runAlgorithm = new EventEmitter<void>();
  @Output() resetGrid = new EventEmitter<void>();
  @Output() randomize = new EventEmitter<void>();

  onRandomize(): void {
    this.randomize.emit();
  }

  onRun(): void {
    this.runAlgorithm.emit();
  }

  onReset(): void {
    this.resetGrid.emit();
  }
}