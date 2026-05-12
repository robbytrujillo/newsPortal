const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const loading = document.getElementById("loading");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const pageSize = 8;
let allArticles = [];

/*
Menggunakan Hacker News Algolia API
Public
Gratis
Tanpa API Key
Stabil
*/

const categoryMap = {
  terbaru: "indonesia",
  teknologi: "technology",
  olahraga: "sports",
  ekonomi: "business",
  gayaHidup: "lifestyle",
};

async function fetchNews() {
  loading.style.display = "block";

  const category = categorySelect.value || "terbaru";
  const search = searchInput.value.trim();

  const query = search || categoryMap[category];

  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&hitsPerPage=50`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    allArticles = result.hits || [];

    localStorage.setItem("cachedNews", JSON.stringify(allArticles));
  } catch (error) {
    console.error("API Error:", error);
    allArticles = JSON.parse(localStorage.getItem("cachedNews")) || [];
  }

  renderNews();
  loading.style.display = "none";
}

function renderNews() {
  newsContainer.innerHTML = "";

  if (!allArticles.length) {
    newsContainer.innerHTML = "<p>Berita tidak ditemukan.</p>";
    pageInfo.textContent = "Halaman 0 / 0";
    return;
  }

  const totalPages = Math.ceil(allArticles.length / pageSize);

  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const paginatedArticles = allArticles.slice(start, end);

  paginatedArticles.forEach((article) => {
    // Karena HackerNews API tidak menyediakan gambar valid,
    // gunakan screenshot website via microlink gratis
    const link = article.url || article.story_url || "#";
    const image =
      link !== "#"
        ? `https://api.microlink.io/?url=${encodeURIComponent(link)}&screenshot=true&meta=false&embed=screenshot.url`
        : "https://via.placeholder.com/800x500?text=No+Image";
    const title =
      article.title || article.story_title || "Judul tidak tersedia";
    const description = article.url || article.story_url || "Berita terbaru.";
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = ` <img src="${image}" alt="news" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/800x500?text=No+Image';" > <div class="news-content"> <h3>${title}</h3> <p>${description.substring(0, 120)}...</p> <a href="${link}" target="_blank">Baca Selengkapnya →</a> </div> `;
    newsContainer.appendChild(card);
  });

  pageInfo.textContent = `Halaman ${currentPage} / ${totalPages}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage >= totalPages;
}

// Pagination
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < Math.ceil(allArticles.length / pageSize)) {
    currentPage++;
    renderNews();
  }
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderNews();
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

// Dark mode
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Initial
fetchNews();
