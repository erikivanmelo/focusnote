import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './components/Menu';
import Color from './models/Color';
import colorService from './services/colorService';
import { useGenericQueryNoParams } from './hooks/useGenericQuery';

function App() {
  const [error, setError] = useState<string | null>(null);

  const { data: colors, isLoading, error: queryError } = useGenericQueryNoParams<Color[]>(
    ['colors'],
    colorService.getAll
  );

  if (queryError) {
    setError(`Error al conectar con el servidor: ${queryError instanceof Error ? queryError.message : 'Error desconocido'}`);
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <h4 className="alert-heading">Error de conexión</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Por favor, verifica que el servidor esté en ejecución e intenta recargar la página.</p>
      </div>
    );
  }

  return (
    <div className="row justify-content-center notes-container">
      <Menu />
      <main className="col-lg-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
