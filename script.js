document.getElementById('start-test').addEventListener('click', async function() {
    const spinner = document.getElementById('spinner');
    const errorMessage = document.getElementById('error-message');
    const progressContainer = document.getElementById('progress-container');
    const progressText = document.getElementById('progress-text');
    const resultDiv = document.getElementById('result');
    const startButton = document.getElementById('start-test');
    
    // Resetear estado
    errorMessage.style.display = 'none';
    spinner.style.display = 'block';
    progressContainer.style.display = 'block';
    resultDiv.style.display = 'none';
    startButton.disabled = true;
    startButton.textContent = 'Probando...';
    
    try {
        // 1. Primero probamos el ping
        progressText.textContent = "Midiendo ping...";
        const ping = await measurePing();
        document.getElementById('ping').textContent = ping;
        
        // 2. Prueba de descarga
        progressText.textContent = "Midiendo velocidad de descarga...";
        const downloadSpeed = await measureDownloadSpeed();
        document.getElementById('download-speed').textContent = downloadSpeed;
        
        // 3. Prueba de subida (simplificada)
        progressText.textContent = "Midiendo velocidad de subida...";
        const uploadSpeed = await measureUploadSpeed();
        document.getElementById('upload-speed').textContent = uploadSpeed;
        
        // Mostrar resultados
        spinner.style.display = 'none';
        progressContainer.style.display = 'none';
        resultDiv.style.display = 'block';
        startButton.disabled = false;
        startButton.textContent = 'Volver a probar';
        
    } catch (error) {
        console.error('Error en speedtest:', error);
        spinner.style.display = 'none';
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.style.display = 'block';
        startButton.disabled = false;
        startButton.textContent = 'Intentar nuevamente';
    }
});

// Función para medir ping
async function measurePing() {
    const testUrl = 'https://httpbin.org/get';
    const startTime = performance.now();
    
    try {
        const response = await fetch(testUrl, {
            method: 'GET',
            cache: 'no-store',
            mode: 'cors'
        });
        
        if (!response.ok) throw new Error('Error en la respuesta');
        
        const endTime = performance.now();
        return Math.round(endTime - startTime);
    } catch (error) {
        throw new Error(`No se pudo medir el ping: ${error.message}`);
    }
}

// Función para medir velocidad de descarga
async function measureDownloadSpeed() {
    const testUrl = 'https://httpbin.org/bytes/1000000'; // 1MB de datos
    const startTime = performance.now();
    
    try {
        const response = await fetch(testUrl, {
            method: 'GET',
            cache: 'no-store',
            mode: 'cors'
        });
        
        if (!response.ok) throw new Error('Error en la descarga');
        
        const data = await response.arrayBuffer();
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // en segundos
        const bitsLoaded = data.byteLength * 8;
        const speedMbps = (bitsLoaded / duration / 1000000).toFixed(2);
        
        return speedMbps;
    } catch (error) {
        throw new Error(`No se pudo medir la descarga: ${error.message}`);
    }
}

// Función simplificada para medir velocidad de subida
async function measureUploadSpeed() {
    const testUrl = 'https://httpbin.org/post';
    const blobSize = 500000; // 0.5MB
    const blob = new Blob([new Uint8Array(blobSize)], {type: 'application/octet-stream'});
    const startTime = performance.now();
    
    try {
        const response = await fetch(testUrl, {
            method: 'POST',
            body: blob,
            cache: 'no-store',
            mode: 'cors'
        });
        
        if (!response.ok) throw new Error('Error en la subida');
        
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // en segundos
        const bitsLoaded = blob.size * 8;
        const speedMbps = (bitsLoaded / duration / 1000000).toFixed(2);
        
        return speedMbps;
    } catch (error) {
        throw new Error(`No se pudo medir la subida: ${error.message}`);
    }
}
