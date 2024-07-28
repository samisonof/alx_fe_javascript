document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Inspiration" },
        // Add more quotes as needed
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const categoryFilter = document.getElementById('categoryFilter');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const syncQuotesButton = document.getElementById('syncQuotes');

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

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
          const importedQuotes = JSON.parse(event.target.result);
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
      }
    

    function exportQuotes() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'quotes.json';
        link.click();
    }


    const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

    // Function to simulate fetching quotes from the server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(serverUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            });
            const data = await response.json();
            return data.slice(0, 5).map(post => ({ text: post.title, category: 'Server' })); // Mocking quote format
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
            return [];
        }
    }
    
    // Function to simulate posting new quotes to the server
    async function postQuoteToServer(quote) {
        try {
            const response = await fetch(serverUrl, {
                method: 'POST',
                body: JSON.stringify(quote),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error posting quote to server:', error);
            return null;
        }
    }
    
    // Function to periodically sync data
    async function syncData() {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    
        // Merge server quotes with local quotes (simple conflict resolution: server's data takes precedence)
        const mergedQuotes = [...localQuotes, ...serverQuotes.filter(sq => !localQuotes.some(lq => lq.text === sq.text))];
    
        // Save merged quotes to local storage
        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
        loadFromLocalStorage();
    }
    
    // Periodically sync data every 5 minutes
    setInterval(syncData, 300000);
    
    // Example usage of posting a new quote
    const newQuote = { text: "This is a new quote", category: "Inspiration" };
    postQuoteToServer(newQuote).then(data => {
        if (data) {
            console.log('Quote posted successfully:', data);
        }
    });
    
// Run tests
testSyncFunctionality();
testConflictResolution();



    loadFromLocalStorage();
    populateCategories();
    filterQuotes();
});
