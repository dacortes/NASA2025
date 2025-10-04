import type { ExoplanetParameters } from './components/ExoplanetSlider';

export interface ExoplanetType {
  name: string;
  description: string;
  characteristics: {
    massRange: [number, number];
    radiusRange: [number, number];
    temperatureRange: [number, number];
    orbitalDistanceRange: [number, number];
    atmosphereRange: [number, number];
    compositionRange: [number, number];
  };
  probability: number;
}

export class ExoplanetClassifier {
  private exoplanetTypes: Omit<ExoplanetType, 'probability'>[] = [
    {
      name: 'Earth-like',
      description: 'A terrestrial planet with liquid water and a breathable atmosphere',
      characteristics: {
        massRange: [0.5, 2],
        radiusRange: [0.8, 1.5],
        temperatureRange: [250, 320],
        orbitalDistanceRange: [0.7, 1.5],
        atmosphereRange: [0.8, 1.2],
        compositionRange: [60, 90]
      }
    },
    {
      name: 'Super Earth',
      description: 'A larger terrestrial planet, potentially habitable',
      characteristics: {
        massRange: [2, 10],
        radiusRange: [1.2, 2],
        temperatureRange: [200, 350],
        orbitalDistanceRange: [0.5, 2],
        atmosphereRange: [1, 50],
        compositionRange: [30, 80]
      }
    },
    {
      name: 'Hot Jupiter',
      description: 'A gas giant orbiting very close to its star',
      characteristics: {
        massRange: [50, 500],
        radiusRange: [8, 15],
        temperatureRange: [500, 2000],
        orbitalDistanceRange: [0.01, 0.1],
        atmosphereRange: [50, 100],
        compositionRange: [0, 20]
      }
    },
    {
      name: 'Gas Giant',
      description: 'A large planet composed mainly of hydrogen and helium',
      characteristics: {
        massRange: [10, 500],
        radiusRange: [3, 12],
        temperatureRange: [100, 500],
        orbitalDistanceRange: [1, 10],
        atmosphereRange: [50, 100],
        compositionRange: [0, 30]
      }
    },
    {
      name: 'Ice Giant',
      description: 'A planet composed of ice, water, and other volatiles',
      characteristics: {
        massRange: [5, 50],
        radiusRange: [2, 6],
        temperatureRange: [50, 200],
        orbitalDistanceRange: [5, 30],
        atmosphereRange: [10, 100],
        compositionRange: [50, 95]
      }
    },
    {
      name: 'Ocean World',
      description: 'A planet completely covered by a deep global ocean',
      characteristics: {
        massRange: [1, 10],
        radiusRange: [1, 2.5],
        temperatureRange: [250, 350],
        orbitalDistanceRange: [0.5, 2],
        atmosphereRange: [1, 10],
        compositionRange: [80, 100]
      }
    },
    {
      name: 'Desert World',
      description: 'A dry, arid planet with little to no water',
      characteristics: {
        massRange: [0.5, 5],
        radiusRange: [0.8, 2],
        temperatureRange: [300, 600],
        orbitalDistanceRange: [0.3, 1],
        atmosphereRange: [0.1, 5],
        compositionRange: [0, 20]
      }
    }
  ];

  public classify(parameters: ExoplanetParameters): ExoplanetType[] {
    const results: ExoplanetType[] = [];

    this.exoplanetTypes.forEach(type => {
      const probability = this.calculateProbability(parameters, type);
      if (probability > 0.1) { // Only include types with >10% probability
        results.push({
          ...type,
          probability: Math.round(probability * 100) / 100
        });
      }
    });

    // Sort by probability (highest first)
    return results.sort((a, b) => b.probability - a.probability);
  }

