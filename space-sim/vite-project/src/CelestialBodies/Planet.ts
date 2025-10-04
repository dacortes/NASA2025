import { CelestialBody } from './CelestialBody';

export class Planet extends CelestialBody {
  constructor(
    name: string,
    radius: number,
    options: { color?: number; textureUrl?: string } = {},
    rotationSpeed: number = 0.01,
    orbitSpeed: number = 0.001,
    distance: number = 5
  ) {
    // Los planetas no generan luz, solo reflejan
    super(name, radius, options, rotationSpeed, orbitSpeed, distance);
  }
}

