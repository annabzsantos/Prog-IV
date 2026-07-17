// ===== ELEMENTOS =====
const btndark = document.getElementById('dark-mode-toggle');

// ===== AUTENTICAÇÃO AUTOMÁTICA (sem tela de login) =====
const API_URL = "http://localhost:3000";

// Credenciais fixas só pra satisfazer o requisito de JWT sem expor tela de login
const AUTH_EMAIL = "visitante@avatar.com";
const AUTH_PASSWORD = "avatar123";

async function garantirLogin() {
    let token = localStorage.getItem("token");
    if (token) return token;

    // tenta logar; se o usuário não existir, registra e loga
    let res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: AUTH_EMAIL, password: AUTH_PASSWORD }),
    });

    if (!res.ok) {
        await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: AUTH_EMAIL, password: AUTH_PASSWORD }),
        });
        res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: AUTH_EMAIL, password: AUTH_PASSWORD }),
        });
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data.token;
}

// ===== GALERIA DINÂMICA =====
const grid = document.getElementById('galeria-grid');
const botoesFiltro = document.querySelectorAll('.btn-filtro');

async function carregarGaleria(categoria = 'todos') {
    if (!grid) return;

    const token = await garantirLogin();

    const url = categoria === 'todos'
        ? `${API_URL}/galery`
        : `${API_URL}/galery?categoria=${categoria}`;

    try {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
            // token expirado: limpa e tenta de novo
            localStorage.removeItem("token");
            return carregarGaleria(categoria);
        }

        const itens = await res.json();
        grid.innerHTML = "";

        itens.forEach(item => {
            grid.insertAdjacentHTML('beforeend', `
                <div class="galeria-item" data-categoria="${item.categoria}" data-legenda="${item.titulo} — ${item.conteudo}">
                    <img src="${item.imagem}" alt="${item.titulo}">
                    <div class="tag-categoria">${item.categoria}</div>
                    <div class="galeria-overlay">
                        <span>${item.titulo}</span>
                        <p>${item.conteudo}</p>
                    </div>
                </div>
            `);
        });

        ativarLightboxNosItens();
    } catch (e) {
        grid.innerHTML = `<p style="color:red;">Erro ao carregar a galeria: ${e.message}</p>`;
    }
}

botoesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
        botoesFiltro.forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        carregarGaleria(btn.dataset.filtro);
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

function ativarLightboxNosItens() {
    document.querySelectorAll('.galeria-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('ativo');
            }
        });
    });
}

fecharLightbox.addEventListener('click', () => {
    lightbox.classList.remove('ativo');
});
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('ativo');
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        lightbox.classList.remove('ativo');
    }
});

// ===== DARK MODE =====
if (localStorage.getItem('tema') === 'dark') {
    document.body.classList.add('tema-dark');
}
if (btndark) {
    btndark.addEventListener('click', () => {
        document.body.classList.toggle('tema-dark');
        localStorage.setItem('tema', document.body.classList.contains('tema-dark') ? 'dark' : 'light');
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    carregarGaleria();
});