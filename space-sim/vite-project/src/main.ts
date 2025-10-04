// import { SpaceScene } from './SpaceScene/SpaceScene';
// import { Planet } from './CelestialBodies/Planet';
// import { Star } from './CelestialBodies/Star';

// // Crear escena y pasarle el body como contenedor
// const spaceScene = new SpaceScene(document.body);

// // Sistema solar
// const sun = new Star('Sun', 2, { textureUrl: '/textures/sun.jpg' });
// spaceScene.addObject(sun);

// const earth = new Planet('Earth', 1, { textureUrl: '/textures/earth.jpg' }, 0.01, 0.02, 8);
// spaceScene.addObject(earth);

// const mars = new Planet('Mars', 0.7, { color: 0xff6600 }, 0.01, 0.015, 12);
// spaceScene.addObject(mars);

// const spaceScene = new SpaceScene(document.body);

// // Sistema solar con textura
// const sun = new Star('Sun', 2, { textureUrl: '/textures/sun.jpg' });
// spaceScene.addObject(sun);

// const earth = new Planet('Earth', 1, { textureUrl: '/textures/earth.jpg' }, 0.01, 0.02, 8);
// spaceScene.addObject(earth);

// const mars = new Planet('Mars', 0.7, { color: 0xff6600 }, 0.01, 0.015, 12);
// spaceScene.addObject(mars);


// Otra vista: solo un planeta
// const planetScene = new SpaceScene(document.body);
// const singlePlanet = new Planet('Solo', 1.5, { color: 0x00ff00 }, 0.02, 0, 0);
// planetScene.addObject(singlePlanet);

import { ExoplanetGame } from './ExoplanetGame';
import './game-styles.css';

// Initialize the Exoplanet Classification Game
new ExoplanetGame(document.body);

