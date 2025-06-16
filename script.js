document.getElementById('start-test').addEventListener('click', function() {
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const resultDiv = document.getElementById('result');
    
    // Mostrar progreso y ocultar resultados previos
    progressContainer.style.display = 'block';
    resultDiv.style.display = 'none';
    
    // Configuración del speedtest
    const test = new SpeedTest({
        maxTime: 15000, // 15 segundos máximo por prueba
        autoRun: false
    });
    
    // Iniciar prueba de ping
    progressBar.style.width = '10%';
    test.on('pingstart', function() {
        console.log('Prueba de ping iniciada');
    });
    
    test.on('pingend', function(ping) {
        console.log('Ping:', ping, 'ms');
        document.getElementById('ping').textContent = ping;
        progressBar.style.width = '30%';
    });
    
    // Iniciar prueba de descarga
    test.on('downloadstart', function() {
        console.log('Prueba de descarga iniciada');
    });
    
    test.on('downloadprogress', function(progress) {
        const percent = 30 + (progress * 30 / 100);
        progressBar.style.width = percent + '%';
    });
    
    test.on('downloadend', function(speed) {
        const mbps = (speed / 125000).toFixed(2);
        console.log('Velocidad de descarga:', mbps, 'Mbps');
        document.getElementById('download-speed').textContent = mbps;
        progressBar.style.width = '70%';
    });
    
    // Iniciar prueba de subida
    test.on('uploadstart', function() {
        console.log('Prueba de subida iniciada');
    });
    
    test.on('uploadprogress', function(progress) {
        const percent = 70 + (progress * 30 / 100);
        progressBar.style.width = percent + '%';
    });
    
    test.on('uploadend', function(speed) {
        const mbps = (speed / 125000).toFixed(2);
        console.log('Velocidad de subida:', mbps, 'Mbps');
        document.getElementById('upload-speed').textContent = mbps;
        progressBar.style.width = '100%';
        
        // Mostrar resultados
        setTimeout(() => {
            progressContainer.style.display = 'none';
            resultDiv.style.display = 'block';
        }, 500);
    });
    
    // Manejo de errores
    test.on('error', function(error) {
        console.error('Error:', error);
        progressContainer.style.display = 'none';
        alert('Ocurrió un error durante la prueba: ' + error.message);
    });
    
    // Iniciar el test
    test.run();
});
