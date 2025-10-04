// import { CelestialBody } from './CelestialBody';

// export class Star extends CelestialBody {
//   constructor(
//     name: string,
//     radius: number,
//     options: {
//       color?: number;
//       textureUrl?: string;
//       lightColor?: number;
//       lightIntensity?: number;
//     } = {}
//   ) {
//     // Las estrellas sí generan luz
//     super(name, radius, { 
//       color: options.color ?? 0xffff00, // amarillo por defecto
//       textureUrl: options.textureUrl,
//       lightColor: options.lightColor ?? 0xfff5c0, // tono cálido
//       lightIntensity: options.lightIntensity ?? 2.5, // más fuerte
//     });
//   }
// }

import { CelestialBody } from './CelestialBody';

export class Star extends CelestialBody {
  constructor(
    name: string,
    radius: number,
    options: {
      color?: number;
      textureUrl?: string;
      lightColor?: number;
      lightIntensity?: number;
      temperature?: number;
    } = {}
  ) {
    // Las estrellas generan luz automáticamente
    super(name, radius, {
      color: options.color ?? 0xffff00,
      textureUrl: options.textureUrl,
      lightColor: options.lightColor ?? 0xfff5c0,
      lightIntensity: options.lightIntensity ?? 2.5,
      temperature: options.temperature ?? 5778, // Temperatura del Sol
      isStar: true
    });
  }
}
