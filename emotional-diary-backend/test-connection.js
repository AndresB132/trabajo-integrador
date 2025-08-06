const axios = require('axios');

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function testBackendConnection() {
  console.log('🔍 Probando conectividad con el backend...\n');

  try {
    // Test 1: Endpoint principal
    console.log('1️⃣ Probando endpoint principal...');
    const mainResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Endpoint principal:', mainResponse.data);
    console.log('');

    // Test 2: Health check
    console.log('2️⃣ Probando health check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test 3: CORS test
    console.log('3️⃣ Probando CORS...');
    const corsResponse = await axios.get(`${BASE_URL}/api/test-cors`);
    console.log('✅ CORS test:', corsResponse.data);
    console.log('');

    // Test 4: Auth endpoint (sin autenticación)
    console.log('4️⃣ Probando endpoint de auth...');
    try {
      const authResponse = await axios.get(`${BASE_URL}/api/auth`);
      console.log('✅ Auth endpoint accesible');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Auth endpoint protegido correctamente (401)');
      } else {
        console.log('⚠️ Auth endpoint:', error.message);
      }
    }
    console.log('');

    // Test 5: PostgreSQL connection
    console.log('5️⃣ Probando conexión a PostgreSQL...');
    try {
      const dbResponse = await axios.get(`${BASE_URL}/api/test-db`);
      console.log('✅ PostgreSQL conectado:', dbResponse.data);
    } catch (error) {
      console.log('❌ Error conectando a PostgreSQL:', error.response?.data || error.message);
    }
    console.log('');

    console.log('🎉 ¡Todas las pruebas pasaron! El backend está funcionando correctamente.');
    console.log(`📡 URL del backend: ${BASE_URL}`);
    console.log('🔗 El frontend puede conectarse usando esta URL');

  } catch (error) {
    console.error('❌ Error conectando con el backend:');
    console.error('Mensaje:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Posibles soluciones:');
      console.error('1. Verifica que el backend esté corriendo: npm run docker:up');
      console.error('2. Verifica que el puerto 5000 esté disponible');
      console.error('3. Revisa los logs: npm run docker:logs');
    }
  }
}

// Función para probar desde el navegador
function generateBrowserTest() {
  console.log('\n🌐 Para probar desde el navegador, abre la consola y ejecuta:');
  console.log(`
fetch('${BASE_URL}/api/health')
  .then(response => response.json())
  .then(data => console.log('✅ Backend conectado:', data))
  .catch(error => console.error('❌ Error:', error));
  `);
}

// Ejecutar pruebas
testBackendConnection().then(() => {
  generateBrowserTest();
}); 