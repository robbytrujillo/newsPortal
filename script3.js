const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const loading = document.getElementById("loading");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const pageSize = 9;

/*
API PUBLIC INDONESIA:
https://api-berita-indonesia.vercel.app/

Contoh:
https://api-berita-indonesia.vercel.app/cnn/teknologi/
https://api-berita-indonesia.vercel.app/cnn/olahraga/
https://api-berita-indonesia.vercel.app/cnn/ekonomi/
*/

const categoryMap = {
    "": "terbaru",
    "technology": "teknologi",
    "sports": "olahraga",
    "business": "ekonomi",
    "health": "gayaHidup"
};

async function fetchNews() {
    loading.style.display = "block";

    const search = searchInput.value.toLowerCase();
    const category = categoryMap[categorySelect.value] || "terbaru";

    const url = `https://api-berita-indonesia.vercel.app/cnn/${category}/`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let articles = data.data.posts || [];

        // Search filter
        if (search) {
            articles = articles.filter(article =>
                article.title.toLowerCase().includes(search)
            );
        }

        // Pagination manual
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedArticles = articles.slice(start, end);

        displayNews(paginatedArticles);

        localStorage.setItem("cachedNews", JSON.stringify(articles));

        pageInfo.textContent = `Halaman ${currentPage}`;
    } catch (error) {
        const cached = JSON.parse(localStorage.getItem("cachedNews"));

        if (cached) {
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            displayNews(cached.slice(start, end));
        } else {
            newsContainer.innerHTML = "<p>Gagal memuat berita Indonesia.</p>";
        }
    }

    loading.style.display = "none";
}

function displayNews(articles) {
    newsContainer.innerHTML = "";

    if (!articles.length) {
        newsContainer.innerHTML = "<p>Berita tidak ditemukan.</p>";
        return;
    }

    articles.forEach(article => {
        const card = document.createElement("div");
        card.classList.add("news-card");

        card.innerHTML = `
            <img src="${article.thumbnail || 'https://via.placeholder.com/400x250'}" alt="news">
            <div class="news-content">
                <h3>${article.title}</h3>
                <p>${article.description || 'Berita terbaru Indonesia.'}</p>
                <a href="${article.link}" target="_blank">Baca Selengkapnya →</a>
            </div>
        `;

        newsContainer.appendChild(card);
    });
}

// Pagination
document.getElementById("nextBtn").addEventListener("click", () => {
    currentPage++;
    fetchNews();
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews();
    }
});

// Search
searchInput.addEventListener("keyup", () => {
    currentPage = 1;
    fetchNews();
});

// Category
categorySelect.addEventListener("change", () => {
    currentPage = 1;
    fetchNews();
});

// Dark Mode
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

fetchNews();
```

### API Public Berita Indonesia:

* https://api-berita-indonesia.vercel.app/cnn/terbaru/
* https://api-berita-indonesia.vercel.app/cnn/teknologi/
* https://api-berita-indonesia.vercel.app/cnn/olahraga/
* https://api-berita-indonesia.vercel.app/cnn/ekonomi/
* https://api-berita-indonesia.vercel.app/cnn/gayaHidup/
