"use client";

import { useState } from "react";

export default function compare() {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [data, setData] = useState<any>(null);

  const handleCompare = async () => {
    if (!user1 || !user2) return alert("Usernames is required!");
    if (user1 == user2) return alert("Enter different two usernames!");

    const [res1, res2] = await Promise.all([
      fetch(`https://api.github.com/users/${user1}`),
      fetch(`https://api.github.com/users/${user2}`),
    ]);
    const [userData1, userData2] = await Promise.all([
      res1.json(),
      res2.json(),
    ]);

    const [reposRes1, reposRes2] = await Promise.all([
      fetch(`https://api.github.com/users/${user1}/repos`),
      fetch(`https://api.github.com/users/${user2}/repos`),
    ]);

    const [repos1, repos2] = await Promise.all([
      reposRes1.json(),
      reposRes2.json(),
    ]);

    const metrics1 = {
      reposCount: repos1.length,
      totalStars: repos1.reduce(
        (sum: number, repo: any) => sum + repo.stargazers_count,
        0
      ),
      followers: userData1.followers,
      following: userData1.following,
    };

    const metrics2 = {
      reposCount: repos2.length,
      totalStars: repos2.reduce(
        (sum: number, repo: any) => sum + repo.stargazers_count,
        0
      ),
      followers: userData2.followers,
      following: userData2.following,
    };

    setData({ userData1, userData2, metrics1, metrics2 });
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
        Compare Two GitHub Users
      </h1>
      <input
        type="text"
        placeholder="Enter First GitHub Username..."
        value={user1}
        onChange={(e) => setUser1(e.target.value)}
        style={{
          width: "50%",
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          borderColor: "black",
        }}
      />
      <input
        type="text"
        placeholder="Enter Second GitHub Username..."
        value={user2}
        onChange={(e) => setUser2(e.target.value)}
        style={{
          width: "50%",
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          borderColor: "black",
          marginTop: "5px",
        }}
      />
      <button
        type="submit"
        onClick={handleCompare}
        style={{
          width: "20%",
          padding: "1rem",
          marginTop: "40px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          borderColor: "black",
          backgroundColor: "teal",
          cursor: "pointer",
        }}
      >
        Compare
      </button>

      {data && (
        <table
          border={1}
          cellPadding={24}
          style={{
            margin: "auto",
            marginTop: "40px",
            width: "80%",
            height: "20vh",
            fontSize: "1.2rem",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "16px" }}>Metrics</th>
              <th>{data.userData1.login}</th>
              <th>{data.userData2.login}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Repositories</td>
              <td>{data.metrics1.reposCount}</td>
              <td>{data.metrics2.reposCount}</td>
            </tr>
            <tr>
              <td>Total Stars</td>
              <td>{data.metrics1.totalStars}</td>
              <td>{data.metrics2.totalStars}</td>
            </tr>
            <tr>
              <td>Followers</td>
              <td>{data.metrics1.followers}</td>
              <td>{data.metrics2.followers}</td>
            </tr>
            <tr>
              <td>Following</td>
              <td>{data.metrics1.following}</td>
              <td>{data.metrics2.following}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
