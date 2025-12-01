import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('spaceCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private stars: { x: number; y: number; size: number; speed: number }[] = [];
  private numStars = 100;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.generateStars();
    requestAnimationFrame(() => this.animateStars());

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.generateStars();
    });
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private generateStars() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1.5 + 0.5,
      });
    }
  }

  private animateStars() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = '#0a061f';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.stars.forEach((star) => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.fill();
      star.y += star.speed;
      if (star.y > window.innerHeight) {
        star.y = 0;
        star.x = Math.random() * window.innerWidth;
      }
    });

    requestAnimationFrame(() => this.animateStars());
  }
}