"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

export default function FooterRoom() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cubeRevealed, setCubeRevealed] = useState(false);

  // Refs to share state between React and Three.js
  const cubeRef = useRef<THREE.Group | null>(null);
  const cubeTargetPos = useRef(new THREE.Vector3(8, 0.2, -1)); // starts off-screen right
  const cubeFinalPos = useRef(new THREE.Vector3(2.5, 0.2, -1));
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const cubeRotVel = useRef({ x: 0, y: 0 }); // momentum
  const cubeEntrance = useRef(false);

  const handlePlay = useCallback(() => {
    if (cubeRevealed) return;
    setCubeRevealed(true);
    cubeEntrance.current = true;
  }, [cubeRevealed]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ─── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    mount.appendChild(renderer.domElement);

    // ─── Scene ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0a0a");
    scene.fog = new THREE.FogExp2("#0a0a0a", 0.04);

    // ─── Camera ────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 1.2, 7);
    camera.lookAt(0, 0.5, 0);

    // ─── Materials ─────────────────────────────────────────────
    const floorMat = new THREE.MeshStandardMaterial({ color: "#0e0e0e", roughness: 0.85, metalness: 0.15 });
    const wallMat = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.95, metalness: 0.05 });
    const ceilMat = new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 1.0 });

    // ─── Room Geometry ─────────────────────────────────────────
    const roomW = 14, roomH = 6, roomD = 12;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -roomH / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomH / 2;
    scene.add(ceiling);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
    backWall.position.z = -roomD / 2;
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -roomW / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.x = roomW / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // ─── Name Text (shifted LEFT) ──────────────────────────────
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 2048;
    textCanvas.height = 512;
    const ctx = textCanvas.getContext("2d")!;

    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, 2048, 512);

    // Left-aligned "SHASHANK"
    ctx.font = "bold 260px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // Clean crisp white with subtle depth shadow
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = "#e8e8e8";
    ctx.fillText("SHASHANK", 80, 256);

    const nameTexture = new THREE.CanvasTexture(textCanvas);
    nameTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const nameMat = new THREE.MeshStandardMaterial({
      map: nameTexture,
      roughness: 0.5,
      metalness: 0.3,
    });
    const namePlane = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), nameMat);
    namePlane.position.set(-1, 1.0, -roomD / 2 + 0.02);
    scene.add(namePlane);

    // ─── Interactive Cube ──────────────────────────────────────
    const cubeGroup = new THREE.Group();
    cubeGroup.position.copy(cubeTargetPos.current);
    scene.add(cubeGroup);
    cubeRef.current = cubeGroup;

    // Build a multi-face cube with visible edges, like a premium product box
    const cubeSize = 1.4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Each face gets a unique subtle color
    const faceColors = [
      "#1a1a1a", // right
      "#1a1a1a", // left
      "#222222", // top
      "#151515", // bottom
      "#1e1e1e", // front
      "#181818", // back
    ];

    const cubeMaterials = faceColors.map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.3,
          metalness: 0.6,
          envMapIntensity: 0.5,
        })
    );

    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterials);
    cubeMesh.castShadow = true;
    cubeMesh.receiveShadow = true;
    cubeGroup.add(cubeMesh);

    // Edge wireframe for that premium/tech look
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: "#444444", linewidth: 1 });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    cubeGroup.add(edgesMesh);

    // Add face labels — small text on each face
    const addFaceLabel = (text: string, position: THREE.Vector3, rotation: THREE.Euler) => {
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 512;
      labelCanvas.height = 512;
      const lctx = labelCanvas.getContext("2d")!;

      lctx.fillStyle = "transparent";
      lctx.clearRect(0, 0, 512, 512);

      lctx.font = "bold 80px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      lctx.textAlign = "center";
      lctx.textBaseline = "middle";
      lctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      lctx.fillText(text, 256, 256);

      const texture = new THREE.CanvasTexture(labelCanvas);
      const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(cubeSize * 0.95, cubeSize * 0.95), mat);
      plane.position.copy(position);
      plane.rotation.copy(rotation);
      cubeGroup.add(plane);
    };

    const halfCube = cubeSize / 2 + 0.01;
    addFaceLabel("DESIGN", new THREE.Vector3(0, 0, halfCube), new THREE.Euler(0, 0, 0));
    addFaceLabel("CODE", new THREE.Vector3(0, 0, -halfCube), new THREE.Euler(0, Math.PI, 0));
    addFaceLabel("CREATE", new THREE.Vector3(halfCube, 0, 0), new THREE.Euler(0, Math.PI / 2, 0));
    addFaceLabel("BUILD", new THREE.Vector3(-halfCube, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0));
    addFaceLabel("VIBE", new THREE.Vector3(0, halfCube, 0), new THREE.Euler(-Math.PI / 2, 0, 0));
    addFaceLabel("SHIP", new THREE.Vector3(0, -halfCube, 0), new THREE.Euler(Math.PI / 2, 0, 0));

    // ─── Lighting ──────────────────────────────────────────────

    const ambient = new THREE.AmbientLight("#ffffff", 0.35);
    scene.add(ambient);

    // Main spotlight on the name
    const nameSpot = new THREE.SpotLight("#ffffff", 6.0);
    nameSpot.position.set(-2, 4, 5);
    nameSpot.angle = Math.PI / 4;
    nameSpot.penumbra = 0.7;
    nameSpot.castShadow = true;
    nameSpot.shadow.mapSize.width = 1024;
    nameSpot.shadow.mapSize.height = 1024;
    scene.add(nameSpot);

    // Cube accent light (appears when cube enters)
    const cubeLight = new THREE.PointLight("#ffffff", 0, 8);
    cubeLight.position.set(3, 2, 1);
    scene.add(cubeLight);

    // Fill light
    const fillLight = new THREE.PointLight("#d0d0d0", 1.5, 15);
    fillLight.position.set(-4, 1, 3);
    scene.add(fillLight);

    // ─── Raycaster for Cube Interaction ────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      if (!cubeEntrance.current) return;

      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(cubeGroup, true);

      if (intersects.length > 0) {
        isDragging.current = true;
        previousMouse.current = { x: e.clientX, y: e.clientY };
        cubeRotVel.current = { x: 0, y: 0 };
        mount.style.cursor = "grabbing";
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // Camera parallax (only when NOT dragging cube)
      if (!isDragging.current) {
        const rect = mount.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }

      // Cube dragging
      if (isDragging.current && cubeRef.current) {
        const deltaX = e.clientX - previousMouse.current.x;
        const deltaY = e.clientY - previousMouse.current.y;

        cubeRotVel.current = {
          x: deltaY * 0.008,
          y: deltaX * 0.008,
        };

        cubeRef.current.rotation.x += deltaY * 0.008;
        cubeRef.current.rotation.y += deltaX * 0.008;

        previousMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        mount.style.cursor = "crosshair";
      }
    };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointerleave", onPointerUp);

    // ─── Camera Parallax State ─────────────────────────────────
    let mouseX = 0, mouseY = 0;
    let targetCamX = 0, targetCamY = 0;

    // ─── Resize ────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ─── Animation Loop ────────────────────────────────────────
    let frameId: number;
    const clock = new THREE.Clock();
    let cubeEntranceProgress = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth camera parallax
      targetCamX += (mouseX - targetCamX) * 0.05;
      targetCamY += (mouseY - targetCamY) * 0.05;

      camera.position.x = targetCamX * 0.8;
      camera.position.y = 1.2 + targetCamY * 0.3;
      camera.lookAt(0, 0.5, 0);

      // ─── Cube Entrance Animation ──────────────────────────
      if (cubeEntrance.current && cubeRef.current) {
        cubeEntranceProgress = Math.min(cubeEntranceProgress + 0.015, 1);

        // Ease-out cubic
        const t = 1 - Math.pow(1 - cubeEntranceProgress, 3);

        // Lerp position from right side to final position
        cubeRef.current.position.lerpVectors(
          cubeTargetPos.current,
          cubeFinalPos.current,
          t
        );

        // Entrance spin (decreasing speed as it settles)
        if (cubeEntranceProgress < 1) {
          const spinSpeed = (1 - t) * 0.12;
          cubeRef.current.rotation.y += spinSpeed;
          cubeRef.current.rotation.x += spinSpeed * 0.5;
        }

        // Fade in the cube light
        cubeLight.intensity = t * 3;
      }

      // ─── Cube Idle Momentum / Friction ─────────────────────
      if (cubeRef.current && !isDragging.current && cubeEntranceProgress >= 1) {
        // Apply momentum with friction
        cubeRef.current.rotation.x += cubeRotVel.current.x;
        cubeRef.current.rotation.y += cubeRotVel.current.y;

        // Friction
        cubeRotVel.current.x *= 0.97;
        cubeRotVel.current.y *= 0.97;

        // Gentle idle float when fully still
        const isStill = Math.abs(cubeRotVel.current.x) < 0.001 && Math.abs(cubeRotVel.current.y) < 0.001;
        if (isStill) {
          cubeRef.current.rotation.y += 0.002;
          // Subtle hover bob
          cubeRef.current.position.y = cubeFinalPos.current.y + Math.sin(elapsed * 1.5) * 0.05;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // ─── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointerleave", onPointerUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Three.js Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ cursor: "crosshair" }}
      />

      {/* Play Button Overlay — right side */}
      {!cubeRevealed && (
        <button
          onClick={handlePlay}
          className="absolute right-16 top-1/2 -translate-y-1/2 z-20 group"
          aria-label="Reveal interactive cube"
        >
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* Outer pulse ring */}
            <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDuration: "2.5s" }} />
            <div className="absolute inset-0 rounded-full border border-white/10" />

            {/* Play triangle */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500 group-hover:scale-110">
              <svg
                width="28"
                height="32"
                viewBox="0 0 28 32"
                fill="none"
                className="ml-1"
              >
                <path
                  d="M2 2L26 16L2 30V2Z"
                  fill="white"
                  fillOpacity="0.8"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Label */}
          <span className="block mt-4 text-center text-[9px] uppercase tracking-[5px] text-white/40 font-medium">
            Play
          </span>
        </button>
      )}
    </div>
  );
}
