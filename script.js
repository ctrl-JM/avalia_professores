document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reviewForm");
    const reviewsContainer = document.getElementById("reviews");
    const professorSelect = document.getElementById("professor");
    const searchForm = document.getElementById("searchForm");
    const searchSelect = document.getElementById("searchProfessor");
    const professorInfo = document.getElementById("professorInfo");

    const professors = {
        "Professor A": { name: "Alessandro Sales", img: "style/assets/Alessandro-Carvalho-Sales.png", department: "Ciências Sociais" },
        "Professor B": { name: "Alessandra El Far", img: "style/assets/alessandraelfar.jpg", department: "Ciências Sociais" },
        "Professor C": { name: "Lindomar Albuquerque", img: "style/assets/professorC.jpg", department: "Ciências Sociais" },
        "Professor D": { name: "Lilian Sales", img: "style/assets/professorD.jpg", department: "Ciências Sociais" },
        "Professor E": { name: "Uirá Garcia", img: "style/assets/professorE.jpg", department: "Ciências Sociais" },
        "Professor F": { name: "Melvina", img: "style/assets/professorF.jpg", department: "Ciências Sociais" },
        "Professor G": { name: "Maria Cristina Pompa", img: "style/assets/professorG.jpg", department: "Ciências Sociais" },
        "Professor H": { name: "Ana Lúcia", img: "style/assets/professorH.jpg", department: "Ciências Sociais" }
    };

    // Função para calcular a média das avaliações de um professor
    function getAverageRating(professor) {
        return fetch(`/api/reviews?professor=${professor}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
                    const average = (totalRating / data.length).toFixed(2);
                    return average;
                }
                return "N/A";
            });
    }

    // Função para obter as últimas avaliações de um professor
    function getLastReviews(professor) {
        return fetch(`/api/reviews?professor=${professor}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    return data.slice(-5).map(review => `<p><strong>Nota:</strong> ${review.rating} - ${review.comment}</p>`).join("");
                }
                return "<p>Ainda não há avaliações.</p>";
            });
    }

    // Função para atualizar as informações de um professor na tela
    function updateProfessorInfo(professor) {
        if (!professors[professor]) return;
        const { name, img, department } = professors[professor];

        // Chama as funções de média e últimas avaliações
        Promise.all([getAverageRating(professor), getLastReviews(professor)])
            .then(([avgRating, lastReviews]) => {
                professorInfo.innerHTML = `
                    <div class="professor-card">
                        <img src="${img}" alt="${name}">
                        <h3>${name}</h3>
                        <p>Departamento: ${department}</p>
                        <p>Média Atual: ${avgRating}</p>
                        <h4>Últimas Avaliações:</h4>
                        ${lastReviews}
                    </div>
                `;
            });
    }

    // Função para atualizar o card do professor com as avaliações mais recentes
    function updateProfessorCard(professor) {
        const professorCard = document.getElementById(professor);
        if (professorCard) {
            // Chama as funções de média e últimas avaliações
            Promise.all([getAverageRating(professor), getLastReviews(professor)])
                .then(([avgRating, lastReviews]) => {
                    professorCard.querySelector(".avg-rating .rating").innerText = avgRating;
                    professorCard.querySelector(".reviews").innerHTML = lastReviews;
                });
        }
    }

    // Função para exibir as últimas avaliações no container principal
    function displayRecentReviews() {
        reviewsContainer.innerHTML = '';
        for (let professor in professors) {
            // Chama a API para buscar as últimas avaliações
            fetch(`/api/reviews?professor=${professor}`)
                .then(response => response.json())
                .then(data => {
                    const reviews = data.slice(-5).map(review => `<p><strong>Nota:</strong> ${review.rating} - ${review.comment}</p>`).join("");
                    reviewsContainer.innerHTML += `<h3>Avaliações de ${professors[professor]?.name || professor}:</h3>${reviews}`;
                });
        }
    }

    // Função para enviar uma avaliação para a API
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const professor = professorSelect.value;
        const rating = parseFloat(document.getElementById("rating").value);
        const comment = document.getElementById("comment").value.trim();

        if (!professor || isNaN(rating) || rating < 1 || rating > 5 || !comment) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        // Envia a avaliação para a API (POST)
        fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ professor, rating, comment })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                alert("Avaliação enviada com sucesso!");
                form.reset();
                updateProfessorCard(professor);
                displayRecentReviews();
            } else {
                alert("Erro ao enviar a avaliação.");
            }
        })
        .catch(error => {
            alert("Erro ao enviar a avaliação.");
            console.error(error);
        });
    });

    // Função para preencher as opções dos selects (para pesquisa e envio de avaliação)
    function populateSelects() {
        searchSelect.innerHTML = professorSelect.innerHTML = Object.keys(professors).map(id =>
            `<option value="${id}">${professors[id].name}</option>`
        ).join("");
    }

    // Chama as funções de inicialização
    populateSelects();
    displayRecentReviews();

    // Função de busca de professor ao enviar o formulário de pesquisa
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        updateProfessorInfo(searchSelect.value);
    });
});
