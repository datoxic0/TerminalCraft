import { GoogleGenAI } from "@google/genai";
import { ScriptLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function simulateScript(code: string, language: ScriptLanguage) {
  const systemInstruction = `
    You are a Windows Scripting Simulator. 
    The user will provide a ${language === 'batch' ? 'Batch (.bat)' : 'PowerShell (.ps1)'} script.
    Your task is to:
    1. Analyze the script for syntax errors.
    2. "Run" the script in a virtual Windows environment.
    3. Output EXACTLY what would appear in a standard Windows Command Prompt (for batch) or PowerShell Terminal (for powershell).
    4. If the script contains harmful commands (like deleting C:\\Windows), refuse to "run" it and explain the danger.
    5. If the script uses commands that require specific infrastructure (like Active Directory), simulate a plausible success or common failure based on a "default" environment.
    6. Include common terminal artifacts like current path (e.g., C:\\Users\\Admin> for CMD).
    7. After the terminal output, provide a brief "Insight" section explaining what the script did and any potential improvements or professional tips.
    
    Format your response as:
    [TERMINAL_START]
    (Terminal output here)
    [TERMINAL_END]
    
    [INSIGHT_START]
    (Brief explanation and tips here)
    [INSIGHT_END]

    [VARIABLES_START]
    (List any detected variables and their values here, e.g. %name%=User)
    [VARIABLES_END]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: code,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    return response.text || "Simulation failed to generate output.";
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return "Error: Could not simulate script. Please check your API key.";
  }
}

export async function explainCode(code: string, language: string) {
    const systemInstruction = `
    You are a technical mentor for Windows scripting.
    The user will provide a ${language} script.
    Explain what each line does in simple terms suitable for a beginner.
    Highlight best practices and security considerations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: code,
      config: {
        systemInstruction,
      },
    });

    return response.text || "Failed to generate explanation.";
  } catch (error) {
    return "Error: Could not generate explanation.";
  }
}

export async function auditScript(code: string, language: ScriptLanguage) {
  const systemInstruction = `
    You are a Windows Security Auditor.
    Analyze the provided ${language} script for:
    1. Security vulnerabilities (command injection, path issues).
    2. Side effects (deleting system files, modifying registry without warning).
    3. Performance bottlenecks.
    4. Best practice violations.
    
    Output a concise bullet-point list of findings. If the script is safe, say "No critical vulnerabilities found."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: code,
      config: {
        systemInstruction,
      },
    });

    return response.text?.trim() || "Audit failed.";
  } catch (error) {
    return "Error performing security audit.";
  }
}

export async function generateScript(prompt: string, language: ScriptLanguage) {
  const systemInstruction = `
    You are an expert Windows Scripting Architect.
    The user wants to create a ${language === 'batch' ? 'Batch (.bat)' : 'PowerShell (.ps1)'} script.
    USER PROMPT: "${prompt}"
    
    Requirements:
    1. Provide ONLY the functional code.
    2. Professional structure with headers and comments.
    3. Include best practices (input validation, error checks).
    4. Keep it efficient and modern.
    
    Output format:
    Just the code, no markdown code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Generation Error:", error);
    return "Error generating script.";
  }
}
