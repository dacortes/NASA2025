import type { ExoplanetParameters } from './components/ExoplanetSlider';

export interface PlanetConfig {
  name: string;
  description: string;
  parameters: ExoplanetParameters;
  visualProperties: {
    baseColor: number;
    atmosphereColor: number;
    surfaceVariation: number;
    glowIntensity: number;
    materialProperties: {
      roughness: number;
      metalness: number;
      emissiveIntensity: number;
    };
  };
  textureUrl: string;
}

export const PLANET_CONFIGS: Record<string, PlanetConfig> = {
  'Earth-like': {
    name: 'Earth-like',
    description: 'A terrestrial planet with liquid water and a breathable atmosphere',
    parameters: {
      mass: 1.0,
      radius: 1.0,
      temperature: 288,
      orbitalDistance: 1.0,
      atmosphere: 1.0,
      composition: 71,
      brightness: 1.0
    },
    visualProperties: {
      baseColor: 0x4a90e2, // Azul-verde como la Tierra
      atmosphereColor: 0x87ceeb, // Azul cielo
      surfaceVariation: 0.3,
      glowIntensity: 0.4,
      materialProperties: {
        roughness: 0.7,
        metalness: 0.1,
        emissiveIntensity: 0.0
      }
    },
    textureUrl: '/textures/earth.jpg'
  },

  'Super Earth': {
    name: 'Super Earth',
    description: 'A larger terrestrial planet, potentially habitable',
    parameters: {
      mass: 3.5,
      radius: 1.6,
      temperature: 280,
      orbitalDistance: 0.8,
      atmosphere: 2.5,
      composition: 65,
      brightness: 1.0
    },
    visualProperties: {
      baseColor: 0x8fbc8f, // Verde más oscuro
      atmosphereColor: 0x98fb98, // Verde claro
      surfaceVariation: 0.4,
      glowIntensity: 0.6,
      materialProperties: {
        roughness: 0.8,
        metalness: 0.05,
        emissiveIntensity: 0.0
      }
    },
    textureUrl: '/textures/earth.jpg'
  },

  'Ocean World': {
    name: 'Ocean World',
    description: 'A planet completely covered by a deep global ocean',
    parameters: {
      mass: 2.1,
      radius: 1.4,
      temperature: 295,
      orbitalDistance: 1.2,
      atmosphere: 1.5,
      composition: 95,
      brightness: 1.0
    },
    visualProperties: {
      baseColor: 0x0066cc, // Azul océano profundo
      atmosphereColor: 0x87ceeb, // Azul cielo con vapor de agua
      surfaceVariation: 0.1, // Superficie muy lisa (océano)
      glowIntensity: 0.7,
      materialProperties: {
        roughness: 0.2, // Muy liso como agua
        metalness: 0.0,
        emissiveIntensity: 0.1 // Ligeramente brillante por el agua
      }
    },
    textureUrl: '/textures/ocean.jpg'
  },

  'Hot Jupiter': {
    name: 'Hot Jupiter',
    description: 'A gas giant orbiting very close to its star',
    parameters: {
      mass: 150,
      radius: 12,
      temperature: 1500,
      orbitalDistance: 0.05,
      atmosphere: 80,
      composition: 5,
      brightness: 1.5
    },
    visualProperties: {
      baseColor: 0xff6b35, // Naranja-rojo caliente
      atmosphereColor: 0xff4500, // Rojo intenso
      surfaceVariation: 0.6, // Muchas tormentas de gas
      glowIntensity: 1.2,
      materialProperties: {
        roughness: 0.9,
        metalness: 0.0,
        emissiveIntensity: 0.3 // Brilla por el calor
      }
    },
    textureUrl: '/textures/jupiter.jpg'
  },

  'Gas Giant': {
    name: 'Gas Giant',
    description: 'A large planet composed mainly of hydrogen and helium',
    parameters: {
      mass: 80,
      radius: 8,
      temperature: 150,
      orbitalDistance: 5,
      atmosphere: 90,
      composition: 10,
      brightness: 0.8
    },
    visualProperties: {
      baseColor: 0xffd700, // Dorado como Júpiter
      atmosphereColor: 0xffa500, // Naranja-dorado
      surfaceVariation: 0.5, // Bandas de gas
      glowIntensity: 0.8,
      materialProperties: {
        roughness: 0.6,
        metalness: 0.0,
        emissiveIntensity: 0.0
      }
    },
    textureUrl: '/textures/jupiter.jpg'
  },

  'Ice Giant': {
    name: 'Ice Giant',
    description: 'A planet composed of ice, water, and other volatiles',
    parameters: {
      mass: 15,
      radius: 4,
      temperature: 75,
      orbitalDistance: 20,
      atmosphere: 50,
      composition: 80,
      brightness: 0.6
    },
    visualProperties: {
      baseColor: 0x00bfff, // Azul hielo
      atmosphereColor: 0x87ceeb, // Azul claro
      surfaceVariation: 0.2, // Superficie helada
      glowIntensity: 0.5,
      materialProperties: {
        roughness: 0.3, // Liso como hielo
        metalness: 0.1,
        emissiveIntensity: 0.05 // Ligeramente brillante
      }
    },
    textureUrl: '/textures/urano.jpg'
  },

  'Desert World': {
    name: 'Desert World',
    description: 'A dry, arid planet with little to no water',
    parameters: {
      mass: 0.8,
      radius: 0.9,
      temperature: 450,
      orbitalDistance: 0.7,
      atmosphere: 0.5,
      composition: 5,
      brightness: 1.2
    },
    visualProperties: {
      baseColor: 0xd2691e, // Marrón desértico
      atmosphereColor: 0xffa500, // Naranja polvoriento
      surfaceVariation: 0.4, // Dunas y rocas
      glowIntensity: 0.3,
      materialProperties: {
        roughness: 0.9, // Muy rugoso
        metalness: 0.0,
        emissiveIntensity: 0.0
      }
    },
    textureUrl: '/textures/desert.jpg'
  }
};

export function getPlanetConfig(planetType: string): PlanetConfig | null {
  return PLANET_CONFIGS[planetType] || null;
}

export function getTopClassificationConfig(classifications: Array<{name: string, probability: number}>): PlanetConfig | null {
  if (classifications.length === 0) return null;
  
  const topClassification = classifications[0];
  console.log(topClassification);
  return getPlanetConfig(topClassification.name);
}
