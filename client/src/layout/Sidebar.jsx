import { NavLink } from 'react-router-dom';
import { IconoTablero, IconoLibro, IconoDocumento } from '../components/Iconos.jsx';

const secciones = [
  { path: '/', label: 'Tablero institucional', Icono: IconoTablero },
  { path: '/centro-conocimiento', label: 'Centro de conocimiento', Icono: IconoLibro },
  { path: '/asistente-anexos', label: 'Asistente de anexos', Icono: IconoDocumento },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* El escudo es contenido informativo (identifica la institución), no
          decorativo, por eso lleva texto alternativo real y no alt="". */}
      <div className="sidebar-brand">
        <img
          className="sidebar-escudo"
          src="/escudo-jefferson.png"
          alt="Escudo del Colegio Jefferson"
          width="46"
          height="46"
        />
        <div className="sidebar-brand-texto">
          <span className="sidebar-brand-mark">Colegio Jefferson</span>
          <span className="sidebar-brand-sub">Inclusión y PIAR</span>
        </div>
      </div>

      {/* aria-label distingue esta navegación de cualquier otra de la página
          para quien usa lector de pantalla. */}
      <nav className="sidebar-nav" aria-label="Secciones principales">
        {secciones.map(({ path, label, Icono }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {/* aria-current le anuncia al lector de pantalla cuál es la
                sección actual; el color por sí solo no lo comunica. */}
            {({ isActive }) => (
              <>
                <span className="sidebar-icon" aria-hidden="true">
                  <Icono size={18} />
                </span>
                <span>{label}</span>
                {isActive && <span className="sr-only"> (sección actual)</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>Equipo de Orientación</span>
      </div>
    </aside>
  );
}
