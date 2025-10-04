export interface ExoplanetParameters {
  mass: number;           // Earth masses (0.1 - 10)
  radius: number;         // Earth radii (0.1 - 2)
  temperature: number;    // Surface temperature in Kelvin (200 - 800)
  orbitalDistance: number; // AU (0.01 - 5)
  atmosphere: number;     // Atmospheric pressure (0 - 100 atm)
  composition: number;    // Water content percentage (0 - 100)
  brightness: number;     // Brightness/intensity (0.1 - 3.0)
}

export interface ExoplanetSliderConfig {
  min: number;
  max: number;
  step: number;
  label: string;
  unit: string;
  key: keyof ExoplanetParameters;
}

export const EXOPLANET_CONFIGS: ExoplanetSliderConfig[] = [
  {
    min: 0.1,
    max: 10,
    step: 0.1,
    label: 'Mass',
    unit: 'Earth masses',
    key: 'mass'
  },
  {
    min: 0.1,
    max: 2,
    step: 0.01,
    label: 'Radius',
    unit: 'Earth radii',
    key: 'radius'
  },
  {
    min: 200,
    max: 800,
    step: 10,
    label: 'Temperature',
    unit: 'K',
    key: 'temperature'
  },
  {
    min: 0.01,
    max: 5,
    step: 0.01,
    label: 'Orbital Distance',
    unit: 'AU',
    key: 'orbitalDistance'
  },
  {
    min: 0,
    max: 100,
    step: 1,
    label: 'Atmosphere',
    unit: 'atm',
    key: 'atmosphere'
  },
  {
    min: 0,
    max: 100,
    step: 1,
    label: 'Water Content',
    unit: '%',
    key: 'composition'
  },
  {
    min: 0.1,
    max: 3.0,
    step: 0.1,
    label: 'Brightness',
    unit: 'x',
    key: 'brightness'
  }
];

export class ExoplanetSlider {
  private container: HTMLElement;
  private parameters: ExoplanetParameters;
  private onChangeCallback?: (params: ExoplanetParameters) => void;

  constructor(container: HTMLElement, initialParams?: Partial<ExoplanetParameters>) {
    this.container = container;
    this.parameters = {
      mass: 1,
      radius: 1,
      temperature: 288,
      orbitalDistance: 1,
      atmosphere: 1,
      composition: 70,
      brightness: 1.0,
      ...initialParams
    };
    
    this.render();
    console.log('ExoplanetSlider rendered with', EXOPLANET_CONFIGS.length, 'sliders');
  }

  public setOnChange(callback: (params: ExoplanetParameters) => void) {
    this.onChangeCallback = callback;
  }

  public getParameters(): ExoplanetParameters {
    return { ...this.parameters };
  }

  public setParameters(params: Partial<ExoplanetParameters>) {
    this.parameters = { ...this.parameters, ...params };
    this.updateSliders();
  }

  private render() {
    this.container.innerHTML = `
      <div class="exoplanet-controls">
        <h3>Exoplanet Parameters</h3>
        <div class="sliders-container">
          ${EXOPLANET_CONFIGS.map(config => this.createSliderHTML(config)).join('')}
        </div>
        <div class="controls-footer">
          <button id="classify-btn" class="classify-button">Classify Exoplanet</button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  private createSliderHTML(config: ExoplanetSliderConfig): string {
    const value = this.parameters[config.key];
    return `
      <div class="slider-group">
        <label for="${config.key}-slider">
          ${config.label}: <span id="${config.key}-value">${value.toFixed(config.step < 1 ? 2 : 0)}</span> ${config.unit}
        </label>
        <input 
          type="range" 
          id="${config.key}-slider"
          min="${config.min}" 
          max="${config.max}" 
          step="${config.step}" 
          value="${value}"
          class="exoplanet-slider"
        />
      </div>
    `;
  }

  private setupEventListeners() {
    EXOPLANET_CONFIGS.forEach(config => {
      const slider = this.container.querySelector(`#${config.key}-slider`) as HTMLInputElement;
      const valueDisplay = this.container.querySelector(`#${config.key}-value`) as HTMLElement;
      
      slider.addEventListener('input', () => {
        const value = parseFloat(slider.value);
        this.parameters[config.key] = value;
        valueDisplay.textContent = value.toFixed(config.step < 1 ? 2 : 0);
        
        if (this.onChangeCallback) {
          this.onChangeCallback(this.getParameters());
        }
      });
    });

    const classifyBtn = this.container.querySelector('#classify-btn') as HTMLButtonElement;
    classifyBtn.addEventListener('click', () => {
      this.onClassifyClick();
    });
  }

  private updateSliders() {
    EXOPLANET_CONFIGS.forEach(config => {
      const slider = this.container.querySelector(`#${config.key}-slider`) as HTMLInputElement;
      const valueDisplay = this.container.querySelector(`#${config.key}-value`) as HTMLElement;
      
      if (slider && valueDisplay) {
        slider.value = this.parameters[config.key].toString();
        valueDisplay.textContent = this.parameters[config.key].toFixed(config.step < 1 ? 2 : 0);
      }
    });
  }

  private onClassifyClick() {
    if (this.onChangeCallback) {
      this.onChangeCallback(this.getParameters());
    }
  }
}
