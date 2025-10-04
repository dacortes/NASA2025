import * as THREE from 'three';
import type { PlanetConfig } from '../PlanetConfigs';

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
  public atmosphereMesh?: THREE.Mesh; // atmósfera opcional
  public coronaMeshes: THREE.Mesh[] = []; // efectos de corona para estrellas

  constructor(
    name: string,
    radius: number,
    options: {
      color?: number;
      textureUrl?: string;
      lightColor?: number;
      lightIntensity?: number;
      temperature?: number;
      atmosphere?: number;
      composition?: number;
      brightness?: number;
      isStar?: boolean;
      planetConfig?: PlanetConfig | null;
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

    // Crear geometría con más detalle para mejor visualización
    const geometry = new THREE.SphereGeometry(radius, 128, 128);
    
    // Usar configuración de planeta si está disponible, sino usar cálculos dinámicos
    const visualProps = options.planetConfig?.visualProperties;
    
    // Aplicar variaciones de superficie para hacer el objeto menos plano
    const surfaceVariation = visualProps?.surfaceVariation ?? (options.composition || 50) / 100;
    this.addSurfaceVariations(geometry, surfaceVariation);
    
    const materialParams: THREE.MeshStandardMaterialParameters = {
      color: visualProps?.baseColor ?? options.color ?? 0xffffff,
      roughness: visualProps?.materialProperties.roughness ?? this.calculateRoughness(options.temperature || 288),
      metalness: visualProps?.materialProperties.metalness ?? this.calculateMetalness(options.composition || 50),
      emissiveIntensity: visualProps?.materialProperties.emissiveIntensity ?? 0,
      normalScale: new THREE.Vector2(0.5, 0.5), // Para agregar detalle superficial
      envMapIntensity: 0.8 // Para reflejos del ambiente
    };

    if (options.textureUrl) {
      materialParams.map = new THREE.TextureLoader().load(options.textureUrl);
    }

    const material = new THREE.MeshStandardMaterial(materialParams);
    this.originalColor = options.color ?? 0xffffff;

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Crear efectos visuales adicionales
    if (options.isStar) {
      this.createStarEffects(options);
    } else {
      this.createPlanetEffects(options);
    }

    // Luz opcional: solo para estrellas
    if (options.lightIntensity && options.lightIntensity > 0) {
      const color = options.lightColor ?? 0xffffff;
      const brightness = options.brightness || 1.0;
      this.light = new THREE.PointLight(color, options.lightIntensity * brightness, 1000);
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

    // Actualizar efectos de corona (animación sutil)
    this.coronaMeshes.forEach((corona, index) => {
      corona.rotation.y += 0.001 * (index + 1);
    });
  }

  // Métodos para efectos visuales avanzados
  private addSurfaceVariations(geometry: THREE.SphereGeometry, surfaceVariation: number): void {
    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    
    // Crear variaciones de superficie basadas en el factor de variación
    for (let i = 0; i < positions.count; i++) {
      const variation = surfaceVariation * 0.1 * (Math.random() - 0.5);
      
      // Aplicar variación a la posición
      positions.setXYZ(i, 
        positions.getX(i) * (1 + variation),
        positions.getY(i) * (1 + variation),
        positions.getZ(i) * (1 + variation)
      );
    }
    
    positions.needsUpdate = true;
    normals.needsUpdate = true;
  }

  private calculateRoughness(temperature: number): number {
    // Planetas calientes son más rugosos (volcánicos)
    // Planetas fríos son más suaves (glaciares)
    return Math.min(1, Math.max(0.1, (temperature - 200) / 600));
  }

  private calculateMetalness(composition: number): number {
    // Alto contenido de agua = menos metálico
    return Math.max(0, Math.min(0.8, (100 - composition) / 100));
  }

  private createStarEffects(options: any): void {
    // Efecto de corona más prominente para estrellas
    for (let i = 1; i <= 4; i++) {
      const coronaGeometry = new THREE.SphereGeometry(this.radius * (1 + i * 0.2), 32, 32);
      const coronaMaterial = new THREE.MeshBasicMaterial({
        color: options.color || 0xffff00,
        transparent: true,
        opacity: 0.15 / i,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending // Para efecto de glow más brillante
      });
      
      const coronaMesh = new THREE.Mesh(coronaGeometry, coronaMaterial);
      this.coronaMeshes.push(coronaMesh);
    }

    // Hacer la estrella muy emisiva con brillo ajustable
    const brightness = options.brightness || 1.0;
    (this.mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(options.color || 0xffff00);
    (this.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8 * brightness;
    
    // Agregar brillo adicional
    (this.mesh.material as THREE.MeshStandardMaterial).roughness = 0.1;
    (this.mesh.material as THREE.MeshStandardMaterial).metalness = 0.0;
  }

  private createPlanetEffects(options: any): void {
    // Crear atmósfera si tiene
    if (options.atmosphere && options.atmosphere > 0.1) {
      this.createAtmosphere(options);
    }
  }

  private createAtmosphere(options: any): void {
    const atmosphereGeometry = new THREE.SphereGeometry(this.radius * 1.08, 64, 64);
    const visualProps = options.planetConfig?.visualProperties;
    const atmosphereColor = visualProps?.atmosphereColor ?? this.getAtmosphereColor(options.temperature || 288);
    const glowIntensity = visualProps?.glowIntensity ?? 0.5;
    
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: atmosphereColor,
      transparent: true,
      opacity: (options.atmosphere || 1) * 0.4,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    
    this.atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    
    // Crear múltiples capas de glow atmosférico más prominentes
    for (let i = 1; i <= 3; i++) {
      const glowGeometry = new THREE.SphereGeometry(this.radius * (1.12 + i * 0.04), 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: atmosphereColor,
        transparent: true,
        opacity: (options.atmosphere || 1) * glowIntensity * 0.1 * (1 - i * 0.3),
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      this.coronaMeshes.push(glowMesh);
    }
  }

  private getAtmosphereColor(temperature: number): number {
    if (temperature < 200) {
      return 0x87ceeb; // Azul (atmósfera delgada/fría)
    } else if (temperature < 400) {
      return 0x90ee90; // Verde (oxígeno)
    } else {
      return 0xff6347; // Naranja/rojo (atmósfera caliente/densa)
    }
  }

  // Método para limpiar efectos al destruir el objeto
  public dispose(): void {
    this.coronaMeshes.forEach(mesh => {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => mat.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    
    if (this.atmosphereMesh) {
      this.atmosphereMesh.geometry.dispose();
      if (Array.isArray(this.atmosphereMesh.material)) {
        this.atmosphereMesh.material.forEach(mat => mat.dispose());
      } else {
        this.atmosphereMesh.material.dispose();
      }
    }
  }
}
