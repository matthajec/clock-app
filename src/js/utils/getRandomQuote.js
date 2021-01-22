let quotes;

// fetches and stores api data in quotes if it's not already saved, and then returns a random quote
export default async () => {
  if (!quotes) {
    const res = await fetch("https://type.fit/api/quotes");
    const data = await res.json();
    quotes = data;
  }

  return quotes[Math.floor(Math.random() * quotes.length)];
};