// ===== ELEMENTOS =====
const btndark = document.getElementById('dark-mode-toggle');
const botoesFiltro = document.querySelectorAll('.btn-filtro');
const itensGaleria = document.querySelectorAll('.galeria-item');

// ===== FILTRO GALERIA =====
botoesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
        botoesFiltro.forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');

        const filtro = btn.dataset.filtro;

        itensGaleria.forEach(item => {
            if (filtro === 'todos' || item.dataset.categoria === filtro) {
                item.classList.remove('oculto');
            } else {
                item.classList.add('oculto');
            }
        });
    });
});

// ===== LIGHTBOX =====
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
    <span id="fechar-lightbox">&times;</span>
    <img id="lightbox-img" src="" alt="Imagem ampliada">
`;

document.body.appendChild(lightbox);

const lightboxImg = document.getElementById('lightbox-img');
const fecharLightbox = document.getElementById('fechar-lightbox');

// Abrir imagem
itensGaleria.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');

        if (img) {
            lightboxImg.src = img.src;
            lightbox.classList.add('ativo');
        }
    });
});

// Fechar no X
fecharLightbox.addEventListener('click', () => {
    lightbox.classList.remove('ativo');
});

// Fechar fora
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('ativo');
    }
});

// Fechar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        lightbox.classList.remove('ativo');
    }
});

// ===== DARK MODE =====
if (localStorage.getItem('tema') === 'dark') {
    document.body.classList.add('tema-dark');

    if (btndark) {
        btndark.textContent = '⏾';
    }
}

if (btndark) {
    btndark.addEventListener('click', () => {
        document.body.classList.toggle('tema-dark');

        if (document.body.classList.contains('tema-dark')) {
            localStorage.setItem('tema', 'dark');
            btndark.textContent = '⏾';
        } else {
            localStorage.setItem('tema', 'light');
            btndark.textContent = '⏾';
        }
    });
}