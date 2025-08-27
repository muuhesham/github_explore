"use client";

import { useState } from "react";

export default function home() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [repoNotes, setRepoNotes] = useState<{ [key: number]: string }>({});
  const [userNotes, setUserNotes] = useState<{ [key: string]: string }>({});
  const [aiSummary, setAiSummary] = useState("");

  const handleSearch = async () => {
    if (!username) return alert("Please add GitHub Username!");

    const res = await fetch(`https://api.github.com/users/${username}`);
    const json = await res.json();
    setUser(json);
    handleAISummary(json);

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const reposJson = await reposRes.json();
    setRepos(reposJson);
  };

  const handleUsernote = () => {
    const note = prompt(`Add your note on User ${user.login}`);
    if (note) {
      localStorage.setItem(`${user.login}`, note);
      setUserNotes((prev) => ({ ...prev, [user.login]: note }));
      alert("Note Saved");
    }
  };

  const handleReponote = (repo: any) => {
    const note = prompt(`Add your note on Repo : ${repo.name}`);
    if (note) {
      localStorage.setItem(`RepoID===${repo.id}`, note);
      setRepoNotes((prev) => ({ ...prev, [repo.id]: note }));
      alert("Note Saved");
    }
  };

  const handleAISummary = async (userData: any) => {
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });

      const result = await res.json();

      if (result.choices && result.choices.length > 0) {
        setAiSummary(result.choices[0].message.content);
      } else {
        setAiSummary("AI summary could not be generated.");
        console.error("No choices returned:", result);
      }
    } catch (err) {
      console.error(err);
      setAiSummary("AI summary could not be generated due to error.");
    }
  };

  return (
    <div className="container">
      <h1>GitHub Profile Explorer</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") handleSearch();
        }}
        placeholder="Enter GitHub username..."
      />
      <button type="submit" onClick={handleSearch}>
        Search
      </button>

      {user && (
        <div className="profile">
          <img src={user.avatar_url} alt="avatar" />
          <h2>{user.name || user.login}</h2>
          <p>{user.bio}</p>
          <p>
            Followers: {user.followers} | Following: {user.following}
          </p>
          <p>Email: {user.email || "Not public"}</p>
          <p>Company: {user.company || "Not found"}</p>
          <p>Location: {user.location || "Not found"}</p>

          <button onClick={() => handleUsernote()}>Add note about user</button>
          <p className="note">
            Your Last Notes:{" "}
            {userNotes[user.login] ||
              localStorage.getItem(user.login) ||
              "No notes yet!"}
          </p>
        </div>
      )}

      {aiSummary && (
        <div className="ai-summary">
          <h3>AI Summary & Analysis</h3>
          <p>{aiSummary}</p>
        </div>
      )}

      {repos.length > 0 && (
        <div className="repos">
          <h3>Repositories:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {repos.map((repo) => (
              <li key={repo.id} className="repo-item">
                <strong>{repo.name}</strong> ⭐ {repo.stargazers_count}
                <br />
                {repo.description || "No description"}
                <br />
                <button onClick={() => handleReponote(repo)}>
                  Add note about Repo
                </button>
                <p className="note">
                  Your Last Notes:{" "}
                  {repoNotes[repo.id] ||
                    localStorage.getItem(repo.id) ||
                    "No notes yet!"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
