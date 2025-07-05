const { expect } = require('chai');
const { reflectOnEntry } = require('../../services/aiReflectionService')// Ajusta ruta real

describe('reflectOnEntry', () => {
  it('debería devolver mensaje positivo para emotion_score alto', () => {
    const entry = { emotion_score: 9, description: 'Hoy fue genial' };
    const result = reflectOnEntry(entry);
    expect(result).to.deep.equal({
      entradaAnalizada: true,
      mensajeReflexivo: '¡Se nota que tuviste un gran día! 🎉'
    });
  });

  it('debería devolver mensaje de apoyo para emotion_score bajo', () => {
    const entry = { emotion_score: 2, description: 'No fue un buen día' };
    const result = reflectOnEntry(entry);
    expect(result).to.deep.equal({
      entradaAnalizada: true,
      mensajeReflexivo: 'Parece que fue un día difícil. Estoy aquí para ti. 💙'
    });
  });

  it('debería agregar mensaje sobre ansiedad si la descripción la menciona', () => {
    const entry = { emotion_score: 5, description: 'Siento ansiedad todo el día' };
    const result = reflectOnEntry(entry);
    expect(result.mensajeReflexivo).to.include('Recuerda respirar profundo. La ansiedad puede pasar.');
  });

  it('debería devolver mensaje neutral si emotion_score es medio y no menciona ansiedad', () => {
    const entry = { emotion_score: 5, description: 'Día normal' };
    const result = reflectOnEntry(entry);
    expect(result).to.deep.equal({
      entradaAnalizada: true,
      mensajeReflexivo: 'Gracias por compartir tu día.'
    });
  });

  it('debería manejar description undefined sin error', () => {
    const entry = { emotion_score: 6 };
    const result = reflectOnEntry(entry);
    expect(result).to.deep.equal({
      entradaAnalizada: true,
      mensajeReflexivo: 'Gracias por compartir tu día.'
    });
  });
});