  private calculateProbability(parameters: ExoplanetParameters, type: Omit<ExoplanetType, 'probability'>): number {
    const weights = {
      mass: 0.2,
      radius: 0.2,
      temperature: 0.2,
      orbitalDistance: 0.15,
      atmosphere: 0.15,
      composition: 0.1
    };

    let totalScore = 0;
    let totalWeight = 0;

    // Mass match
    const massScore = this.getRangeScore(
      parameters.mass,
      type.characteristics.massRange
    );
    totalScore += massScore * weights.mass;
    totalWeight += weights.mass;

    // Radius match
    const radiusScore = this.getRangeScore(
      parameters.radius,
      type.characteristics.radiusRange
    );
    totalScore += radiusScore * weights.radius;
    totalWeight += weights.radius;

    // Temperature match
    const temperatureScore = this.getRangeScore(
      parameters.temperature,
      type.characteristics.temperatureRange
    );
    totalScore += temperatureScore * weights.temperature;
    totalWeight += weights.temperature;

    // Orbital distance match
    const orbitalScore = this.getRangeScore(
      parameters.orbitalDistance,
      type.characteristics.orbitalDistanceRange
    );
    totalScore += orbitalScore * weights.orbitalDistance;
    totalWeight += weights.orbitalDistance;

    // Atmosphere match
    const atmosphereScore = this.getRangeScore(
      parameters.atmosphere,
      type.characteristics.atmosphereRange
    );
    totalScore += atmosphereScore * weights.atmosphere;
    totalWeight += weights.atmosphere;

    // Composition match
    const compositionScore = this.getRangeScore(
      parameters.composition,
      type.characteristics.compositionRange
    );
    totalScore += compositionScore * weights.composition;
    totalWeight += weights.composition;

    return totalScore / totalWeight;
  }

  private getRangeScore(value: number, range: [number, number]): number {
    const [min, max] = range;
    
    if (value >= min && value <= max) {
      // Perfect match
      return 1.0;
    }
    
    // Calculate how far outside the range
    let distance = 0;
    if (value < min) {
      distance = min - value;
    } else if (value > max) {
      distance = value - max;
    }
    
    // Normalize distance (adjust this factor based on typical ranges)
    const rangeSize = max - min;
    const normalizedDistance = distance / (rangeSize * 0.5);
    
    // Return a score that decreases exponentially with distance
    return Math.max(0, Math.exp(-normalizedDistance));
  }

  public getTargetExoplanet(): { name: string; parameters: ExoplanetParameters } {
    const targets = [
      {
        name: 'Earth-like',
        parameters: {
          mass: 1.0,
          radius: 1.0,
          temperature: 288,
          orbitalDistance: 1.0,
          atmosphere: 1.0,
          composition: 71
        }
      },
      {
        name: 'Super Earth',
        parameters: {
          mass: 3.5,
          radius: 1.6,
          temperature: 280,
          orbitalDistance: 0.8,
          atmosphere: 2.5,
          composition: 65
        }
      },
      {
        name: 'Ocean World',
        parameters: {
          mass: 2.1,
          radius: 1.4,
          temperature: 295,
          orbitalDistance: 1.2,
          atmosphere: 1.5,
          composition: 95
        }
      }
    ];

    return targets[Math.floor(Math.random() * targets.length)];
  }

  public calculateSimilarity(userParams: ExoplanetParameters, targetParams: ExoplanetParameters): number {
    const weights = {
      mass: 0.2,
      radius: 0.2,
      temperature: 0.2,
      orbitalDistance: 0.15,
      atmosphere: 0.15,
      composition: 0.1
    };

    let totalSimilarity = 0;

    // Calculate similarity for each parameter
    Object.keys(weights).forEach(key => {
      const userValue = userParams[key as keyof ExoplanetParameters];
      const targetValue = targetParams[key as keyof ExoplanetParameters];
      const weight = weights[key as keyof typeof weights];
      
      // Normalize values and calculate similarity
      const similarity = 1 - Math.abs(userValue - targetValue) / Math.max(userValue, targetValue, 1);
      totalSimilarity += similarity * weight;
    });

    return Math.max(0, Math.min(1, totalSimilarity));
  }
}
