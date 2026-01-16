/**
 * HeraSpec CLI Entry Point
 */
import { Command } from 'commander';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { InitCommand } from '../core/init.js';
import { ListCommand } from '../core/list.js';
import { ArchiveCommand } from '../core/archive.js';
import { RestoreCommand } from '../core/restore.js';
import { ShowCommand } from '../commands/show.js';
import { ValidateCommand } from '../commands/validate.js';
import { SkillCommand } from '../commands/skill.js';
import { HelperCommand } from '../commands/helper.js';
import { MakeDocsCommand } from '../commands/make-docs.js';
import { MakeTestCommand } from '../commands/make-test.js';
import { MakeCodeCommand } from '../commands/make-code.js';

const require = createRequire(import.meta.url);

// Get package.json path relative to the built file location
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');
const { version } = require(packageJsonPath);

const program = new Command();

program
  .name('heraspec')
  .description('Universal spec-first development framework + CLI')
  .version(version);

program
  .command('init [path]')
  .description('Initialize HeraSpec in your project')
  .action(async (targetPath = '.') => {
    try {
      const initCommand = new InitCommand();
      await initCommand.execute(targetPath);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List items (changes by default). Use --specs to list specs.')
  .option('--specs', 'List specs instead of changes')
  .option('--changes', 'List changes explicitly (default)')
  .action(async (options?: { specs?: boolean; changes?: boolean }) => {
    try {
      const listCommand = new ListCommand();
      const mode: 'changes' | 'specs' = options?.specs ? 'specs' : 'changes';
      await listCommand.execute('.', mode);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('show [item-name]')
  .description('Show a change or spec')
  .action(async (itemName?: string) => {
    try {
      const showCommand = new ShowCommand();
      await showCommand.execute(itemName);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('validate [item-name]')
  .description('Validate a change or spec')
  .option('--strict', 'Enable strict validation mode')
  .action(async (itemName?: string, options?: { strict?: boolean }) => {
    try {
      const validateCommand = new ValidateCommand();
      await validateCommand.execute(itemName, options);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('archive [change-name]')
  .description('Archive a completed change and update main specs')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (changeName?: string, options?: { yes?: boolean }) => {
    try {
      const archiveCommand = new ArchiveCommand();
      await archiveCommand.execute(changeName, options);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('restore [archive-name]')
  .description('Restore an archived change back to active changes')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (archiveName?: string, options?: { yes?: boolean }) => {
    try {
      const restoreCommand = new RestoreCommand();
      await restoreCommand.execute(archiveName, options);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('view')
  .description('Display an interactive dashboard of specs and changes')
  .action(async () => {
    try {
      const listCommand = new ListCommand();
      console.log('\n📊 HeraSpec Dashboard\n');
      console.log('═'.repeat(60));
      await listCommand.execute('.', 'changes');
      await listCommand.execute('.', 'specs');
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('helper')
  .description('Show usage guide, example prompts, and workflow instructions')
  .action(async () => {
    try {
      const helperCommand = new HelperCommand();
      await helperCommand.execute();
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Make commands
const makeCmd = program
  .command('make')
  .description('Generate project artifacts');

makeCmd
  .command('docs')
  .description('Generate project documentation from specs')
  .option('--agent <agent>', 'Specify AI agent for documentation (default: chatgpt)', 'chatgpt')
  .action(async (options?: { agent?: string }) => {
    try {
      const makeDocsCommand = new MakeDocsCommand();
      await makeDocsCommand.execute('.', options?.agent || 'chatgpt');
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

makeCmd
  .command('test')
  .description('Generate test cases from specs')
  .option('--type <type>', 'Test type: unit, integration, e2e (default: unit)', 'unit')
  .action(async (options?: { type?: string }) => {
    try {
      const makeTestCommand = new MakeTestCommand();
      await makeTestCommand.execute('.', options?.type || 'unit');
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

makeCmd
  .command('code')
  .description('Generate code skeletons from specs')
  .argument('[spec-name]', 'Specific spec to generate code for (optional)')
  .action(async (specName?: string) => {
    try {
      const makeCodeCommand = new MakeCodeCommand();
      await makeCodeCommand.execute('.', specName);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('suggest')
  .description('Analyze project and suggest new features')
  .action(async () => {
    try {
      const suggestCommand = new SuggestCommand();
      await suggestCommand.execute('.');
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Skill commands
const skillCmd = program
  .command('skill')
  .description('Manage and view skills');

skillCmd
  .command('list')
  .description('List all available skills')
  .action(async () => {
    try {
      const skillCommand = new SkillCommand();
      await skillCommand.list('.');
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

skillCmd
  .command('show <skill-name>')
  .description('Show detailed information about a skill')
  .option('--project-type <type>', 'Specify project type for project-specific skills')
  .action(async (skillName: string, options?: { projectType?: string }) => {
    try {
      const skillCommand = new SkillCommand();
      await skillCommand.show(skillName, options?.projectType, '.');
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

skillCmd
  .command('repair')
  .description('Repair skills structure to match HeraSpec standards')
  .action(async () => {
    try {
      const skillCommand = new SkillCommand();
      await skillCommand.repair('.');
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

skillCmd
  .command('add <skill-name>')
  .description('Add a default skill to the project from HeraSpec templates')
  .option('--project-type <type>', 'Specify project type for project-specific skills')
  .action(async (skillName: string, options?: { projectType?: string }) => {
    try {
      const skillCommand = new SkillCommand();
      await skillCommand.add(skillName, options?.projectType, '.');
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();

