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
  public light?: THREE.PointLight; // luz opcional para estrellas

  constructor(
    name: string,
    radius: number,
    options: {
      color?: number;
      textureUrl?: string;
      lightColor?: number;
      lightIntensity?: number;
    } = {},
    rotationSpeed: number = 0.01,
    orbitSpeed: number = 0.0,
    distance: number = 0
  ) {
    this.name = name;
    this.radius = radius;
    this.rotationSpeed = rotationSpeed;
    this.orbitSpeed = orbitSpeed;
    this.distance = distance;

    // Material con shading para que refleje luz
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const materialParams: THREE.MeshStandardMaterialParameters = {
      color: options.color ?? 0xffffff,
      roughness: 1,
      metalness: 0
    };

    if (options.textureUrl) {
      materialParams.map = new THREE.TextureLoader().load(options.textureUrl);
    }

    const material = new THREE.MeshStandardMaterial(materialParams);
    this.originalColor = options.color ?? 0xffffff;

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;    // puede proyectar sombra
    this.mesh.receiveShadow = true; // puede recibir sombra

    // Luz opcional: solo para estrellas
    if (options.lightIntensity && options.lightIntensity > 0) {
      const color = options.lightColor ?? 0xffffff;
      this.light = new THREE.PointLight(color, options.lightIntensity, 1000);
      this.light.castShadow = true;
      this.light.shadow.mapSize.width = 1024;
      this.light.shadow.mapSize.height = 1024;
    }
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

    if (this.light) {
      this.light.position.copy(this.mesh.position);
    }
  }
}
