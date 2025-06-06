import inquirer from "inquirer";
import { MTConf } from "../src-types/monitext.types";

interface prompt {
    name: keyof MTConf
}

interface promptBody {
    message: string,
    type: "input" | "list" | "confirm"
    default?: (number | string | boolean)
    choices?: (number | string | boolean)[]
}

function mkPrompt(name: keyof MTConf, param: promptBody) {
    const result = { name, ...param }
    return result as prompt & promptBody
}

function mkSimplePrompt(name: string, param: promptBody) {
    const result = { name, ...param }
    return result as prompt & promptBody
}

export async function inquireMonitextRuntime() {

    const answers = await (inquirer.prompt as any)([
        mkSimplePrompt("flavor", {
            message: "What flavor of monitext do need wish for ?",
            type: "list",
            choices: [".ts", ".js", ".cjs"]
        }),
        mkPrompt("project_name", {
            message: "What is your project name?",
            type: "input",
        }),
        mkPrompt("apiKey", {
            message: "Enter your API key (or leave blank to input it later):",
            type: "input",
            default: "",
        }),
        mkPrompt("env", {
            message: "In which environment are you running Monitext?",
            type: "list",
            choices: ["server", "browser", "node"],
        }),
        mkPrompt("devMode", {
            message: "Activate Dev Mode (logs won't be sent to API)?",
            type: "confirm",
            default: false,
        }),
        mkPrompt("silent", {
            message: "Silence specific log levels? (comma separated, e.g. info,success,error)",
            type: "input",
            default: "",
        })
    ])

    if (typeof answers.silent === "string") {
        answers.silent = answers.silent
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);
    }

    return answers
}

