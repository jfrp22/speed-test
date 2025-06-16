document.getElementById('start-test').addEventListener('click', function() {
    const spinner = document.getElementById('spinner');
    const progressContainer = document.getElementById('progress-container');
    const progressText = document.getElementById('progress-text');
    const resultDiv = document.getElementById('result');
    const startButton = document.getElementById('start-test');
    
    // Configurar estado inicial
    spinner.style.display = 'block';
    progressContainer.style.display = 'block';
    resultDiv.style.display = 'none';
    startButton.disabled = true;
    startButton.textContent = 'Probando...';
    
    // Crear instancia del test
    const test = speedTest({
        maxTime: 15000,
        pingCount: 5,
        maxServers: 3
    });
    
    // Manejar eventos
    test.on('downloadspeedprogress', function(speed) {
        const mbps = (speed / 1000000).toFixed(2);
        progressText.textContent = `Probando descarga: ${mbps} Mbps`;
    });
    
    test.on('uploadspeedprogress', function(speed) {
        const mbps = (speed / 1000000).toFixed(2);
        progressText.textContent = `Probando subida: ${mbps} Mbps`;
    });
    
    test.on('testserver', function(server) {
        progressText.textContent = `Conectado a: ${server.location}`;
    });
    
    // Cuando se completan las pruebas
    test.on('data', function(data) {
        document.getElementById('download-speed').textContent = 
            (data.download / 1000000).toFixed(2);
        document.getElementById('upload-speed').textContent = 
            (data.upload / 1000000).toFixed(2);
        document.getElementById('ping').textContent = 
            data.ping.toFixed(0);
        
        spinner.style.display = 'none';
        progressContainer.style.display = 'none';
        resultDiv.style.display = 'block';
        startButton.disabled = false;
        startButton.textContent = 'Volver a probar';
    });
    
    // Manejar errores
    test.on('error', function(error) {
        console.error('Error:', error);
        spinner.style.display = 'none';
        progressText.textContent = 'Error: ' + error.message;
        startButton.disabled = false;
        startButton.textContent = 'Intentar nuevamente';
    });
    
    // Iniciar el test
    test.start();
});
