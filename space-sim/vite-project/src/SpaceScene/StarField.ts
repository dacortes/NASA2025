import * as THREE from 'three';

export class StarField {
  private points: THREE.Points;

  constructor() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 1000;
      positions[i3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i3 + 2] = (Math.random() - 0.5) * 1000;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });
    
    this.points = new THREE.Points(geometry, material);
  }

  public getMesh(): THREE.Points {
    return this.points;
  }
}
