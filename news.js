fetch("news.json")
    .then(response => response.json())
    .then(data => {
        let newsSection = document.getElementById("news");
        newsSection.innerHTML = "";  // Clear previous content
        data.news.forEach(newsItem => {
            newsSection.innerHTML += `
                <div class="news-card">
                    <h3>${newsItem.headline}</h3>
                    <p>${newsItem.summary}</p>
                    <a href="${newsItem.source}" target="_blank">Read more</a>
                </div>
            `;
        });
    })
    .catch(error => console.error("Error loading news:", error));
