// scene3d.js - Escena 3D para Colegio Ayacucho
// Aula Virtual con Paredes y Colores Realistas

class Aula3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.objects = [];
    this.init();
  }

  init() {
    // Configurar escena con fondo azul medio
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x3d5a80);
    this.scene.fog = new THREE.Fog(0x3d5a80, 15, 50);

    // Configurar cámara
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    this.camera.position.set(8, 5, 10);
    this.camera.lookAt(0, 1, 0);

    // Configurar renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Luces
    this.setupLights();

    // Crear objetos del aula
    this.createClassroom();

    // Controles de órbita
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 20;
    }

    // Manejar resize
    window.addEventListener('resize', () => this.onResize());

    // Iniciar animación
    this.animate();
  }

  setupLights() {
    // Luz ambiental suave
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    // Luz direccional principal (simula luz natural)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    // Luz puntual cálida
    const pointLight1 = new THREE.PointLight(0xffd9a3, 0.4, 15);
    pointLight1.position.set(0, 4, 0);
    this.scene.add(pointLight1);

    // Luz puntual azul suave
    const pointLight2 = new THREE.PointLight(0x98c1d9, 0.3, 12);
    pointLight2.position.set(-3, 4, -3);
    this.scene.add(pointLight2);
  }

  // ==================== PAREDES Y ESTRUCTURA ====================

  createParedes() {
    const wallHeight = 5;
    const wallThickness = 0.2;
    const roomWidth = 12;
    const roomDepth = 10;

    // Pared trasera - azul medio
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidth, wallHeight, wallThickness),
      new THREE.MeshStandardMaterial({ 
        color: 0x5a7fa5,
        roughness: 0.8
      })
    );
    backWall.position.set(0, wallHeight / 2, -roomDepth / 2);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Pared izquierda - azul claro
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth),
      new THREE.MeshStandardMaterial({ 
        color: 0x7ba3c7,
        roughness: 0.8
      })
    );
    leftWall.position.set(-roomWidth / 2, wallHeight / 2, 0);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Pared derecha - azul intermedio
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth),
      new THREE.MeshStandardMaterial({ 
        color: 0x648dae,
        roughness: 0.8
      })
    );
    rightWall.position.set(roomWidth / 2, wallHeight / 2, 0);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Techo - azul grisáceo
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidth, 0.2, roomDepth),
      new THREE.MeshStandardMaterial({ 
        color: 0x4a6480,
        roughness: 0.7
      })
    );
    ceiling.position.set(0, wallHeight, 0);
    ceiling.receiveShadow = true;
    this.scene.add(ceiling);

    // Franja decorativa azul brillante
    const stripMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0066ff,
      roughness: 0.4,
      metalness: 0.3,
      emissive: 0x0066ff,
      emissiveIntensity: 0.15
    });

    const backStrip = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidth, 0.3, 0.05),
      stripMaterial
    );
    backStrip.position.set(0, wallHeight - 0.5, -roomDepth / 2 + 0.1);
    this.scene.add(backStrip);
  }

  // ==================== PRIMITIVAS 3D ACTUALIZADAS ====================

  createPizarra(x = 0, y = 2, z = -3) {
    const group = new THREE.Group();

    // Marco de madera oscura
    const marcoMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3d2817,
      roughness: 0.7
    });
    
    const marcoTop = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.15, 0.1),
      marcoMaterial
    );
    marcoTop.position.y = 1.5;
    group.add(marcoTop);

    const marcoBottom = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.15, 0.1),
      marcoMaterial
    );
    marcoBottom.position.y = -1.5;
    group.add(marcoBottom);

    const marcoLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 3, 0.1),
      marcoMaterial
    );
    marcoLeft.position.x = -2.025;
    group.add(marcoLeft);

    const marcoRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 3, 0.1),
      marcoMaterial
    );
    marcoRight.position.x = 2.025;
    group.add(marcoRight);

    // Superficie de la pizarra (azul oscuro tipo pizarra)
    const superficie = new THREE.Mesh(
      new THREE.BoxGeometry(3.9, 2.7, 0.05),
      new THREE.MeshStandardMaterial({ 
        color: 0x1a3a52,
        roughness: 0.6,
        metalness: 0.1
      })
    );
    superficie.castShadow = true;
    superficie.receiveShadow = true;
    group.add(superficie);

    // Repisa de madera
    const repisa = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.1, 0.3),
      new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.6
      })
    );
    repisa.position.y = -1.6;
    repisa.position.z = 0.1;
    group.add(repisa);

    group.position.set(x, y, z);
    this.scene.add(group);
    this.objects.push(group);
    return group;
  }

  createLapicera(x = 0, y = 0, z = 0, color = 0x0066ff) {
    const group = new THREE.Group();

    const cuerpo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8),
      new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.3,
        metalness: 0.6
      })
    );
    cuerpo.castShadow = true;
    group.add(cuerpo);

    const punta = new THREE.Mesh(
      new THREE.ConeGeometry(0.015, 0.1, 8),
      new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.8,
        roughness: 0.2
      })
    );
    punta.position.y = -0.45;
    punta.castShadow = true;
    group.add(punta);

    const tapa = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.15, 8),
      new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.3,
        metalness: 0.6
      })
    );
    tapa.position.y = 0.475;
    group.add(tapa);

    group.position.set(x, y, z);
    group.rotation.z = Math.PI / 2;
    this.scene.add(group);
    this.objects.push(group);
    return group;
  }

  createLibro(x = 0, y = 0, z = 0, ancho = 0.6, alto = 0.8, grosor = 0.15, colorTapa = 0x8B0000) {
    const group = new THREE.Group();

    const tapa = new THREE.Mesh(
      new THREE.BoxGeometry(ancho, grosor, alto),
      new THREE.MeshStandardMaterial({ 
        color: colorTapa,
        roughness: 0.7,
        metalness: 0.1
      })
    );
    tapa.castShadow = true;
    tapa.receiveShadow = true;
    group.add(tapa);

    const paginas = new THREE.Mesh(
      new THREE.BoxGeometry(ancho - 0.02, grosor - 0.02, alto - 0.02),
      new THREE.MeshStandardMaterial({ 
        color: 0xFFF8DC,
        roughness: 0.9
      })
    );
    paginas.position.x = 0.01;
    group.add(paginas);

    const lomo = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, grosor + 0.01, alto + 0.01),
      new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        roughness: 0.8
      })
    );
    lomo.position.x = -ancho / 2;
    group.add(lomo);

    group.position.set(x, y, z);
    this.scene.add(group);
    this.objects.push(group);
    return group;
  }

  createCuaderno(x = 0, y = 0, z = 0, color = 0xFF6347) {
    const group = new THREE.Group();

    const ancho = 0.5;
    const grosor = 0.08;
    const alto = 0.6;

    const tapa = new THREE.Mesh(
      new THREE.BoxGeometry(ancho, grosor, alto),
      new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.6,
        metalness: 0.2
      })
    );
    tapa.castShadow = true;
    tapa.receiveShadow = true;
    group.add(tapa);

    // Espiral metálica
    const espiralGeometry = new THREE.TorusGeometry(0.015, 0.005, 8, 20, Math.PI);
    const espiralMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x888888,
      metalness: 0.9,
      roughness: 0.2
    });

    for (let i = 0; i < 10; i++) {
      const espiral = new THREE.Mesh(espiralGeometry, espiralMaterial);
      espiral.position.set(-ancho / 2, 0, -alto / 2 + 0.1 + i * 0.05);
      espiral.rotation.y = Math.PI / 2;
      group.add(espiral);
    }

    const etiqueta = new THREE.Mesh(
      new THREE.BoxGeometry(ancho - 0.1, grosor + 0.01, alto / 3),
      new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        roughness: 0.8
      })
    );
    etiqueta.position.y = grosor / 2 + 0.005;
    group.add(etiqueta);

    group.position.set(x, y, z);
    this.scene.add(group);
    this.objects.push(group);
    return group;
  }

  createPupitre(x = 0, y = 0, z = 0) {
    const group = new THREE.Group();

    // Superficie de madera clara
    const superficie = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.05, 0.8),
      new THREE.MeshStandardMaterial({ 
        color: 0xC19A6B,
        roughness: 0.7,
        metalness: 0.1
      })
    );
    superficie.position.y = 0.75;
    superficie.castShadow = true;
    superficie.receiveShadow = true;
    group.add(superficie);

    // Patas metálicas grises
    const pataMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6b6b6b,
      metalness: 0.8,
      roughness: 0.3
    });

    const pataGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.75, 8);
    
    const posicionesPatas = [
      [-0.55, 0.375, 0.35],
      [0.55, 0.375, 0.35],
      [-0.55, 0.375, -0.35],
      [0.55, 0.375, -0.35]
    ];

    posicionesPatas.forEach(pos => {
      const pata = new THREE.Mesh(pataGeometry, pataMaterial);
      pata.position.set(...pos);
      pata.castShadow = true;
      group.add(pata);
    });

    group.position.set(x, y, z);
    this.scene.add(group);
    this.objects.push(group);
    return group;
  }

  createEstante(x = 0, y = 0, z = 0) {
    const group = new THREE.Group();

    // Madera oscura para el estante
    const maderaMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x654321,
      roughness: 0.7
    });

    // Laterales
    for (let i = -1; i <= 1; i += 2) {
      const lateral = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 2, 0.4),
        maderaMaterial
      );
      lateral.position.x = i * 0.975;
      lateral.position.y = 1;
      lateral.castShadow = true;
      group.add(lateral);
    }

    // Estantes
    for (let i = 0; i < 4; i++) {
      const estante = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.03, 0.4),
        maderaMaterial
      );
      estante.position.y = i * 0.6 + 0.2;
      estante.castShadow = true;
      estante.receiveShadow = true;
      group.add(estante);
    }

    group.position.set(x, y, z);
    this.scene.add(group);
    this.objects.push(group);
    return group;
  }

  // ==================== CREAR AULA COMPLETA ====================

  createClassroom() {
    // Crear paredes primero
    this.createParedes();

    // Piso de baldosas claras
    const piso = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 10),
      new THREE.MeshStandardMaterial({ 
        color: 0xd4d4d4,
        roughness: 0.8
      })
    );
    piso.rotation.x = -Math.PI / 2;
    piso.receiveShadow = true;
    this.scene.add(piso);

    // Pizarra al frente
    this.createPizarra(0, 2.5, -4.8);

    // Pupitres con objetos
    const posicionesPupitres = [
      [-2.5, 0, -1],
      [2.5, 0, -1],
      [-2.5, 0, 1.5],
      [2.5, 0, 1.5]
    ];

    posicionesPupitres.forEach((pos, idx) => {
      this.createPupitre(...pos);
      
      // Agregar objetos sobre cada pupitre con colores variados
      if (idx === 0) {
        this.createLibro(pos[0] - 0.2, pos[1] + 0.8, pos[2], 0.6, 0.8, 0.15, 0x8B0000);
        this.createCuaderno(pos[0] + 0.2, pos[1] + 0.9, pos[2], 0xFF6347);
      } else if (idx === 1) {
        this.createLibro(pos[0], pos[1] + 0.8, pos[2] - 0.1, 0.5, 0.7, 0.12, 0x006400);
        this.createLapicera(pos[0] + 0.3, pos[1] + 0.8, pos[2] + 0.2, 0x0066cc);
      } else if (idx === 2) {
        this.createCuaderno(pos[0] - 0.15, pos[1] + 0.8, pos[2], 0x4169E1);
        this.createLapicera(pos[0] + 0.25, pos[1] + 0.8, pos[2], 0xFF0000);
      } else {
        this.createLibro(pos[0] - 0.1, pos[1] + 0.8, pos[2], 0.55, 0.75, 0.13, 0x4B0082);
        this.createLibro(pos[0] + 0.1, pos[1] + 0.93, pos[2], 0.5, 0.7, 0.1, 0xFF8C00);
      }
    });

    // Estante con libros
    this.createEstante(-5, 0, -3);
    
    // Libros en el estante con colores variados
    const coloresLibros = [0x8B0000, 0x006400, 0x00008B, 0x8B008B, 0xFF8C00];
    for (let nivel = 0; nivel < 3; nivel++) {
      for (let i = 0; i < 5; i++) {
        this.createLibro(
          -5 + (i - 2) * 0.35,
          nivel * 0.6 + 0.35,
          -3,
          0.3,
          0.5,
          0.1,
          coloresLibros[i % coloresLibros.length]
        );
      }
    }

    // Lapiceras en la repisa de la pizarra con colores variados
    const coloresLapiceras = [0xFF0000, 0x0000FF, 0x00FF00, 0x000000];
    coloresLapiceras.forEach((color, i) => {
      this.createLapicera(
        -1.5 + i * 1,
        0.9,
        -4.75,
        color
      );
    });
  }

  // ==================== ANIMACIÓN ====================

  animate() {
    requestAnimationFrame(() => this.animate());

    // Rotación suave de algunos objetos
    this.objects.forEach((obj, idx) => {
      if (obj.userData.floating) {
        obj.position.y += Math.sin(Date.now() * 0.001 + idx) * 0.001;
      }
    });

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scene-container');
  if (container) {
    new Aula3D('scene-container');
  }
});