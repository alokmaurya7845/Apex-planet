<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Joke Fetcher</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .joke-box {
      max-width: 600px;
      margin: 2rem auto;
      font-size: 1.2rem;
      background: #fff3cd;
      padding: 1.5rem;
      border-radius: 10px;
    }

    button {
      margin-top: 1rem;
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Random Joke Generator</h1>
    <div class="joke-box" id="joke">Click the button to load a joke!</div>
    <button onclick="getJoke()">Tell me a joke</button><br><br>
    <button onclick="location.href='index.html'">Back to Home</button>
  </div>

  <script src="confetti.js"></script>
  <script>
    async function getJoke() {
      const res = await fetch('https://official-joke-api.appspot.com/random_joke');
      const data = await res.json();
      document.getElementById('joke').innerText = `${data.setup} — ${data.punchline}`;
      confetti();
    }
  </script>
</body>
</html>
