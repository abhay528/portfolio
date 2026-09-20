const root = document.querySelector('.evidence-topology');

if (root) {
  const visual = root.querySelector('[data-topology-visual]');
  const mount = root.querySelector('[data-topology-canvas]');
  const caption = root.querySelector('#topology-caption');
  const rows = [...root.querySelectorAll('.topology-index [data-route]')];
  const fallbackRoutes = [...root.querySelectorAll('.topology-fallback [data-route]')];
  const labels = {
    vulnscan: 'vulnscan: target → connect → fingerprint → assess → report.',
    'page-pulse': 'Page Pulse: URL → fetch → analyze → report.',
    ids: 'Intrusion Detection System: packet → features → models → alert.'
  };
  const defaultCaption = 'Select a project route to inspect its conceptual stages.';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = matchMedia('(max-width: 420px), (hover: none) and (pointer: coarse)');

  let hoveredRoute = '';
  let focusedRoute = '';
  let renderer;
  let scene;
  let camera;
  let resizeObserver;
  let intersectionObserver;
  let frame = 0;
  let visible = true;
  let disposed = false;
  let handlingContextLoss = false;
  let parallaxEnabled = false;
  const listenerCleanups = [];
  const geometries = new Set();
  const materials = new Set();

  const render = () => {
    if (renderer && scene && camera && !disposed && visible && !document.hidden) {
      renderer.render(scene, camera);
    }
  };

  const activeRoute = () => hoveredRoute || focusedRoute;

  const updateActiveRoute = () => {
    const route = activeRoute();
    rows.forEach((row) => row.classList.toggle('is-active', row.dataset.route === route));
    fallbackRoutes.forEach((item) => item.classList.toggle('is-active', item.dataset.route === route));
    if (caption) caption.textContent = route ? labels[route] : defaultCaption;
    if (scene) {
      scene.traverse((object) => {
        if (object.userData.route && object.material) {
          object.material.color.setHex(object.userData.route === route ? 0xf4f0fc : object.userData.base);
        }
      });
    }
    render();
  };

  rows.forEach((row) => {
    const onMouseEnter = () => { hoveredRoute = row.dataset.route; updateActiveRoute(); };
    const onMouseLeave = () => { if (hoveredRoute === row.dataset.route) hoveredRoute = ''; updateActiveRoute(); };
    const onFocus = () => { focusedRoute = row.dataset.route; updateActiveRoute(); };
    const onBlur = () => { if (focusedRoute === row.dataset.route) focusedRoute = ''; updateActiveRoute(); };
    row.addEventListener('mouseenter', onMouseEnter);
    row.addEventListener('mouseleave', onMouseLeave);
    row.addEventListener('focus', onFocus);
    row.addEventListener('blur', onBlur);
    listenerCleanups.push(() => {
      row.removeEventListener('mouseenter', onMouseEnter);
      row.removeEventListener('mouseleave', onMouseLeave);
      row.removeEventListener('focus', onFocus);
      row.removeEventListener('blur', onBlur);
    });
  });

  const resetCamera = () => {
    if (!camera) return;
    camera.position.x = 0;
    camera.position.y = 0;
    render();
  };

  const onPointerMove = (event) => {
    if (!camera || !visual || !parallaxEnabled) return;
    const bounds = visual.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    camera.position.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.08;
    camera.position.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 0.06;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  };

  const disableParallax = () => {
    if (!parallaxEnabled || !visual) return;
    parallaxEnabled = false;
    visual.removeEventListener('pointermove', onPointerMove);
    visual.removeEventListener('pointerleave', resetCamera);
    cancelAnimationFrame(frame);
    resetCamera();
  };

  const enableParallax = () => {
    if (parallaxEnabled || !visual || reducedMotion.matches) return;
    parallaxEnabled = true;
    visual.addEventListener('pointermove', onPointerMove, { passive: true });
    visual.addEventListener('pointerleave', resetCamera, { passive: true });
  };

  const syncMotionPreference = () => {
    if (reducedMotion.matches) disableParallax(); else if (renderer) enableParallax();
  };
  reducedMotion.addEventListener('change', syncMotionPreference);
  listenerCleanups.push(() => reducedMotion.removeEventListener('change', syncMotionPreference));

  const showFallback = () => {
    root.classList.remove('is-webgl');
  };

  const releaseScene = ({ forceContext = true } = {}) => {
    cancelAnimationFrame(frame);
    disableParallax();
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    resizeObserver = undefined;
    intersectionObserver = undefined;
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    geometries.clear();
    materials.clear();
    scene?.clear();
    scene = undefined;
    camera = undefined;
    if (renderer) {
      const canvas = renderer.domElement;
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      renderer.dispose();
      if (forceContext && !handlingContextLoss) renderer.forceContextLoss();
      renderer = undefined;
    }
    mount?.replaceChildren();
  };

  const fallbackAndCleanup = ({ contextLost = false } = {}) => {
    showFallback();
    handlingContextLoss = contextLost;
    releaseScene({ forceContext: !contextLost });
    handlingContextLoss = false;
  };

  function onContextLost(event) {
    event.preventDefault();
    fallbackAndCleanup({ contextLost: true });
  }

  function onContextRestored() {
    showFallback();
  }

  const teardown = () => {
    if (disposed) return;
    disposed = true;
    fallbackAndCleanup();
    listenerCleanups.splice(0).forEach((cleanup) => cleanup());
  };
  addEventListener('pagehide', teardown, { once: true });
  listenerCleanups.push(() => removeEventListener('pagehide', teardown));

  (async () => {
    if (!visual || !mount || coarsePointer.matches) return;
    try {
      const probe = document.createElement('canvas');
      if (!(probe.getContext('webgl2', { powerPreference: 'low-power' }) || probe.getContext('webgl', { powerPreference: 'low-power' }))) return;

      // Pinned CDN dependency: any import failure intentionally keeps the semantic SVG fallback.
      // Self-host this exact version before release if CDN independence is required; no SRI is claimed.
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js');
      if (disposed) return;

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-4.4, 4.4, 2, -2, 0.1, 20);
      camera.position.z = 6;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.domElement.addEventListener('webglcontextlost', onContextLost);
      renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
      mount.append(renderer.domElement);

      const routes = {
        vulnscan: { color: 0xb9a7ef, points: [[-3.8, 1], [-2.1, 1], [-0.75, 0.55], [1.05, 0.98], [3.75, 0.98]] },
        'page-pulse': { color: 0x9186ba, points: [[-3.8, 0], [-1.7, 0], [0.65, 0.38], [3.75, 0]] },
        ids: { color: 0x728b99, points: [[-3.8, -1], [-1.75, -1], [0.45, -0.55], [3.75, -1]] }
      };
      const sharedNodeGeometry = new THREE.OctahedronGeometry(0.1, 0);
      geometries.add(sharedNodeGeometry);

      Object.entries(routes).forEach(([route, data]) => {
        const positions = [];
        for (let index = 0; index < data.points.length - 1; index += 1) {
          positions.push(...data.points[index], 0, ...data.points[index + 1], 0);
        }
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometries.add(lineGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: data.color, transparent: true, opacity: 0.72 });
        materials.add(lineMaterial);
        const line = new THREE.LineSegments(lineGeometry, lineMaterial);
        line.userData = { route, base: data.color };
        scene.add(line);

        data.points.forEach((point) => {
          const nodeMaterial = new THREE.MeshBasicMaterial({ color: data.color });
          materials.add(nodeMaterial);
          const node = new THREE.Mesh(sharedNodeGeometry, nodeMaterial);
          node.position.set(point[0], point[1], 0);
          node.userData = { route, base: data.color };
          scene.add(node);
        });
      });

      const resize = () => {
        if (!renderer || disposed) return;
        const bounds = visual.getBoundingClientRect();
        renderer.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height), false);
        render();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(visual);
      intersectionObserver = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) render();
      }, { rootMargin: '80px' });
      intersectionObserver.observe(root);
      const onVisibilityChange = () => render();
      document.addEventListener('visibilitychange', onVisibilityChange);
      listenerCleanups.push(() => document.removeEventListener('visibilitychange', onVisibilityChange));

      syncMotionPreference();
      resize();
      root.classList.add('is-webgl');
      render();
    } catch (error) {
      fallbackAndCleanup();
    }
  })();
}
