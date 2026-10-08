"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

type View = "landing" | "interiors" | "furniture";
type MenuName = "approach" | "projects" | null;

type Project = {
  id: string;
  title: string;
  eyebrow: string;
  image?: string;
  mock?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

const CANVAS_WIDTH = 2520;
const CANVAS_HEIGHT = 1720;

const projects: Project[] = [
  {
    id: "trevi",
    title: "Proyecto Trevi",
    eyebrow: "Interiorismo · archivo Gennaio",
    image: "/gennaio/furniture-01.webp",
    x: 150,
    y: 170,
    width: 380,
    height: 470,
  },
  {
    id: "potenza",
    title: "Proyecto Potenza",
    eyebrow: "Mobiliario integral · archivo Gennaio",
    image: "/gennaio/interior-02.webp",
    x: 820,
    y: 80,
    width: 540,
    height: 330,
  },
  {
    id: "volterra",
    title: "Proyecto Volterra",
    eyebrow: "Diseño residencial · archivo Gennaio",
    image: "/gennaio/furniture-03.webp",
    x: 1680,
    y: 180,
    width: 390,
    height: 480,
  },
  {
    id: "sorrento",
    title: "Proyecto Sorrento",
    eyebrow: "Materialidad · archivo Gennaio",
    image: "/gennaio/interior-01.webp",
    x: 470,
    y: 790,
    width: 560,
    height: 320,
  },
  {
    id: "padua",
    title: "Proyecto Padua",
    eyebrow: "Mobiliario a medida · archivo Gennaio",
    image: "/gennaio/furniture-05.webp",
    x: 1290,
    y: 720,
    width: 430,
    height: 520,
  },
  {
    id: "benevento",
    title: "Proyecto Benevento",
    eyebrow: "Interiorismo · archivo Gennaio",
    image: "/gennaio/interior-04.webp",
    x: 2030,
    y: 820,
    width: 360,
    height: 460,
  },
  {
    id: "lorem-01",
    title: "Proyecto Lorem 01",
    eyebrow: "MOCK CONTENT · reemplazar",
    mock: true,
    x: 70,
    y: 1260,
    width: 430,
    height: 300,
  },
  {
    id: "lorem-02",
    title: "Proyecto Lorem 02",
    eyebrow: "MOCK CONTENT · reemplazar",
    mock: true,
    x: 940,
    y: 1330,
    width: 350,
    height: 280,
  },
  {
    id: "lorem-03",
    title: "Proyecto Lorem 03",
    eyebrow: "MOCK CONTENT · reemplazar",
    mock: true,
    x: 1770,
    y: 1360,
    width: 520,
    height: 260,
  },
];

const furniture = [
  { name: "Consola Nure", image: "/gennaio/furniture-01.webp" },
  { name: "Consola Nocello", image: "/gennaio/furniture-02.webp" },
  { name: "Sillón Panaro", image: "/gennaio/furniture-03.webp" },
  { name: "Puff Oglio", image: "/gennaio/furniture-04.webp" },
  { name: "Mueble a medida", image: "/gennaio/furniture-05.webp" },
];

const approachItems = [
  ["01", "Escuchar"],
  ["02", "Imaginar"],
  ["03", "Diseñar"],
  ["04", "Materializar"],
];

export default function GennaioExperience() {
  const [view, setView] = useState<View>("landing");

  useEffect(() => {
    document.title = "Gennaio — Interiorismo & Mobiliario";
  }, []);

  if (view === "interiors") {
    return <InteriorExperience onHome={() => setView("landing")} />;
  }

  if (view === "furniture") {
    return <FurnitureView onHome={() => setView("landing")} />;
  }

  return (
    <main className="landing" aria-label="Gennaio">
      <div className="landing-brand" aria-label="Gennaio estudio">
        <span>gennaio</span>
        <small>estudio</small>
      </div>

      <button
        className="landing-choice landing-choice-interiors"
        onClick={() => setView("interiors")}
        type="button"
      >
        <Image
          src="/gennaio/furniture-03.webp"
          alt="Interior diseñado por Gennaio"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 55vw"
        />
        <span className="landing-shade" />
        <span className="landing-index">01</span>
        <span className="landing-label">
          <small>Espacios con identidad</small>
          <strong>Diseño de interiores</strong>
          <em>Explorar proyectos ↗</em>
        </span>
      </button>

      <button
        className="landing-choice landing-choice-furniture"
        onClick={() => setView("furniture")}
        type="button"
      >
        <Image
          src="/gennaio/furniture-05.webp"
          alt="Mueble diseñado a medida por Gennaio"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 55vw"
        />
        <span className="landing-shade" />
        <span className="landing-index">02</span>
        <span className="landing-label">
          <small>Piezas propias y personalizadas</small>
          <strong>Muebles</strong>
          <em>Ver colección ↗</em>
        </span>
      </button>

      <p className="landing-footnote">Buenos Aires · Argentina</p>
    </main>
  );
}

function InteriorExperience({ onHome }: { onHome: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const targetVelocityRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const [menu, setMenu] = useState<MenuName>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [preview, setPreview] = useState<Project>(projects[0]);

  useLayoutEffect(() => {
    const x = (window.innerWidth - CANVAS_WIDTH) / 2;
    const y = (window.innerHeight - CANVAS_HEIGHT) / 2;
    positionRef.current = { x, y };
    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const position = positionRef.current;
      const velocity = velocityRef.current;
      const target = targetVelocityRef.current;

      velocity.x += (target.x - velocity.x) * 0.055;
      velocity.y += (target.y - velocity.y) * 0.055;
      position.x += velocity.x;
      position.y += velocity.y;

      const maxX = 80;
      const minX = window.innerWidth - CANVAS_WIDTH - 80;
      const maxY = 110;
      const minY = window.innerHeight - CANVAS_HEIGHT - 90;
      position.x = Math.min(maxX, Math.max(minX, position.x));
      position.y = Math.min(maxY, Math.max(minY, position.y));

      if (canvasRef.current) {
        canvasRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.active) {
      const dx = event.clientX - dragRef.current.x;
      const dy = event.clientY - dragRef.current.y;
      positionRef.current.x += dx;
      positionRef.current.y += dy;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
      return;
    }

    if (event.pointerType !== "mouse" || menu || selected) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const deadWidth = viewportWidth * 0.3;
    const deadHeight = viewportWidth * 0.3;
    const left = (viewportWidth - deadWidth) / 2;
    const right = left + deadWidth;
    const top = (viewportHeight - deadHeight) / 2;
    const bottom = top + deadHeight;
    const maxSpeed = 8.5;

    let xSpeed = 0;
    let ySpeed = 0;

    if (event.clientX < left) {
      const force = (left - event.clientX) / Math.max(left, 1);
      xSpeed = maxSpeed * force * force;
    } else if (event.clientX > right) {
      const force = (event.clientX - right) / Math.max(viewportWidth - right, 1);
      xSpeed = -maxSpeed * force * force;
    }

    if (event.clientY < top) {
      const force = (top - event.clientY) / Math.max(top, 1);
      ySpeed = maxSpeed * force * force;
    } else if (event.clientY > bottom) {
      const force = (event.clientY - bottom) / Math.max(viewportHeight - bottom, 1);
      ySpeed = -maxSpeed * force * force;
    }

    targetVelocityRef.current = { x: xSpeed, y: ySpeed };
  };

  const stopMovement = () => {
    targetVelocityRef.current = { x: 0, y: 0 };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  const openMenu = (name: Exclude<MenuName, null>) => {
    stopMovement();
    setMenu(name);
  };

  const openProject = (project: Project) => {
    stopMovement();
    setMenu(null);
    setSelected(project);
  };

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    window.addEventListener("keydown", closeMenu);
    return () => window.removeEventListener("keydown", closeMenu);
  }, []);

  return (
    <main
      className="interior-shell"
      onPointerMove={handlePointerMove}
      onPointerLeave={stopMovement}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <header className="topbar">
        <button className="wordmark" onClick={onHome} type="button">
          gennaio
        </button>
        <nav aria-label="Navegación de interiorismo">
          <button
            aria-expanded={menu === "approach"}
            className={menu === "approach" ? "active" : ""}
            onClick={() => openMenu("approach")}
            onFocus={() => openMenu("approach")}
            onMouseEnter={() => openMenu("approach")}
            type="button"
          >
            Approach
          </button>
          <button
            aria-expanded={menu === "projects"}
            className={menu === "projects" ? "active" : ""}
            onClick={() => openMenu("projects")}
            onFocus={() => openMenu("projects")}
            onMouseEnter={() => openMenu("projects")}
            type="button"
          >
            Projects
          </button>
          <a href="https://wa.me/5491124051143" target="_blank" rel="noreferrer">
            Contact
          </a>
        </nav>
        <p>Interior design</p>
      </header>

      <div
        className={`menu-panel ${menu ? "menu-panel-open" : ""}`}
        onMouseLeave={() => setMenu(null)}
      >
        {menu === "approach" ? (
          <div className="menu-layout approach-menu">
            <div className="menu-copy">
              <p className="menu-kicker">Nuestra manera de hacer</p>
              <p className="approach-intro">
                Diseñamos espacios personales a partir de cómo se viven, cómo se
                recorren y qué historias deben guardar.
              </p>
              <p className="mock-inline">Texto institucional · MOCK PARA EDITAR</p>
            </div>
            <ol className="reveal-list">
              {approachItems.map(([number, label], index) => (
                <li key={label} style={{ "--i": index } as CSSProperties}>
                  <span>{number}</span>
                  {label}
                </li>
              ))}
            </ol>
            <div className="approach-collage" aria-hidden="true">
              <div className="collage-image collage-image-a">
                <Image
                  src="/gennaio/interior-01.webp"
                  alt=""
                  fill
                  sizes="22vw"
                />
              </div>
              <div className="collage-image collage-image-b">
                <Image
                  src="/gennaio/interior-03.webp"
                  alt=""
                  fill
                  sizes="18vw"
                />
              </div>
              <span>Materia · luz · escala</span>
            </div>
          </div>
        ) : null}

        {menu === "projects" ? (
          <div className="menu-layout projects-menu">
            <div>
              <p className="menu-kicker">Índice de proyectos</p>
              <ol className="project-index">
                {projects.map((project, index) => (
                  <li key={project.id} style={{ "--i": index } as CSSProperties}>
                    <button
                      onClick={() => openProject(project)}
                      onFocus={() => setPreview(project)}
                      onMouseEnter={() => setPreview(project)}
                      type="button"
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {project.title}
                      {project.mock ? <em>MOCK</em> : null}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <ProjectPreview project={preview} />
          </div>
        ) : null}
      </div>

      <div className="canvas-hint" aria-hidden="true">
        <span>Mover cursor</span>
        <i />
        <span>para explorar</span>
      </div>

      <div
        className="project-canvas"
        ref={canvasRef}
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        {projects.map((project, index) => (
          <button
            className={`project-card ${project.mock ? "project-card-mock" : ""}`}
            key={project.id}
            onClick={() => openProject(project)}
            style={{
              left: project.x,
              top: project.y,
              width: project.width,
              height: project.height,
              "--delay": `${index * 70}ms`,
            } as CSSProperties}
            type="button"
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 760px) 70vw, 40vw"
              />
            ) : (
              <span className="mock-visual">
                <b>MOCK IMAGE</b>
                <i>Lorem ipsum / reemplazar fotografía</i>
              </span>
            )}
            <span className="project-caption">
              <small>{project.eyebrow}</small>
              <strong>{project.title}</strong>
            </span>
          </button>
        ))}
      </div>

      <div className="dead-zone-label" aria-hidden="true">
        <span>Gennaio</span>
        <small>move mouse</small>
      </div>

      {selected ? (
        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      ) : null}
    </main>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  return (
    <div className={`menu-preview ${project.mock ? "menu-preview-mock" : ""}`}>
      {project.image ? (
        <Image src={project.image} alt="" fill sizes="32vw" />
      ) : (
        <span className="mock-visual">
          <b>MOCK IMAGE</b>
          <i>Fotografía pendiente</i>
        </span>
      )}
      <p>{project.eyebrow}</p>
    </div>
  );
}

function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <section className="project-detail" aria-modal="true" role="dialog">
      <button className="detail-close" onClick={onClose} type="button">
        Cerrar <span>×</span>
      </button>
      <div className={`detail-hero ${project.mock ? "detail-hero-mock" : ""}`}>
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
          />
        ) : (
          <span className="mock-visual">
            <b>MOCK IMAGE</b>
            <i>Lorem ipsum / reemplazar fotografía de proyecto</i>
          </span>
        )}
      </div>
      <div className="detail-copy">
        <p>{project.eyebrow}</p>
        <h1>{project.title}</h1>
        <div>
          <p className="mock-inline">MOCK CONTENT · reemplazar descripción</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Un espacio
            pensado desde la materia, la luz natural y el ritmo cotidiano de
            quienes lo habitan.
          </p>
        </div>
      </div>
    </section>
  );
}

function FurnitureView({ onHome }: { onHome: () => void }) {
  return (
    <main className="furniture-view">
      <header className="furniture-header">
        <button className="wordmark" onClick={onHome} type="button">
          gennaio
        </button>
        <p>Muebles propios y a medida</p>
        <button onClick={onHome} type="button">
          Volver
        </button>
      </header>

      <section className="furniture-hero">
        <p>Objetos que completan una forma de habitar.</p>
        <h1>Muebles con una historia propia.</h1>
        <span className="mock-inline">Texto editorial · MOCK PARA EDITAR</span>
      </section>

      <section className="furniture-grid" aria-label="Selección de mobiliario">
        {furniture.map((item, index) => (
          <article className="furniture-card" key={item.name}>
            <div className="furniture-image">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{item.name}</h2>
              <p>A medida · Terminaciones personalizables</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
