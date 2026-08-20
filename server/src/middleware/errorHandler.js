// Manejador de errores centralizado
export function errorHandler(err, req, res, next) {
  console.error(err);

  // API key de Anthropic ausente o inválida: mensaje claro para el usuario
  const mensaje = String(err.message || '');
  if (mensaje.includes('Could not resolve authentication method') || err.status === 401) {
    return res.status(503).json({
      error:
        'El servicio de IA no está configurado. Agrega tu ANTHROPIC_API_KEY en el archivo server/.env y reinicia el servidor.',
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
  });
}
