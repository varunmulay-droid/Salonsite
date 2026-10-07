import * as React from "react";
import { Minus, Plus, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { vanityHotspots } from "@/data/vanity";
import { serviceBySlug } from "@/lib/salon-data";
import { cn } from "@/lib/utils";

const MODEL_URL = "/models/vanity.glb";
const DRACO_PATH = "/draco/";

type Api = {
  focus: (id: string | null) => void;
  zoom: (factor: number) => void;
  rotate: (radians: number) => void;
  reset: () => void;
};

type Status = "idle" | "loading" | "ready" | "error";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function VanityViewer({
  active,
  onSelect,
  className,
}: {
  active: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const dotRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const api = React.useRef<Api | null>(null);
  const activeRef = React.useRef(active);
  const [status, setStatus] = React.useState<Status>("idle");
  const [progress, setProgress] = React.useState(0);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    activeRef.current = active;
    api.current?.focus(active);
  }, [active, status]);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const host = hostRef.current;
    if (!wrap || !host) return;

    let disposed = false;
    let started = false;
    let teardown: (() => void) | undefined;

    const start = async () => {
      if (!webglAvailable()) {
        setStatus("error");
        return;
      }
      setStatus("loading");
      try {
        const [THREE, { GLTFLoader }, { DRACOLoader }, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/addons/loaders/GLTFLoader.js"),
          import("three/addons/loaders/DRACOLoader.js"),
          import("three/addons/controls/OrbitControls.js"),
          import("three/addons/environments/RoomEnvironment.js"),
        ]);
        if (disposed) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* ---------- renderer / scene ---------- */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const canvas = renderer.domElement;
        canvas.className = "absolute inset-0 h-full w-full outline-none";
        canvas.style.touchAction = "pan-y"; // vertical swipes still scroll the page
        canvas.setAttribute("aria-hidden", "true");
        host.appendChild(canvas);

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTex;
        scene.environmentIntensity = 0.85;

        scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a6a, 0.45));
        const key = new THREE.DirectionalLight(0xfff0dd, 2.4);
        key.position.set(3, 5, 3.5);
        key.castShadow = true;
        key.shadow.mapSize.set(window.innerWidth < 700 ? 1024 : 2048, window.innerWidth < 700 ? 1024 : 2048);
        key.shadow.camera.left = -3;
        key.shadow.camera.right = 3;
        key.shadow.camera.top = 3;
        key.shadow.camera.bottom = -3;
        key.shadow.camera.near = 0.5;
        key.shadow.camera.far = 14;
        key.shadow.bias = -0.0005;
        key.shadow.normalBias = 0.02;
        scene.add(key, key.target);
        const fill = new THREE.DirectionalLight(0xdde6ff, 0.7);
        fill.position.set(-4, 2.5, -2);
        scene.add(fill);

        const floor = new THREE.Mesh(
          new THREE.CircleGeometry(7, 64),
          new THREE.ShadowMaterial({ opacity: 0.26 }),
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);

        /* ---------- model ---------- */
        const draco = new DRACOLoader();
        draco.setDecoderPath(DRACO_PATH);
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        const gltf = await new Promise<Awaited<ReturnType<typeof loader.loadAsync>>>((resolve, reject) => {
          loader.load(
            MODEL_URL,
            resolve,
            (e) => {
              if (e.lengthComputable && !disposed) setProgress(Math.round((e.loaded / e.total) * 100));
            },
            reject,
          );
        });
        if (disposed) {
          renderer.dispose();
          draco.dispose();
          return;
        }

        const model = gltf.scene;
        model.traverse((o) => {
          const mesh = o as import("three").Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        const box = new THREE.Box3().setFromObject(model);
        const size0 = box.getSize(new THREE.Vector3());
        model.scale.setScalar(2.2 / Math.max(size0.x, size0.y, size0.z));
        model.updateMatrixWorld(true);
        box.setFromObject(model);
        const c0 = box.getCenter(new THREE.Vector3());
        model.position.set(-c0.x, -box.min.y, -c0.z);
        model.updateMatrixWorld(true);
        box.setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        scene.add(model);
        key.target.position.copy(center);

        // Make the mirror glass read as glass (not a black disc) from any angle.
        let mirrorNode: import("three").Object3D | undefined;
        model.traverse((o) => {
          if (!mirrorNode && norm(o.name).includes("mirror")) mirrorNode = o;
        });
        if (mirrorNode) {
          let glass: import("three").Mesh | undefined;
          let best = 0;
          mirrorNode.traverse((o) => {
            const m = o as import("three").Mesh;
            if (!m.isMesh) return;
            const v = new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3());
            const vol = v.x * v.y * v.z + v.x * v.y + v.y * v.z + v.x * v.z;
            if (vol > best) {
              best = vol;
              glass = m;
            }
          });
          const mat = glass?.material as import("three").MeshStandardMaterial | undefined;
          if (mat && "metalness" in mat) {
            mat.color.set(0xe3e9f0);
            mat.metalness = 0.4;
            mat.roughness = 0.06;
            mat.envMapIntensity = 1.8;
            mat.needsUpdate = true;
          }
        }

        /* ---------- default camera pose (also used to anchor hotspots) ---------- */
        const radius = size.length() / 2;
        const dist = radius * 3.0;
        const target0 = new THREE.Vector3(center.x, center.y * 0.82, center.z);
        const phi0 = THREE.MathUtils.degToRad(74);
        const theta0 = THREE.MathUtils.degToRad(-32);
        const fromSph = (r: number, phi: number, theta: number, t: import("three").Vector3) =>
          new THREE.Vector3().setFromSphericalCoords(r, phi, theta).add(t);

        /* ---------- hotspots ---------- */
        const points = new Map<string, import("three").Vector3>();
        const cam0 = fromSph(dist, phi0, theta0, target0);
        const raycaster = new THREE.Raycaster();
        for (const h of vanityHotspots) {
          let node: import("three").Object3D | undefined;
          model.traverse((o) => {
            if (!node && h.nodes.some((n) => norm(o.name).includes(n))) node = o;
          });
          if (!node) {
            points.set(h.id, center.clone());
            continue;
          }
          const bounds = new THREE.Box3().setFromObject(node);
          const c = bounds.getCenter(new THREE.Vector3());
          let point = c;
          if (h.anchor === "top") {
            point = new THREE.Vector3(c.x, bounds.max.y, c.z);
          } else {
            // pin the dot to the object's own surface, as seen from the default camera
            raycaster.set(cam0, c.clone().sub(cam0).normalize());
            const hit = raycaster.intersectObject(node, true)[0];
            if (hit) point = hit.point.clone();
          }
          points.set(h.id, point);
        }

        /* ---------- camera + controls ---------- */
        camera.position.copy(fromSph(dist, phi0, theta0, target0));

        const controls = new OrbitControls(camera, canvas);
        controls.target.copy(target0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.07;
        controls.enablePan = false;
        controls.enableZoom = false; // wheel keeps scrolling the page; use the +/- buttons
        controls.minPolarAngle = 0.35;
        controls.maxPolarAngle = Math.PI / 2 - 0.04;
        controls.minDistance = dist * 0.3;
        controls.maxDistance = dist * 1.5;
        controls.autoRotate = !reduced;
        controls.autoRotateSpeed = 0.9;
        canvas.style.touchAction = "pan-y";
        controls.update();

        let resumeTimer = 0;
        controls.addEventListener("start", () => {
          tween = null;
          controls.autoRotate = false;
          window.clearTimeout(resumeTimer);
          setTouched(true);
        });
        controls.addEventListener("end", () => {
          window.clearTimeout(resumeTimer);
          resumeTimer = window.setTimeout(() => {
            if (!activeRef.current && !reduced) controls.autoRotate = true;
          }, 4000);
        });

        /* ---------- tween helper ---------- */
        type Tween = { t: number; dur: number; fromT: import("three").Vector3; toT: import("three").Vector3; fromP: import("three").Vector3; toP: import("three").Vector3 };
        let tween: Tween | null = null;
        const flyTo = (toT: import("three").Vector3, toP: import("three").Vector3, dur = 0.9) => {
          tween = { t: 0, dur: reduced ? 0.01 : dur, fromT: controls.target.clone(), toT, fromP: camera.position.clone(), toP };
          controls.autoRotate = false;
          window.clearTimeout(resumeTimer);
        };

        const clampDist = (v: import("three").Vector3) => {
          const off = v.clone().sub(controls.target);
          off.setLength(THREE.MathUtils.clamp(off.length(), controls.minDistance, controls.maxDistance));
          return off.add(controls.target);
        };

        api.current = {
          focus: (id) => {
            const p = id ? points.get(id) : undefined;
            if (id && p) {
              const out = new THREE.Vector3(p.x - center.x, 0, p.z - center.z);
              if (out.length() < 0.05) out.copy(camera.position).sub(target0).setY(0);
              out.normalize();
              const toP = p.clone().addScaledVector(out, dist * 0.52);
              toP.y = Math.max(p.y + 0.12, 0.45);
              flyTo(p.clone(), toP);
            } else {
              const off = camera.position.clone().sub(controls.target);
              const s = new THREE.Spherical().setFromVector3(off);
              flyTo(target0.clone(), fromSph(dist, phi0, s.theta, target0), 1.0);
              window.clearTimeout(resumeTimer);
              resumeTimer = window.setTimeout(() => {
                if (!activeRef.current && !reduced) controls.autoRotate = true;
              }, 1800);
            }
          },
          zoom: (factor) => {
            const off = camera.position.clone().sub(controls.target).multiplyScalar(factor);
            flyTo(controls.target.clone(), clampDist(off.add(controls.target)), 0.35);
          },
          rotate: (rad) => {
            const off = camera.position.clone().sub(controls.target);
            const s = new THREE.Spherical().setFromVector3(off);
            s.theta += rad;
            flyTo(controls.target.clone(), new THREE.Vector3().setFromSpherical(s).add(controls.target), 0.45);
          },
          reset: () => {
            onSelect(null);
            const off = camera.position.clone().sub(controls.target);
            const s = new THREE.Spherical().setFromVector3(off);
            flyTo(target0.clone(), fromSph(dist, phi0, s.theta, target0), 0.8);
          },
        };

        /* ---------- sizing ---------- */
        let w = 1;
        let h = 1;
        const resize = () => {
          w = host.clientWidth || 1;
          h = host.clientHeight || 1;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          // keep the whole piece in frame on narrow (portrait) containers
          camera.fov = w / h < 1 ? 42 : 32;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);

        /* ---------- pointer-reactive key light ---------- */
        let lightX = 0;
        let lightTarget = 0;
        const onMove = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          const r = host.getBoundingClientRect();
          lightTarget = ((e.clientX - r.left) / r.width - 0.5) * 2;
        };
        host.addEventListener("pointermove", onMove);

        /* ---------- render loop (only while visible) ---------- */
        const tmp = new THREE.Vector3();
        const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        let raf = 0;
        let running = false;
        let visible = false;
        let last = performance.now();

        const placeHotspots = () => {
          for (const hs of vanityHotspots) {
            const el = dotRefs.current[hs.id];
            const p = points.get(hs.id);
            if (!el || !p) continue;
            tmp.copy(p).project(camera);
            const x = (tmp.x * 0.5 + 0.5) * w;
            const y = (-tmp.y * 0.5 + 0.5) * h;
            // Hide only points on the far side of the piece (relative to the camera).
            const behind = camera.position.distanceTo(p) - camera.position.distanceTo(center) > radius * 0.5;
            const hidden = tmp.z > 1 || behind;
            el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%)`;
            el.dataset.hidden = hidden ? "true" : "false";
          }
        };

        const frame = (now: number) => {
          raf = requestAnimationFrame(frame);
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          if (tween) {
            tween.t += dt / tween.dur;
            const k = ease(Math.min(1, tween.t));
            controls.target.lerpVectors(tween.fromT, tween.toT, k);
            camera.position.lerpVectors(tween.fromP, tween.toP, k);
            if (tween.t >= 1) tween = null;
          }
          lightX += (lightTarget - lightX) * 0.05;
          key.position.x = 3 + lightX * 1.6;
          controls.update();
          renderer.render(scene, camera);
          placeHotspots();
        };
        const run = () => {
          if (running || !visible || document.hidden) return;
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(frame);
        };
        const halt = () => {
          running = false;
          cancelAnimationFrame(raf);
        };
        const io = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            if (visible) run();
            else halt();
          },
          { threshold: 0.05 },
        );
        io.observe(wrap);
        const onVis = () => (document.hidden ? halt() : run());
        document.addEventListener("visibilitychange", onVis);

        renderer.render(scene, camera);
        placeHotspots();
        setProgress(100);
        setStatus("ready");

        teardown = () => {
          halt();
          io.disconnect();
          ro.disconnect();
          window.clearTimeout(resumeTimer);
          document.removeEventListener("visibilitychange", onVis);
          host.removeEventListener("pointermove", onMove);
          controls.dispose();
          model.traverse((o) => {
            const mesh = o as import("three").Mesh;
            if (mesh.isMesh) {
              mesh.geometry.dispose();
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach((m) => m.dispose());
            }
          });
          floor.geometry.dispose();
          (floor.material as import("three").Material).dispose();
          envTex.dispose();
          pmrem.dispose();
          draco.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
          api.current = null;
        };
      } catch {
        if (!disposed) setStatus("error");
      }
    };

    // Only fetch three.js + the model when the section is about to be seen.
    const gate = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          gate.disconnect();
          void start();
        }
      },
      { rootMargin: "300px" },
    );
    gate.observe(wrap);

    return () => {
      disposed = true;
      gate.disconnect();
      teardown?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const a = api.current;
    if (!a) return;
    const run = (fn: () => void) => {
      e.preventDefault();
      fn();
    };
    if (e.key === "ArrowLeft") run(() => a.rotate(-0.4));
    else if (e.key === "ArrowRight") run(() => a.rotate(0.4));
    else if (e.key === "+" || e.key === "=") run(() => a.zoom(0.8));
    else if (e.key === "-") run(() => a.zoom(1.25));
    else if (e.key === "0") run(() => a.reset());
  };

  const ready = status === "ready";
  const tool =
    "grid size-11 place-items-center rounded-full bg-paper/90 text-ink shadow-[var(--shadow-border)] backdrop-blur transition-[background-color,transform] duration-150 hover:bg-paper active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      ref={wrapRef}
      role="group"
      tabIndex={0}
      aria-label="Interactive 3D vanity. Use the arrow keys to turn it, plus and minus to zoom, and Tab to reach the labelled points."
      onKeyDown={onKeyDown}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl bg-[radial-gradient(90%_70%_at_50%_38%,var(--color-raised),var(--color-sand))] shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div ref={hostRef} className="absolute inset-0" />

      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          {status === "error" ? (
            <div className="absolute inset-0">
              <img src="/images/service-makeup.jpg" alt="" className="h-full w-full object-cover opacity-70" />
              <p className="absolute inset-x-4 bottom-4 rounded-xl bg-paper/90 px-4 py-3 text-sm text-taupe backdrop-blur">
                The 3D preview isn't available on this device. You can still explore each part from the list.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-taupe" role="status">
              <span className="size-9 animate-spin rounded-full border-2 border-bronze/30 border-t-bronze motion-reduce:animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em]">
                Loading the vanity{progress ? ` · ${progress}%` : ""}
              </span>
            </div>
          )}
        </div>
      )}

      {ready &&
        vanityHotspots.map((hs) => {
          const svc = serviceBySlug(hs.serviceSlug);
          const on = active === hs.id;
          return (
            <button
              key={hs.id}
              ref={(el) => {
                dotRefs.current[hs.id] = el;
              }}
              type="button"
              aria-pressed={on}
              aria-label={`${hs.label}${svc ? `, ${svc.name}` : ""}`}
              onClick={() => onSelect(on ? null : hs.id)}
              className="group absolute top-0 left-0 z-10 grid size-11 place-items-center transition-opacity duration-200 data-[hidden=true]:pointer-events-none data-[hidden=true]:opacity-0 focus-visible:outline-none"
            >
              <span
                aria-hidden
                className={cn(
                  "relative grid size-6 place-items-center rounded-full border border-paper/90 shadow-[0_2px_10px_rgba(26,22,18,0.35)] transition-[background-color,transform] duration-200 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
                  on ? "scale-110 bg-ink" : "bg-bronze",
                )}
              >
                {!on && <span className="absolute inset-0 animate-ping rounded-full bg-bronze/60 motion-reduce:hidden" />}
                <span className={cn("size-1.5 rounded-full", on ? "bg-bronze" : "bg-ink")} />
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[11px] tracking-wide text-paper opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {hs.label}
              </span>
            </button>
          );
        })}

      {ready && (
        <>
          <div className="absolute bottom-3 left-3 z-10 flex gap-2">
            <button type="button" className={tool} aria-label="Turn left" onClick={() => api.current?.rotate(-0.5)}>
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" className={tool} aria-label="Turn right" onClick={() => api.current?.rotate(0.5)}>
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="absolute right-3 bottom-3 z-10 flex gap-2">
            <button type="button" className={tool} aria-label="Zoom in" onClick={() => api.current?.zoom(0.8)}>
              <Plus className="size-4" />
            </button>
            <button type="button" className={tool} aria-label="Zoom out" onClick={() => api.current?.zoom(1.25)}>
              <Minus className="size-4" />
            </button>
            <button type="button" className={tool} aria-label="Reset view" onClick={() => api.current?.reset()}>
              <RotateCcw className="size-4" />
            </button>
          </div>
          <p
            className={cn(
              "pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-paper/85 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] whitespace-nowrap text-taupe backdrop-blur transition-opacity duration-500",
              touched || active ? "opacity-0" : "opacity-100",
            )}
          >
            Drag to turn · tap a point
          </p>
        </>
      )}
    </div>
  );
}
