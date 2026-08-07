import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "../config/index.js";
import { connectMongo, disconnectMongo } from "../utils/mongo.js";
import { Project } from "../models/Project.js";
import { Phase } from "../models/Phase.js";
import { Item } from "../models/Item.js";
import { parseWorkbook } from "../utils/workbookParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function importWorkbook(): Promise<void> {
  try {
    await connectMongo();

    const workbookPath = join(__dirname, "..", "..", config.sourceWorkbookPath);
    console.info(`Reading workbook from: ${workbookPath}`);

    const buffer = readFileSync(workbookPath);
    const parsedPhases = parseWorkbook(buffer);

    console.info(`Parsed ${parsedPhases.length} phases`);

    // Upsert project
    const project = await Project.findOneAndUpdate(
      { code: "SAINIK" },
      {
        name: "Sainik School Project",
        code: "SAINIK",
        description: "Sainik School construction project tracker",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.info(`Project: ${project.name} (${project._id})`);

    // Create phases and their items
    for (const parsedPhase of parsedPhases) {
      const phase = await Phase.findOneAndUpdate(
        { projectId: project._id, code: parsedPhase.code },
        {
          projectId: project._id,
          name: parsedPhase.name,
          code: parsedPhase.code,
          order: parsedPhase.order,
          description: `Items from ${parsedPhase.name}`,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      console.info(`  Phase: ${phase.name} (${phase._id})`);

      console.info(`    Adding ${parsedPhase.items.length} items`);
      for (const parsedItem of parsedPhase.items) {
        await Item.findOneAndUpdate(
          { projectId: project._id, phaseId: phase._id, code: parsedItem.code },
          {
            projectId: project._id,
            phaseId: phase._id,
            ...parsedItem,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      }
    }

    console.info("Workbook import completed successfully");
  } catch (error) {
    console.error("Workbook import failed:", error);
    throw error;
  } finally {
    await disconnectMongo();
  }
}

void importWorkbook();
