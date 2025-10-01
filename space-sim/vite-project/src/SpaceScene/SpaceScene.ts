import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import { CelestialBody } from '../CelestialBodies/CelestialBody';

export class SpaceScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public objects: CelestialBody[] = [];

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private selectedObject: THREE.Mesh | null = null;

  private composer: EffectComposer;
  private outlinePass: OutlinePass;

  constructor(container: HTMLElement) {
    // Crear escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Cámara
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 20;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    // Controles
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;

    // Postprocesado (OutlinePass)
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    );
    this.outlinePass.edgeStrength = 5; // intensidad
    this.outlinePass.edgeGlow = 1;     // brillo
    this.outlinePass.edgeThickness = 2;// grosor del borde
    this.outlinePass.pulsePeriod = 0;  // sin parpadeo
    this.outlinePass.visibleEdgeColor.set('#00ffff'); // azul cian
    this.outlinePass.hiddenEdgeColor.set('#000000');  // bordes ocultos invisibles
    this.composer.addPass(this.outlinePass);

    // Eventos
    window.addEventListener('click', this.onMouseClick.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));

    // Iniciar animación
    this.animate();
  }

  // Agregar objeto celeste
  public addObject(obj: CelestialBody) {
    this.objects.push(obj);
    this.scene.add(obj.mesh);
  }

  // Manejo de clicks
  private onMouseClick(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const obj = intersects[0].object as THREE.Mesh;
      this.selectedObject = obj;

      // aplicar outline solo al objeto seleccionado
      this.outlinePass.selectedObjects = [obj];
    }
  }

  // Centrar cámara en objeto
  private focusOnObject(object: THREE.Object3D) {
    this.controls.target.lerp(object.position, 0.1);
  }

  // Animación
  private animate() {
    requestAnimationFrame(() => this.animate());

    // Actualizar objetos
    this.objects.forEach(obj => obj.update());

    // Centrar cámara si hay objeto seleccionado
    if (this.selectedObject) {
      this.focusOnObject(this.selectedObject);
    }

    this.controls.update();

    // Renderizar con postprocesado
    this.composer.render();
  }

  // Redimensionar ventana
  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }
}
