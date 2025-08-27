import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userData } = await req.json();
    
    const summaryText = `
      User ${userData.login} has ${userData.public_repos} public repositories.
      Followers: ${userData.followers}, Following: ${userData.following}.
      Bio: ${userData.bio || "N/A"}.
      
      Analysis: This user seems active on GitHub and has a decent number of repositories.
    `;

    return NextResponse.json({
      choices: [{ message: { content: summaryText } }],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get AI summary" },
      { status: 500 }
    );
  }
}
