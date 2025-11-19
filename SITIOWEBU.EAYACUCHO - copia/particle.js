// ===========================================
// Archivo: particle_system.js
// Sistema de Partículas Flotantes Azules Reutilizable
// ===========================================

/**
 * Crea un sistema de partículas flotantes para una escena Three.js
 * @param {THREE.Scene} scene - La escena donde se agregarán las partículas
 * @param {Object} config - Configuración personalizable
 * @returns {THREE.Points} - El sistema de partículas creado
 */
function createParticleSystem(scene, config = {}) {
    // Configuración por defecto
    const defaults = {
        count: 800,              // Cantidad de partículas
        size: 0.04,              // Tamaño de partículas
        rangeX: 15,              // Rango en X
        rangeY: 15,              // Rango en Y
        rangeZ: 15,              // Rango en Z
        color1: '#2563eb',       // Color principal (azul acento)
        color2: '#93c5fd',       // Color secundario (azul claro)
        opacity: 0.8,            // Opacidad
        speedY: 0.0005,          // Velocidad de flotación vertical
        speedRotation: 0.0003    // Velocidad de rotación
    };

    // Combinar configuración
    const settings = { ...defaults, ...config };

    // Crear geometría de partículas
    const particleGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const velocities = [];

    const color1 = new THREE.Color(settings.color1);
    const color2 = new THREE.Color(settings.color2);

    for (let i = 0; i < settings.count; i++) {
        // Posiciones aleatorias
        const x = (Math.random() - 0.5) * settings.rangeX;
        const y = (Math.random() - 0.5) * settings.rangeY;
        const z = (Math.random() - 0.5) * settings.rangeZ;
        positions.push(x, y, z);

        // Colores mezclados entre los dos tonos de azul
        const mixFactor = Math.random();
        const color = color1.clone().lerp(color2, mixFactor);
        colors.push(color.r, color.g, color.b);

        // Tamaños variables
        sizes.push(settings.size * (0.5 + Math.random() * 1.5));

        // Velocidades individuales para movimiento orgánico
        velocities.push(
            (Math.random() - 0.5) * 0.002,
            Math.random() * 0.002 + 0.001,
            (Math.random() - 0.5) * 0.002
        );
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Material de partículas mejorado
    const particleMaterial = new THREE.PointsMaterial({
        size: settings.size,
        sizeAttenuation: true,
        transparent: true,
        opacity: settings.opacity,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        depthWrite: false
    });

    // Crear el sistema de partículas
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // Guardar velocidades en el objeto para animación
    particleSystem.userData.velocities = velocities;
    particleSystem.userData.settings = settings;
    particleSystem.userData.positions = positions;

    scene.add(particleSystem);

    return particleSystem;
}

/**
 * Anima el sistema de partículas
 * @param {THREE.Points} particleSystem - El sistema de partículas a animar
 */
function animateParticles(particleSystem) {
    if (!particleSystem || !particleSystem.geometry) return;

    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.userData.velocities;
    const settings = particleSystem.userData.settings;

    // Actualizar posiciones con movimiento orgánico
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];     // X
        positions[i + 1] += velocities[i + 1]; // Y
        positions[i + 2] += velocities[i + 2]; // Z

        // Reposicionar partículas que salen del rango
        if (positions[i + 1] > settings.rangeY / 2) {
            positions[i + 1] = -settings.rangeY / 2;
        }
        if (Math.abs(positions[i]) > settings.rangeX / 2) {
            positions[i] = (Math.random() - 0.5) * settings.rangeX;
        }
        if (Math.abs(positions[i + 2]) > settings.rangeZ / 2) {
            positions[i + 2] = (Math.random() - 0.5) * settings.rangeZ;
        }
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;

    // Rotación suave del sistema completo
    particleSystem.rotation.y += settings.speedRotation;
}

// Exportar funciones (si usas módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createParticleSystem, animateParticles };
}