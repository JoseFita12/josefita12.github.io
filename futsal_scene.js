// ===========================================
// Archivo: futsal_scene.js (RANGO 19X, DENSIDAD MÍNIMA)
// Lógica de la escena 3D con partículas flotantes
// ===========================================

const container = document.getElementById('escena-3d-futsal');

if (container) {
    let scene, camera, renderer, model, controls, particleSystem;

    // --- Valores de Rango de Partículas AUMENTADOS 19X (SIN CAMBIOS) ---
    const PARTICLE_COUNT = 4500; // ¡REDUCIDO en un 25% (6000 -> 4500)!
    const PARTICLE_RANGE_X = 400; // Rango X muy amplio
    const PARTICLE_RANGE_Y = 200;  // Rango Y muy amplio
    const PARTICLE_RANGE_Z = 400; // Rango Z muy amplio
    
    // Función para crear partículas
    function createParticleSystem() {
        const particleGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const velocities = [];

        const color1 = new THREE.Color('#2563eb'); 
        const color2 = new THREE.Color('#93c5fd'); 

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Distribución inicial en el rango ampliado
            const x = (Math.random() - 0.5) * PARTICLE_RANGE_X;
            const y = Math.random() * PARTICLE_RANGE_Y;
            const z = (Math.random() - 0.5) * PARTICLE_RANGE_Z;
            positions.push(x, y, z);

            // Mezcla de colores
            const mixFactor = Math.random();
            const color = color1.clone().lerp(color2, mixFactor);
            colors.push(color.r, color.g, color.b);

            // Velocidades (se mantienen sutiles para el flujo)
            velocities.push(
                (Math.random() - 0.5) * 0.03, 
                Math.random() * 0.05 + 0.01,
                (Math.random() - 0.5) * 0.03
            );
        }

        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 1.0, 
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8, 
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            depthWrite: false
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.userData = { 
            velocities, 
            rangeX: PARTICLE_RANGE_X, 
            rangeY: PARTICLE_RANGE_Y, 
            rangeZ: PARTICLE_RANGE_Z 
        };

        return particles;
    }

    // Función para animar partículas (sin cambios)
    function animateParticles() {
        if (!particleSystem) return;

        const positions = particleSystem.geometry.attributes.position.array;
        const velocities = particleSystem.userData.velocities;
        const { rangeX, rangeY, rangeZ } = particleSystem.userData;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Reposicionamiento en el rango masivo
            if (positions[i + 1] > rangeY) {
                positions[i + 1] = 0; 
            }
            if (Math.abs(positions[i]) > rangeX / 2) {
                positions[i] = (positions[i] > 0 ? -rangeX / 2 : rangeX / 2);
            }
            if (Math.abs(positions[i + 2]) > rangeZ / 2) {
                positions[i + 2] = (positions[i + 2] > 0 ? -rangeZ / 2 : rangeZ / 2);
            }
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.rotation.y += 0.0001; 
    }

    function init() {
        // ESCENA y FOG (Mantenido)
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a1929);
        scene.fog = new THREE.FogExp2(0x0a1929, 0.002);

        // CÁMARA (Mantenido)
        const aspectRatio = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(55, aspectRatio, 0.1, 1000); 
        camera.position.set(160, 70,50);
        camera.lookAt(0, 0, 0); 

        // RENDERER (Mantenido)
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // --- Luces (Mantenidas) ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(15, 30, 15);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -30;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.top = 30;
        directionalLight.shadow.camera.bottom = -30;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);
        const blueLight1 = new THREE.PointLight(0x2563eb, 1.5, 50);
        blueLight1.position.set(-15, 10, -15);
        scene.add(blueLight1);
        const blueLight2 = new THREE.PointLight(0x93c5fd, 1.5, 50);
        blueLight2.position.set(15, 10, 15);
        scene.add(blueLight2);

        // CREAR SISTEMA DE PARTÍCULAS
        particleSystem = createParticleSystem();
        scene.add(particleSystem);

        // CARGAR MODELO GLB (Mantenido)
        const loader = new THREE.GLTFLoader();
        loader.load('cancha_futsal.glb', 
            function(gltf) {
                model = gltf.scene;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.needsUpdate = true;
                        }
                    }
                });
                scene.add(model);
                console.log('Modelo cargado. Rango 19X con densidad mínima activo.');
            }, 
            function(xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% cargado');
            },
            function(error) {
                console.error('Error al cargar el modelo 3D:', error);
                container.innerHTML = "<p style='color:#ef4444; padding:2rem;'>¡Error! No se pudo cargar el modelo 3D. Verifica el archivo cancha_futsal.glb</p>";
            }
        );

        // CONTROLES DE ÓRBITA (Mantenido)
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 5;
        controls.maxDistance = 600; 
        controls.maxPolarAngle = Math.PI / 2.1;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        animate();
    }

    // Bucle de renderizado y Resizing (Mantenido)
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        animateParticles();
        renderer.render(scene, camera);
    }
    function onWindowResize() {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    // Iniciar
    init();
    window.addEventListener('resize', onWindowResize, false);
} else {
    console.error("No se encontró el contenedor #escena-3d-futsal");
}