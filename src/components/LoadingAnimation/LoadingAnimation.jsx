import React, { useEffect } from 'react';
import gsap from 'gsap';
import './LoadingAnimation.css';

const LoadingAnimation = ({ onComplete }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const mainTimeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        onComplete();
      }
    });

    const gridLines = document.querySelector('.grid-lines');
    for (let i = 0; i < 11; i++) {
      const horizontalLine = document.createElement('div');
      horizontalLine.classList.add('grid-line', 'horizontal-line');
      horizontalLine.style.top = `${i * 10}%`;
      
      const verticalLine = document.createElement('div');
      verticalLine.classList.add('grid-line', 'vertical-line');
      verticalLine.style.left = `${i * 10}%`;
      
      gridLines.appendChild(horizontalLine);
      gridLines.appendChild(verticalLine);
    }

    const mainCell = document.querySelector('.main-cell');
    mainCell.style.width = '300px';
    mainCell.style.height = '300px';
    mainCell.style.top = '50%';
    mainCell.style.left = '50%';
    mainCell.style.transform = 'translate(-50%, -50%) scale(0)';

    const createAdditionalCells = () => {
      const createCell = (size, top, left) => {
        const cell = document.createElement('div');
        cell.classList.add('plant-cell');
        cell.style.width = `${size}px`;
        cell.style.height = `${size}px`;
        cell.style.top = `${top}%`;
        cell.style.left = `${left}%`;
        document.querySelector('.microscope-circle').appendChild(cell);
        return cell;
      };
      
      return [
        createCell(120, 25, 25),
        createCell(100, 70, 30),
        createCell(90, 35, 75),
        createCell(150, 75, 70)
      ];
    };
    
    const additionalCells = createAdditionalCells();

    const createPathogens = (count) => {
      const pathogens = [];
      for (let i = 0; i < count; i++) {
        const pathogen = document.createElement('div');
        pathogen.classList.add('pathogen');
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        const x = 50 + Math.cos(angle) * distance;
        const y = 50 + Math.sin(angle) * distance;
        pathogen.style.top = `${y}%`;
        pathogen.style.left = `${x}%`;
        pathogen.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.querySelector('.microscope-circle').appendChild(pathogen);
        pathogens.push(pathogen);
      }
      return pathogens;
    };
    
    const pathogens = createPathogens(12);

    const createSpores = (count) => {
      const spores = [];
      for (let i = 0; i < count; i++) {
        const spore = document.createElement('div');
        spore.classList.add('spore');
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 220;
        const x = 50 + Math.cos(angle) * distance;
        const y = 50 + Math.sin(angle) * distance;
        spore.style.top = `${y}%`;
        spore.style.left = `${x}%`;
        document.querySelector('.microscope-circle').appendChild(spore);
        spores.push(spore);
      }
      return spores;
    };
    
    const spores = createSpores(30);

    const createDefenseProteins = (count) => {
      const proteins = [];
      for (let i = 0; i < count; i++) {
        const protein = document.createElement('div');
        protein.classList.add('defense-protein');
        document.querySelector('.microscope-circle').appendChild(protein);
        proteins.push(protein);
      }
      return proteins;
    };
    
    const defenseProteins = createDefenseProteins(15);

    const positionAroundCell = (element, distance, angle) => {
      const x = 50 + Math.cos(angle) * distance;
      const y = 50 + Math.sin(angle) * distance;
      element.style.top = `${y}%`;
      element.style.left = `${x}%`;
    };

    const cursor = document.getElementById('cursor');
    const handleMouseMove = (e) => {
      gsap.to(cursor, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1
      });
      
      if (mainTimeline.progress() > 0.5) {
        const viewCenter = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        };
        const dx = (e.clientX - viewCenter.x) / viewCenter.x;
        const dy = (e.clientY - viewCenter.y) / viewCenter.y;
        gsap.to('.microscope-circle', {
          x: dx * -20,
          y: dy * -20,
          duration: 0.5,
          ease: 'power1.out'
        });
      }
    };

    const handleMouseDown = () => {
      gsap.to(cursor, {
        width: 30,
        height: 30,
        duration: 0.3,
        ease: 'power1.out'
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        width: 20,
        height: 20,
        duration: 0.3,
        ease: 'power1.out'
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    mainTimeline
      .to('.loading-label', { opacity: 1, duration: 0.5, ease: 'power2.inOut' })
      .to('.grid-lines', { opacity: 0.15, duration: 0.7, ease: 'power2.inOut' }, '<0.3')
      .to('.lens-flare', { opacity: 0.8, scale: 1, duration: 0.5, ease: 'power2.out' }, '<0.2')
      .to('.lens-flare', { opacity: 0, scale: 0.5, duration: 0.3, ease: 'power2.in' }, '>')
      .to('.loading-label', {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => document.querySelector('.loading-label').textContent = 'LOCATING SPECIMEN'
      })
      .to('.loading-label', { opacity: 1, duration: 0.3, ease: 'power2.out' })
      .to('.measuring-line', { width: 100, duration: 0.5, ease: 'power2.inOut' }, '<0.3')
      .to('.measuring-label', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '>-0.3')
      .to('.main-cell', { opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }, '>')
      .to('.cell-nucleus', { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' }, '<0.3')
      .to(additionalCells, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'elastic.out(1, 0.5)' }, '<0.3')
      .to('.loading-label', {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => document.querySelector('.loading-label').textContent = 'SPECIMEN ACQUIRED'
      })
      .to('.loading-label', { opacity: 1, duration: 0.3, ease: 'power2.out' })
      .to('.loading-text', { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '<')
      .to(pathogens, { opacity: 1, stagger: { each: 0.05, from: 'random' }, duration: 0.4, ease: 'power2.out' }, '>')
      .to(spores, { opacity: 0.8, stagger: { each: 0.02, from: 'random' }, duration: 0.3, ease: 'power2.out' }, '<0.2')
      .to('.loading-text', {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => document.querySelector('.loading-text').textContent = 'PATHOGEN DETECTED'
      }, '+=0.5')
      .to('.loading-text', { opacity: 1, duration: 0.3, ease: 'power2.out', color: '#d62828' })
      .call(() => {
        defenseProteins.forEach((protein, index) => {
          const sourceAngle = Math.random() * Math.PI * 2;
          positionAroundCell(protein, 80, sourceAngle);
          const targetPathogen = pathogens[index % pathogens.length];
          const targetRect = targetPathogen.getBoundingClientRect();
          const circleRect = document.querySelector('.microscope-circle').getBoundingClientRect();
          const targetX = ((targetRect.left + targetRect.width/2) - (circleRect.left + circleRect.width/2)) / circleRect.width * 100 + 50;
          const targetY = ((targetRect.top + targetRect.height/2) - (circleRect.top + circleRect.height/2)) / circleRect.height * 100 + 50;
          
          gsap.timeline()
            .to(protein, { opacity: 1, duration: 0.3, delay: index * 0.05 })
            .to(protein, { left: `${targetX}%`, top: `${targetY}%`, duration: 0.8, ease: 'power1.inOut' })
            .to(protein, { opacity: 0, duration: 0.2 });
        });
      })
      .to('.loading-text', { opacity: 0, duration: 0.3, ease: 'power2.in' }, '+=0.8')
      .to('.loading-label', { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<')
      .to('.loading-text', {
        text: 'ANALYSIS COMPLETE',
        color: '#4895ef',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, '+=0.3')
      .to(['.microscope-circle', '.loading-text', '.loading-label', '.scope-overlay'], {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, '+=0.5')
      .call(() => { cursor.style.display = 'none'; });

    const createCellActivity = () => {
      gsap.to('.cell-nucleus', { scale: '+=0.05', duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.plant-cell', {
        background: 'radial-gradient(circle, rgba(140, 216, 103, 0.4) 0%, rgba(80, 200, 120, 0.2) 70%)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.3, from: 'random' }
      });
    };

    const animatePathogens = () => {
      gsap.to(pathogens, {
        x: '+=10',
        y: '+=10',
        rotation: '+=30',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.2, from: 'random' }
      });
    };

    const animateSpores = () => {
      gsap.to(spores, {
        x: '+=5',
        y: '+=5',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.05, from: 'random' }
      });
    };

    createCellActivity();
    animatePathogens();
    animateSpores();

    return () => {
      mainTimeline.kill();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.overflow = 'auto';
    };
  }, [onComplete]);

  return (
    <div className="loader-container">
      <div className="microscope-view">
        <div className="microscope-circle">
          <div className="grid-lines"></div>
          <div className="plant-cell main-cell">
            <div className="cell-nucleus"></div>
          </div>
          <div className="measuring-line"></div>
          <div className="measuring-label">5μm</div>
        </div>
        <div className="scope-overlay">
          <div className="lens-flare"></div>
          <div className="scope-ring" style={{width: '600px', height: '600px'}}></div>
          <div className="scope-ring" style={{width: '580px', height: '580px'}}></div>
        </div>
        <div className="loading-label">INITIALIZING MICROSCOPE</div>
        <div className="loading-text">ANALYZING</div>
      </div>
      <div id="cursor"></div>
    </div>
  );
};

export default LoadingAnimation;
