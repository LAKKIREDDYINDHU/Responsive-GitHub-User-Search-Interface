import { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const fetchUserData = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Please enter a username.');
      setUserData(null);
      setRepos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userUrl = `https://api.github.com/users/${trimmedUsername}`;
      console.log('Fetching:', userUrl);

      const userResponse = await fetch(userUrl);
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || 'User not found');
      }
      const userData = await userResponse.json();
      setUserData(userData);

      const reposUrl = userData.repos_url + '?sort=stars&per_page=5';
      console.log('Fetching:', reposUrl);

      const reposResponse = await fetch(reposUrl);
      if (!reposResponse.ok) {
        const errorData = await reposResponse.json();
        throw new Error(errorData.message || 'Failed to fetch repositories');
      }
      const reposData = await reposResponse.json();
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUserData();
  };

  const handleClear = () => {
    setUsername('');
    setUserData(null);
    setRepos([]);
    setError(null);
    setLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header>
        <h1>GitHub User Search</h1>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            disabled={loading && !username}
            style={{ marginLeft: '8px' }}
          >
            Clear
          </button>
        </form>

        {loading && <div className="loading">Loading...</div>}

        {error && (
          <div className="error">
            Error: {error}
            <br />
            Please try another username.
          </div>
        )}

        {userData && (
          <div className="profile-container">
            <div className="profile-header">
              <img src={userData.avatar_url} alt="User avatar" className="avatar" />
              <div className="profile-info">
                <h2>{userData.name || userData.login}</h2>
                <p>{userData.bio}</p>
                <div className="profile-stats">
                  <span>Followers: {userData.followers}</span>
                  <span>Following: {userData.following}</span>
                  <span>Repos: {userData.public_repos}</span>
                </div>
                {userData.location && <p>📍 {userData.location}</p>}
                {userData.blog && (
                  <p>
                    🌐{' '}
                    <a href={userData.blog} target="_blank" rel="noopener noreferrer">
                      {userData.blog}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <h3>Top 5 Repositories (by stars)</h3>
            <div className="repos-grid">
              {repos.map((repo) => (
                <div key={repo.id} className="repo-card">
                  <h4>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </h4>
                  <p>{repo.description || 'No description provided'}</p>
                  <div className="repo-stats">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks_count}</span>
                    {repo.language && <span>🔹 {repo.language}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>GitHub User Search App - Built with React - By Indhu</p>
      </footer>
    </div>
  );
}

export default App;