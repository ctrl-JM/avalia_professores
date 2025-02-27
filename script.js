document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reviewForm");
    const reviewsContainer = document.getElementById("reviews");
    const professorSelect = document.getElementById("professor");
    const searchForm = document.getElementById("searchForm");
    const searchSelect = document.getElementById("searchProfessor");
    const professorInfo = document.getElementById("professorInfo");

    let ratingsData = JSON.parse(localStorage.getItem("ratingsData")) || {
        "Professor A": { total: 0, count: 0, reviews: [] },
        "Professor B": { total: 0, count: 0, reviews: [] },
        "Professor C": { total: 0, count: 0, reviews: [] }
    };

<<<<<<< HEAD
    const professorDetails = {
        "Professor A": { img: "style/assets/Alessandro-Carvalho-Sales.png", department: "Ciências Sociais" },
        "Professor B": { img: "style/assets/alessandraelfar.jpg", department: "Ciências Sociais" },
        "Professor C": { img: "style/assets/professorC.jpg", department: "Ciências Sociais" }
    };
=======
    // Função para atualizar a média de avaliações e as últimas avaliações
    function updateProfessorInfo(professor) {
        const avgRating = getAverageRating(professor);
        const professorCard = document.getElementById(professor);
        const ratingSpan = professorCard.querySelector('.rating');
        const reviewsDiv = professorCard.querySelector('.reviews');

        // Atualizar a média de avaliações
        ratingSpan.innerText = avgRating;

        // Exibir as últimas avaliações
        const lastReviews = getLastReviews(professor);
        reviewsDiv.innerHTML = lastReviews || "<p>Ainda não há avaliações.</p>";
    }
>>>>>>> dd20cd0 (segunda-versao)

    function getAverageRating(professor) {
        return ratingsData[professor].count > 0 
            ? (ratingsData[professor].total / ratingsData[professor].count).toFixed(2) 
            : "N/A";
    }

    function getLastReviews(professor) {
        return ratingsData[professor].reviews.slice(-5).map(review => {
            return `<p><strong>Nota:</strong> ${review.rating} - ${review.comment}</p>`;
        }).join("");
    }

    // Event listener para o formulário de busca
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const professor = searchSelect.value;
<<<<<<< HEAD
        const avgRating = getAverageRating(professor);
        const { img, department } = professorDetails[professor];
        const lastReviews = getLastReviews(professor);
        
        professorInfo.innerHTML = `
            <div class="professor-card">
                <img src="${img}" alt="${professor}">
                <h3>${professor}</h3>
                <p>Departamento: ${department}</p>
                <p>Média Atual: ${avgRating}</p>
                <h4>Últimas Avaliações:</h4>
                ${lastReviews || "<p>Ainda não há avaliações.</p>"}
            </div>
        `;
=======
        updateProfessorInfo(professor);
>>>>>>> dd20cd0 (segunda-versao)
    });

    // Event listener para o formulário de avaliação
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const professor = professorSelect.value;
        const rating = parseFloat(document.getElementById("rating").value);
        const comment = document.getElementById("comment").value;

        // Verificar se os campos foram preenchidos corretamente
        if (!professor || isNaN(rating) || rating < 1 || rating > 5 || !comment.trim()) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        // Adicionar a avaliação ao banco de dados local
        ratingsData[professor].total += rating;
        ratingsData[professor].count += 1;
        ratingsData[professor].reviews.push({ rating, comment });
        localStorage.setItem("ratingsData", JSON.stringify(ratingsData));

        // Limpar os campos do formulário
        form.reset();

<<<<<<< HEAD
        // Atualizar as avaliações recentes
        displayRecentReviews();
    });

    // Função para exibir as últimas avaliações
    function displayRecentReviews() {
        reviewsContainer.innerHTML = '';
        for (let professor in ratingsData) {
            const reviews = ratingsData[professor].reviews.slice(-5).map(review => {
                return `<p><strong>Nota:</strong> ${review.rating} - ${review.comment}</p>`;
            }).join('');
            reviewsContainer.innerHTML += `<h3>Avaliações de ${professor}:</h3>${reviews || '<p>Ainda não há avaliações.</p>'}`;
        }
    }

    // Exibir avaliações recentes ao carregar a página
    displayRecentReviews();
=======
        // Atualizar as avaliações no HTML
        updateProfessorInfo(professor);
    });

    // Exibir as avaliações ao carregar a página
    Object.keys(ratingsData).forEach(professor => {
        updateProfessorInfo(professor);
    });
>>>>>>> dd20cd0 (segunda-versao)
});
