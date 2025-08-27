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
    <div
      style={{
        margin: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          padding: "3rem",
        }}
      >
        GitHub Profile Explorer
      </h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            handleSearch();
          }
        }}
        placeholder="Enter GitHub username..."
        style={{
          width: "50%",
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          borderColor: "black",
        }}
      />
      <button
        type="submit"
        onClick={handleSearch}
        style={{
          width: "20%",
          padding: "1rem",
          marginTop: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          borderColor: "black",
          backgroundColor: "teal",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        Search
      </button>

      {user && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <img
            src={user.avatar_url}
            alt="avatar"
            width={120}
            style={{ borderRadius: "50%" }}
          />

          <h2>{user.name || user.login}</h2>
          <p>{user.bio}</p>
          <p>
            Followers: {user.followers} | Following: {user.following}
          </p>
          <p>Email: {user.email || "Not public"}</p>
          <p>Company: {user.company || "Not found"}</p>
          <p>Location: {user.location || "Not found"}</p>

          <button
            onClick={() => handleUsernote()}
            style={{
              marginTop: "5px",
              padding: "8px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "teal",
              cursor: "pointer",
            }}
          >
            Add note about user
          </button>
          <br></br>
          <br></br>
          <span
            style={{
              fontSize: "20px",
              color: "teal",
              fontWeight: "bold",
            }}
          >
            Your Last Notes:{" "}
            {userNotes[user.login] ||
              localStorage.getItem(user.login) ||
              "No notes yet!"}
          </span>
        </div>
      )}

      {aiSummary && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#f0f0f0",
            padding: "1rem",
            borderRadius: "8px",
            color: "black"
          }}
        >
          <h3>AI Summary & Analysis</h3>
          <p>{aiSummary}</p>
        </div>
      )}

      {repos.length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            width: "60%",
            textAlign: "center",
            backgroundColor: "teal",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <h3>Repositories:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {repos.map((repo) => (
              <li key={repo.id} style={{ marginBottom: "1rem" }}>
                <strong>{repo.name}</strong> ⭐ {repo.stargazers_count}
                <br />
                {repo.description || "No description"}
                <br></br>
                <br></br>
                <button
                  onClick={() => handleReponote(repo)}
                  style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "black",
                  }}
                >
                  Add note about Repo
                </button>
                <br></br>
                <br></br>
                <span
                  style={{
                    marginTop: "10px",
                    color: "black",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Your last Notes:{" "}
                  {repoNotes[repo.id] ||
                    localStorage.getItem(repo.id) ||
                    "No notes yet!"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
