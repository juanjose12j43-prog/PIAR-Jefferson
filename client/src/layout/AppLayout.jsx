import Sidebar from './Sidebar.jsx';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      {/* Enlace de salto: primer elemento enfocable de la página. Permite a
          quien navega por teclado o lector de pantalla ir directo al
          contenido sin recorrer todo el menú en cada cambio de sección. */}
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido principal
      </a>
      <Sidebar />
      <main className="app-content" id="contenido-principal" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
