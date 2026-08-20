import { useState } from 'react';

/**
 * Portada en video del tablero institucional.
 *
 * Arranca como póster con botón de reproducción en vez de autoplay: un video
 * que se lanza solo con audio es una barrera de accesibilidad (WCAG 2.1,
 * criterio 1.4.2 "control del audio") y además compite con el resto del
 * tablero. El usuario decide cuándo verlo.
 *
 * El video lleva subtítulos en español quemados en la imagen, de modo que la
 * versión sin audio sigue siendo comprensible.
 */
export default function VideoPortada() {
  const [reproduciendo, setReproduciendo] = useState(false);

  return (
    <section className="video-portada" aria-labelledby="video-portada-titulo">
      <div className="video-portada__marco">
        {reproduciendo ? (
          <video
            className="video-portada__video"
            src="/video-inclusion.mp4"
            poster="/video-inclusion-poster.jpg"
            controls
            autoPlay
            playsInline
            preload="metadata"
          >
            Tu navegador no puede reproducir video.{' '}
            <a href="/video-inclusion.mp4" download>
              Descargar el video
            </a>
            .
          </video>
        ) : (
          <button
            type="button"
            className="video-portada__disparador"
            onClick={() => setReproduciendo(true)}
            style={{ backgroundImage: 'url(/video-inclusion-poster.jpg)' }}
          >
            <span className="video-portada__velo" aria-hidden="true" />
            <span className="video-portada__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="video-portada__texto">
              <span className="video-portada__etiqueta">Cápsula educativa · 2:33</span>
              <span id="video-portada-titulo" className="video-portada__titulo">
                Educación inclusiva: DUA y PIAR
              </span>
              <span className="video-portada__sub">
                Qué es el Diseño Universal para el Aprendizaje, qué es el Plan Individual
                de Ajustes Razonables y en qué se diferencian
              </span>
              <span className="video-portada__cta">Reproducir</span>
            </span>
          </button>
        )}
      </div>
      <p className="video-portada__pie">
        Audio en inglés con subtítulos en español · Decreto 1421 de 2017 · Ley
        Estatutaria 1618 de 2013
      </p>
    </section>
  );
}
