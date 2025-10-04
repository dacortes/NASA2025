import { ExoplanetSlider } from './components/ExoplanetSlider';
import type { ExoplanetParameters } from './components/ExoplanetSlider';
import { ExoplanetClassifier } from './ExoplanetClassifier';
import type { ExoplanetType } from './ExoplanetClassifier';
import { SpaceScene } from './SpaceScene/SpaceScene';
import { Planet } from './CelestialBodies/Planet';

export interface GameState {
  targetExoplanet: {
    name: string;
    parameters: ExoplanetParameters;
  };
  currentGuess: ExoplanetParameters;
  lastClassification: ExoplanetType[];
  similarity: number;
  attempts: number;
  maxAttempts: number;
  gameWon: boolean;
}

export class ExoplanetGame {
  private container: HTMLElement;
  private gameState: GameState;
  private slider!: ExoplanetSlider;
  private classifier: ExoplanetClassifier;
  private spaceScene!: SpaceScene;
  private feedbackContainer!: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.classifier = new ExoplanetClassifier();
    this.gameState = this.initializeGame();
    
    this.setupUI();
    this.setupSpaceScene();
    this.setupGameLogic();
  }

  private initializeGame(): GameState {
    const targetExoplanet = this.classifier.getTargetExoplanet();
    return {
      targetExoplanet,
      currentGuess: {
        mass: 1,
        radius: 1,
        temperature: 288,
        orbitalDistance: 1,
        atmosphere: 1,
        composition: 70
      },
      lastClassification: [],
      similarity: 0,
      attempts: 0,
      maxAttempts: 10,
      gameWon: false
    };
  }

  private setupUI() {
    this.container.innerHTML = `
      <div class="game-container">
        <div class="game-header">
          <h1>Exoplanet Classification Game</h1>
          <div class="game-info">
            <div class="target-info">
              <h3>Target: <span id="target-name">${this.gameState.targetExoplanet.name}</span></h3>
              <p id="target-description"></p>
            </div>
            <div class="game-stats">
              <div>Attempts: <span id="attempts">${this.gameState.attempts}</span>/<span id="max-attempts">${this.gameState.maxAttempts}</span></div>
              <div>Similarity: <span id="similarity">0%</span></div>
            </div>
          </div>
        </div>
        
        <div class="game-content">
          <div class="space-view">
            <div id="space-container"></div>
          </div>
          
          <div class="controls-overlay">
            <div class="controls-left">
              <div id="slider-container"></div>
            </div>
            <div class="controls-right">
              <div id="feedback-container"></div>
            </div>
          </div>
          
        </div>
      </div>
    `;

    this.feedbackContainer = this.container.querySelector('#feedback-container') as HTMLElement;
    
    // Initialize slider
    const sliderContainer = this.container.querySelector('#slider-container') as HTMLElement;
    if (!sliderContainer) {
      console.error('Slider container not found!');
      return;
    }
    this.slider = new ExoplanetSlider(sliderContainer, this.gameState.currentGuess);
    console.log('Slider initialized successfully');
    
    this.updateTargetDescription();
  }

  private setupSpaceScene() {
    const spaceContainer = this.container.querySelector('#space-container') as HTMLElement;
    this.spaceScene = new SpaceScene(spaceContainer);
    
    // Create a representative planet based on current parameters
    this.updatePlanetVisualization();
  }

  private setupGameLogic() {
    this.slider.setOnChange((parameters: ExoplanetParameters) => {
      this.gameState.currentGuess = parameters;
      this.updatePlanetVisualization();
    });

    // Override the classify button behavior
    const classifyBtn = this.container.querySelector('#classify-btn') as HTMLButtonElement;
    classifyBtn.addEventListener('click', () => {
      this.handleClassification();
    });
  }

  private updateTargetDescription() {
    const targetName = this.container.querySelector('#target-name') as HTMLElement;
    const targetDesc = this.container.querySelector('#target-description') as HTMLElement;
    
    targetName.textContent = this.gameState.targetExoplanet.name;
    
    // Get description from classifier
    const allTypes = this.classifier.classify(this.gameState.targetExoplanet.parameters);
    const targetType = allTypes.find(type => type.name === this.gameState.targetExoplanet.name);
    
    if (targetType) {
      targetDesc.textContent = targetType.description;
    }
  }

  private updatePlanetVisualization() {
    // Clear existing planets
    this.spaceScene.objects.forEach(obj => {
      this.spaceScene.scene.remove(obj.mesh);
    });
    this.spaceScene.objects = [];

    // Create planet based on current parameters
    const size = Math.max(0.5, Math.min(2, this.gameState.currentGuess.radius));
    const color = this.getPlanetColor();
    
    const planet = new Planet(
      'Current Guess',
      size,
      { color },
      0.01,
      0.002,
      8
    );
    
    this.spaceScene.addObject(planet);
  }

  private getPlanetColor(): number {
    const { temperature, composition } = this.gameState.currentGuess;
    
    // Base color from temperature
    let r = 0, g = 0, b = 0;
    
    if (temperature < 250) {
      // Cold - blue/white
      r = 100; g = 150; b = 255;
    } else if (temperature < 350) {
      // Moderate - green/blue
      r = 100; g = 200; b = 150;
    } else if (temperature < 500) {
      // Warm - yellow/green
      r = 200; g = 200; b = 100;
    } else {
      // Hot - red/orange
      r = 255; g = 150; b = 100;
    }
    
    // Adjust for water content (more blue for high water)
    const waterFactor = composition / 100;
    r = Math.floor(r * (1 - waterFactor * 0.3));
    g = Math.floor(g * (1 - waterFactor * 0.2));
    b = Math.floor(b + waterFactor * 50);
    
    return (r << 16) | (g << 8) | b;
  }

  private async handleClassification() {
    if (this.gameState.gameWon || this.gameState.attempts >= this.gameState.maxAttempts) {
      return;
    }

    this.gameState.attempts++;
    
    // TODO: Replace with backend API call
    // Send parameters to backend AI for classification
    try {
      const response = await this.sendToBackend(this.gameState.currentGuess);
      this.gameState.lastClassification = response.classifications;
      this.gameState.similarity = response.similarity;
    } catch (error) {
      console.error('Backend classification failed:', error);
      // Fallback to local classification
      this.gameState.lastClassification = this.classifier.classify(this.gameState.currentGuess);
      this.gameState.similarity = this.classifier.calculateSimilarity(
        this.gameState.currentGuess,
        this.gameState.targetExoplanet.parameters
      );
    }

    // Check if won
    if (this.gameState.similarity >= 0.8) {
      this.gameState.gameWon = true;
      this.showWinMessage();
    }

    this.updateUI();
    this.showFeedback();
  }

  private async sendToBackend(parameters: ExoplanetParameters) {
    const response = await fetch('/api/classify-exoplanet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parameters,
        targetExoplanet: this.gameState.targetExoplanet.name
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  private updateUI() {
    const attemptsEl = this.container.querySelector('#attempts') as HTMLElement;
    const similarityEl = this.container.querySelector('#similarity') as HTMLElement;
    
    attemptsEl.textContent = this.gameState.attempts.toString();
    similarityEl.textContent = `${Math.round(this.gameState.similarity * 100)}%`;
  }

  private showFeedback() {
    const topClassification = this.gameState.lastClassification[0];
    
    let feedbackHTML = `
      <div class="feedback-section">
        <h4>Classification Result</h4>
        <div class="classification-result">
          <div class="top-result">
            <strong>${topClassification.name}</strong> (${Math.round(topClassification.probability * 100)}% match)
          </div>
          <p>${topClassification.description}</p>
        </div>
        
        <div class="similarity-feedback">
          <h5>Similarity to Target: ${Math.round(this.gameState.similarity * 100)}%</h5>
          ${this.getSimilarityMessage()}
        </div>
        
        ${this.gameState.lastClassification.length > 1 ? `
          <div class="other-classifications">
            <h5>Other Possibilities:</h5>
            ${this.gameState.lastClassification.slice(1, 4).map(type => 
              `<div>${type.name} (${Math.round(type.probability * 100)}%)</div>`
            ).join('')}
          </div>
        ` : ''}
        
      </div>
    `;

    this.feedbackContainer.innerHTML = feedbackHTML;

    // Add restart button listener
    const restartBtn = this.feedbackContainer.querySelector('#restart-btn') as HTMLButtonElement;
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.restartGame();
      });
    }
  }

  private getSimilarityMessage(): string {
    const similarity = this.gameState.similarity;
    
    if (similarity >= 0.99) {
      return '<div class="similarity-perfect">🎯 Perfect! It\'s an almost exact match! <button id="restart-btn" class="play-again-btn">🎉 Play Again</button></div>';
    } else if (similarity >= 0.8) {
      return '<div class="similarity-excellent">Excellent! Very close to the target! <button id="restart-btn" class="play-again-btn">🎉 Play Again</button></div>';
    } else if (similarity >= 0.6) {
      return '<div class="similarity-good">Good! You\'re getting closer!</div>';
    } else if (similarity >= 0.4) {
      return '<div class="similarity-fair">Fair. Try adjusting some parameters.</div>';
    } else {
      return '<div class="similarity-poor">Keep trying! You\'re still far from the target.</div>';
    }
  }

  private showWinMessage() {
    // Could add confetti or other celebration effects here
    console.log('Game won!');
  }

  private restartGame() {
    this.gameState = this.initializeGame();
    this.slider.setParameters(this.gameState.currentGuess);
    this.updateTargetDescription();
    this.updateUI();
    this.updatePlanetVisualization();
    this.feedbackContainer.innerHTML = '';
  }

  public getGameState(): GameState {
    return { ...this.gameState };
  }
}
