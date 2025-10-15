import { Injectable } from '@angular/core';
import { Node } from '../components/grid/grid';

@Injectable({ providedIn: 'root' })
export class PathfindingService {
  runDijkstra(grid: Node[][], start: Node, end: Node): Node[] {
    const visitedNodes: Node[] = [];
    const unvisited = grid.flat();
    const distances = new Map<Node, number>();
    const previous = new Map<Node, Node | null>();

    for (const node of unvisited) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }

    distances.set(start, 0);

    while (unvisited.length > 0) {
      unvisited.sort((a, b) => (distances.get(a)! - distances.get(b)!));
      const closest = unvisited.shift()!;
      if (closest.isWall) continue;
      if (distances.get(closest)! === Infinity) break;

      //closest.isVisited = true;
      visitedNodes.push(closest);

      if (closest === end) break;

      const neighbors = this.getNeighbors(closest, grid);
      for (const neighbor of neighbors) {
        const alt = distances.get(closest)! + 1;
        if (alt < distances.get(neighbor)!) {
          distances.set(neighbor, alt);
          previous.set(neighbor, closest);
        }
      }
    }

    return visitedNodes;
  }

  private getNeighbors(node: Node, grid: Node[][]): Node[] {
    const { row, col } = node;
    const neighbors: Node[] = [];

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(n => !n.isWall);
  }
}