import React, { useEffect, useRef } from 'react';
import './GalacticBackground.css';

const GalacticBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 1.2 + 0.2;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = `hsl(${Math.random() * 30 + 260}, 80%, 70%)`; // Purple range
        this.originalX = x;
        this.originalY = y;
        this.attractionRadius = 60;
        this.attractionStrength = 0.02;
        this.glowSize = this.size * 1.5;
      }

      update() {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply mouse attraction based on velocity
        if (distance < this.attractionRadius) {
          const force = (this.attractionRadius - distance) / this.attractionRadius;
          const mouseSpeed = Math.sqrt(mouseVelocityRef.current.x ** 2 + mouseVelocityRef.current.y ** 2);
          const speedMultiplier = Math.min(mouseSpeed * 0.01, 1);
          
          this.vx += (dx / distance) * force * this.attractionStrength * speedMultiplier;
          this.vy += (dy / distance) * force * this.attractionStrength * speedMultiplier;
        }

        // Apply gentle return to original position
        const returnDx = this.originalX - this.x;
        const returnDy = this.originalY - this.y;
        this.vx += returnDx * 0.00003;
        this.vy += returnDy * 0.00003;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Apply friction
        this.vx *= 0.97;
        this.vy *= 0.97;

        // Keep particles within bounds
        if (this.x < 0 || this.x > canvas.width) this.vx *= -0.2;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -0.2;
      }

      draw() {
        ctx.save();
        
        // Draw glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.glowSize
        );
        gradient.addColorStop(0, `hsla(${this.color.match(/hsl\((\d+)/)[1]}, 80%, 70%, ${this.opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.color.match(/hsl\((\d+)/)[1]}, 80%, 70%, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core particle
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 40000); // Fewer particles
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push(new Particle(x, y));
      }
    };

    createParticles();

    // Mouse event handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      // Calculate mouse velocity
      mouseVelocityRef.current.x = currentX - lastMouseRef.current.x;
      mouseVelocityRef.current.y = currentY - lastMouseRef.current.y;
      
      mouseRef.current.x = currentX;
      mouseRef.current.y = currentY;
      
      lastMouseRef.current.x = currentX;
      lastMouseRef.current.y = currentY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = canvas.width / 2;
      mouseRef.current.y = canvas.height / 2;
      mouseVelocityRef.current.x = 0;
      mouseVelocityRef.current.y = 0;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw very dark gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, 'rgba(5, 5, 15, 0.8)');
      gradient.addColorStop(0.5, 'rgba(2, 2, 8, 0.6)');
      gradient.addColorStop(1, 'rgba(0, 0, 5, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw very subtle connecting lines between nearby particles
      ctx.strokeStyle = 'rgba(120, 80, 200, 0.03)';
      ctx.lineWidth = 0.2;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 40) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="galactic-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default GalacticBackground; 