const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const loading = document.getElementById("loading");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const pageSize = 8;

/*
PUBLIC API SAMPLE:
https://api.spaceflightnewsapi.net/v4/articles/
Tidak perlu API Key
*/
async function fetchNews() {
  loading.style.display = "block";

  const search = searchInput.value;
  const category = categorySelect.value;

  let url = `https://api.spaceflightnewsapi.net/v4/articles/?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`;

  if (search) {
    url += `&search=${search}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    let articles = data.results;

    if (category) {
      articles = articles.filter((article) =>
        article.title.toLowerCase().includes(category.toLowerCase()),
      );
    }

    displayNews(articles);

    localStorage.setItem("cachedNews", JSON.stringify(articles));
  } catch (error) {
    const cached = JSON.parse(localStorage.getItem("cachedNews"));
    if (cached) {
      displayNews(cached);
    } else {
      newsContainer.innerHTML = "<p>Gagal memuat berita.</p>";
    }
  }

  pageInfo.textContent = `Halaman ${currentPage}`;
  loading.style.display = "none";
}

function displayNews(articles) {
  newsContainer.innerHTML = "";

  if (articles.length === 0) {
    newsContainer.innerHTML = "<p>Berita tidak ditemukan.</p>";
    return;
  }

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("news-card");

    card.innerHTML = `
            <img src="${article.image_url || "https://via.placeholder.com/400x250"}" alt="news">
            <div class="news-content">
                <h3>${article.title}</h3>
                <p>${article.summary.substring(0, 120)}...</p>
                <a href="${article.url}" target="_blank">Baca Selengkapnya →</a>
            </div>
        `;

    newsContainer.appendChild(card);
  });
}

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

searchInput.addEventListener("change", () => {
  currentPage = 1;
  fetchNews();
});

categorySelect.addEventListener("change", () => {
  currentPage = 1;
  fetchNews();
});

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

fetchNews();
