// services/notificationService.js

async function sendNotification(user, message) {
  // Aquí podrías integrar un sistema real de email o push
  console.log(`📬 Notificación para ${user.email}: ${message}`);
  return true;
}

module.exports = {
  sendNotification,
};
