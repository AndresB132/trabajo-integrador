function reflectOnEntry(entry) {
  const { emotion_score, description } = entry;
  let message = 'Gracias por compartir tu día.';
  if (emotion_score >= 8) message = '¡Se nota que tuviste un gran día! 🎉';
  else if (emotion_score <= 3) message = 'Parece que fue un día difícil. Estoy aquí para ti. 💙';

  if (description?.toLowerCase().includes('ansiedad')) {
    message += ' Recuerda respirar profundo. La ansiedad puede pasar.';
  }

  return { entradaAnalizada: true, mensajeReflexivo: message };
}

module.exports = { reflectOnEntry };
