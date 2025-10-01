import { CelestialBody } from './CelestialBody';

export class Star extends CelestialBody {
  constructor(name: string, radius: number, options: { color?: number; textureUrl?: string } = {}) {
    super(name, radius, options, 0, 0, 0);
  }
}
