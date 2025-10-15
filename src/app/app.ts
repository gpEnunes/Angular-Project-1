import { Component, ViewChild } from '@angular/core';
import { ControlPanel } from './components/control-panel/control-panel';
import { Grid } from './components/grid/grid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ControlPanel, Grid],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  @ViewChild(Grid) gridComponent!: Grid;

  handleRun(): void {
    this.gridComponent.runAlgorithm(); // ← método que vamos criar no Grid
  }

  handleReset(): void {
    this.gridComponent.resetGrid(); // ← método que vamos criar no Grid
  }

  handleRandomize(): void {
    this.gridComponent.randomizeStartEnd();
  }
}