import { CelestialBody } from './CelestialBody';
import type { PlanetConfig } from '../PlanetConfigs';

export class Planet extends CelestialBody {
  constructor(
    name: string,
    radius: number,
    options: { 
      color?: number; 
      textureUrl?: string;
      temperature?: number;
      atmosphere?: number;
      composition?: number;
      brightness?: number;
      planetConfig?: PlanetConfig | null;
    } = {},
    rotationSpeed: number = 0.01,
    orbitSpeed: number = 0.001,
    distance: number = 5
  ) {
    // Los planetas no generan luz, solo reflejan
    super(name, radius, { ...options, isStar: false }, rotationSpeed, orbitSpeed, distance);
  }
}

