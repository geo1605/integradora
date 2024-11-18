 // Esperar a que todo el contenido de la página termine de cargar
 window.addEventListener('load', () => {
    const loaderContainer = document.getElementById('loaderContainer');
    const mainContent = document.getElementById('mainContent');

    // Ocultar el loader y mostrar el contenido principal
    setTimeout(() => {
        loaderContainer.classList.add('hidden');
        setTimeout(() => {
            loaderContainer.style.display = 'none'; // Elimina completamente el loader
            document.body.style.overflow = 'auto'; // Permite el scroll
        }, 500); // Tiempo del difuminado del loader
    }, 500); // Retardo antes de iniciar la desaparición del loader
});