document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Inspiration" },
        // Add more quotes as needed
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const categoryFilter = document.getElementById('categoryFilter');

    newQuoteButton.addEventListener('click', showRandomQuote);

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = quotes[randomIndex].text;
        quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><strong>Category:</strong> ${randomQuote.category}</p>`;
    }

    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
        // Display the filtered quotes as needed
    }

    function createAddQuoteForm() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            const newQuote = { text: newQuoteText, category: newQuoteCategory };
            quotes.push(newQuote);
            populateCategories();
            saveToLocalStorage();
            // Optionally, clear the input fields
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        localStorage.setItem('lastSelectedCategory', categoryFilter.value);
    }

    function loadFromLocalStorage() {
        const storedQuotes = JSON.parse(localStorage.getItem('quotes'));
        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');

        if (storedQuotes) {
            quotes.length = 0;
            quotes.push(...storedQuotes);
        }

        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
            filterQuotes();
        }
    }

    loadFromLocalStorage();
    populateCategories();
    filterQuotes();
});
