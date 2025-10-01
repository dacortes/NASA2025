import * as THREE from 'three';

export abstract class CelestialBody {
  public mesh: THREE.Mesh;
  public name: string;
  public radius: number;
  public rotationSpeed: number;
  public orbitSpeed: number;
  public distance: number;
  protected angle: number = 0;
  public originalColor: number;

  constructor(
    name: string,
    radius: number,
    options: { color?: number; textureUrl?: string },
    rotationSpeed: number = 0.01,
    orbitSpeed: number = 0.0,
    distance: number = 0
  ) {
    this.name = name;
    this.radius = radius;
    this.rotationSpeed = rotationSpeed;
    this.orbitSpeed = orbitSpeed;
    this.distance = distance;

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material: THREE.Material;

    if (options.textureUrl) {
      const texture = new THREE.TextureLoader().load(options.textureUrl);
      material = new THREE.MeshBasicMaterial({ map: texture });
      this.originalColor = 0xffffff;
    } else {
      material = new THREE.MeshBasicMaterial({ color: options.color ?? 0xffffff });
      this.originalColor = options.color ?? 0xffffff;
    }

    this.mesh = new THREE.Mesh(geometry, material);
  }

  public rotate(): void {
    this.mesh.rotation.y += this.rotationSpeed;
  }

  public orbit(): void {
    if (this.orbitSpeed === 0 || this.distance === 0) return;
    this.angle += this.orbitSpeed;
    this.mesh.position.x = Math.cos(this.angle) * this.distance;
    this.mesh.position.z = Math.sin(this.angle) * this.distance;
  }

  public update(): void {
    this.rotate();
    this.orbit();
  }
}
