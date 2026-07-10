document.addEventListener('DOMContentLoaded', function() {
    const articles = document.querySelectorAll('article');
    let currentActive = null;

    function updateActiveSection() {
        const viewportCenter = window.scrollY + window.innerHeight / 2;
        let closest = null;
        let closestDistance = Infinity;

        articles.forEach(article => {
            const rect = article.getBoundingClientRect();
            const articleCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - (window.scrollY + articleCenter));
            if (distance < closestDistance) {
                closestDistance = distance;
                closest = article;
            }
        });

        if (closest && closest !== currentActive) {
            // Remover clase 'visible' del anterior
            if (currentActive) {
                currentActive.classList.remove('visible');
            }
            // Añadir clase 'visible' al nuevo
            closest.classList.add('visible');
            currentActive = closest;
        }
    }

    // Ejecutar al cargar
    updateActiveSection();

    // Throttle para el scroll (se ejecuta como máximo cada 100ms)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });

    // También al redimensionar (por si cambia la altura)
    window.addEventListener('resize', updateActiveSection);
});

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. MOSTRAR/OCULTAR QR
    // ==========================================
    const btnQR = document.getElementById('btnMostrarQR');
    const qrContainer = document.getElementById('qrContainer');
    let qrVisible = false;

    if (btnQR && qrContainer) {
        btnQR.addEventListener('click', function() {
            qrVisible = !qrVisible;
            qrContainer.classList.toggle('visible', qrVisible);
            btnQR.textContent = qrVisible ? '🙈 Ocultar QR de contacto' : '📱 Mostrar QR de contacto';
        });
    }

    // ==========================================
    // 2. COPIAR DATOS DE CONTACTO
    // ==========================================
    const btnCopiar = document.getElementById('btnCopiarDatos');
    if (btnCopiar) {
        btnCopiar.addEventListener('click', function() {
            const datos = `
Nombre: Ximena Merlí Vásquez
Empresa: Ximena Merlin
Teléfono: +52 951 556 5230
Correo:ximena34mv@institutosanpablo.edu.mx
Web: https://ximena34mv-lab.github.io/Ximenamerlin/
            `.trim();

            // Usar clipboard API con fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(datos).then(() => {
                    alert('¡Datos copiados al portapapeles!');
                }).catch(() => {
                    copiarFallback(datos);
                });
            } else {
                copiarFallback(datos);
            }
        });
    }

    function copiarFallback(texto) {
        // Crear un elemento temporal
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('¡Datos copiados al portapapeles!');
        } catch (err) {
            alert('No se pudo copiar. Por favor, copia manualmente.');
        }
        document.body.removeChild(textarea);
    }

    // ==========================================
    // 3. ENVÍO DEL FORMULARIO (mailto)
    // ==========================================
    const form = document.getElementById('formContacto');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !correo || !mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Construir el enlace mailto:
            // destinatario: contacto@duckling.com
            // asunto: Solicitud de información desde la web
            // cuerpo: nombre, correo y mensaje
            const destinatario = 'contacto@duckling.com';
            const asunto = encodeURIComponent('Solicitud de información desde la web');
            const cuerpo = encodeURIComponent(
                `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`
            );
            const mailtoLink = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`;

            // Abrir el cliente de correo
            window.location.href = mailtoLink;
            // También podrías usar window.open(mailtoLink, '_blank') pero puede bloquearse.

            // Opcional: limpiar campos
            // form.reset();
        });
    }

});
