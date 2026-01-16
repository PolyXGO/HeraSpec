/**
 * HeraSpec Helper Command
 * Displays usage guides, example prompts, and workflow instructions
 */

import chalk from 'chalk';

export class HelperCommand {
  async execute(): Promise<void> {
    console.log(chalk.cyan.bold('\n📚 HeraSpec Helper - Usage Guide\n'));
    console.log('═'.repeat(70) + '\n');

    this.showQuickStart();
    this.showCommands();
    this.showExamplePrompts();
    this.showWorkflow();
    this.showTips();

    console.log('\n' + '═'.repeat(70));
    console.log(chalk.gray('\n💡 Tip: See details at docs/README.md (available in multiple languages)\n'));
  }

  private showQuickStart(): void {
    console.log(chalk.yellow.bold('🚀 Quick Start\n'));
    console.log(chalk.white('1. Initialize a new project:'));
    console.log(chalk.gray('   cd my-project'));
    console.log(chalk.cyan('   heraspec init\n'));

    console.log(chalk.white('2. Configure project.md:'));
    console.log(chalk.gray('   Edit heraspec/project.md with your project information\n'));

    console.log(chalk.white('3. Create your first change (using AI):'));
    console.log(chalk.cyan('   "Create a HeraSpec change to add feature X"\n'));

    console.log(chalk.white('4. View list:'));
    console.log(chalk.cyan('   heraspec list\n'));

    console.log('─'.repeat(70) + '\n');
  }

  private showCommands(): void {
    console.log(chalk.yellow.bold('⚡ Main CLI Commands\n'));
    
    const commands = [
      { cmd: 'heraspec init [path]', desc: 'Initialize HeraSpec in project' },
      { cmd: 'heraspec list', desc: 'List changes (default)' },
      { cmd: 'heraspec list --specs', desc: 'List specs' },
      { cmd: 'heraspec show [name]', desc: 'Show change or spec details' },
      { cmd: 'heraspec validate [name]', desc: 'Validate change or spec' },
      { cmd: 'heraspec archive [name]', desc: 'Archive completed change' },
      { cmd: 'heraspec restore [name]', desc: 'Restore change from archive' },
      { cmd: 'heraspec skill list', desc: 'List available skills' },
      { cmd: 'heraspec skill show <name>', desc: 'Show skill details' },
      { cmd: 'heraspec make docs', desc: 'Generate product documentation' },
      { cmd: 'heraspec make docs --agent <name>', desc: 'Generate docs with AI agent' },
      { cmd: 'heraspec make test', desc: 'Generate test cases from specs' },
      { cmd: 'heraspec make test --type <type>', desc: 'Generate tests (unit/integration/e2e)' },
      { cmd: 'heraspec suggest', desc: 'Suggest new features for project' },
      { cmd: 'heraspec view', desc: 'View dashboard overview' },
      { cmd: 'heraspec helper', desc: 'Show this guide' },
    ];

    commands.forEach(({ cmd, desc }) => {
      console.log(chalk.cyan(`  ${cmd.padEnd(35)}`) + chalk.white(desc));
    });

    console.log('\n' + '─'.repeat(70) + '\n');
  }

  private showExamplePrompts(): void {
    console.log(chalk.yellow.bold('💬 Example Prompts for AI\n'));

    console.log(chalk.white.bold('1. Simple Change Creation:\n'));
    console.log(chalk.gray('   "Create a HeraSpec change to add 2FA authentication feature"\n'));
    console.log(chalk.gray('   "Create HeraSpec change for order management module"\n'));

    console.log(chalk.white.bold('2. Create Change Based on project.md:\n'));
    console.log(chalk.gray('   "Read heraspec/project.md and create HeraSpec changes for all\n'));
    console.log(chalk.gray('    features mentioned in it"\n'));
    console.log(chalk.gray('   "Based on project.md, create changes to implement by phase"\n'));

    console.log(chalk.white.bold('3. Detailed Change Creation:\n'));
    console.log(chalk.gray('   "Create HeraSpec change with the following steps:\n'));
    console.log(chalk.gray('    1. Read and analyze heraspec/project.md\n'));
    console.log(chalk.gray('    2. Identify features to build\n'));
    console.log(chalk.gray('    3. For each feature, create a separate change\n'));
    console.log(chalk.gray('    4. Each change needs proposal.md, tasks.md, specs/\n'));
    console.log(chalk.gray('    5. Follow conventions in project.md"\n'));

    console.log(chalk.white.bold('4. Prompt With Project Type and Skill:\n'));
    console.log(chalk.gray('   "Create change for WordPress plugin with skill admin-settings-page"\n'));
    console.log(chalk.gray('   "Create change for Perfex module with skill module-codebase"\n'));
    console.log(chalk.gray('   "Create UI/UX change with skill ui-ux for admin interface"\n'));

    console.log(chalk.white.bold('5. View and Validate:\n'));
    console.log(chalk.gray('   "View change add-user-auth"\n'));
    console.log(chalk.gray('   "Validate change add-user-auth --strict"\n'));
    console.log(chalk.gray('   "List all changes"\n'));

           console.log(chalk.white.bold('6. Implementation:\n'));
           console.log(chalk.gray('   "Specs approved, start implementing change add-user-auth"\n'));
           console.log(chalk.gray('   "Execute tasks in change add-user-auth"\n'));

           console.log(chalk.white.bold('7. Generate Documentation:\n'));
           console.log(chalk.gray('   "Generate product documentation from specs"\n'));
           console.log(chalk.gray('   heraspec make docs\n'));
           console.log(chalk.gray('   "Generate docs with specific AI agent"\n'));
           console.log(chalk.gray('   heraspec make docs --agent chatgpt\n'));
           console.log(chalk.gray('   heraspec make docs --agent claude\n'));

           console.log('─'.repeat(70) + '\n');
  }

  private showWorkflow(): void {
    console.log(chalk.yellow.bold('🔄 Workflow\n'));

    const steps = [
      {
        step: '1. Create Change',
        actions: [
          'AI or you create change directory',
          'Write proposal.md describing purpose',
          'Create tasks.md with task list',
          'Write delta specs in specs/',
        ],
        prompt: '"Create HeraSpec change to..."',
      },
      {
        step: '2. Refine Specs',
        actions: [
          'Review: heraspec show <name>',
          'Ask AI to edit if needed',
          'Validate: heraspec validate <name>',
        ],
        prompt: '"Edit specs in change..."',
      },
      {
        step: '3. Approval',
        actions: ['Wait for user: "Specs approved."'],
        prompt: 'You confirm: "Specs approved."',
      },
      {
        step: '4. Implementation',
        actions: [
          'AI reads tasks.md and skill.md',
          'Execute each task',
          'Mark completed: - [x]',
        ],
        prompt: '"Specs approved, implement change..."',
      },
      {
        step: '5. Archive',
        actions: [
          'Review: heraspec show <name>',
          'Archive: heraspec archive <name> --yes',
          'Specs merged into source specs',
        ],
        prompt: 'heraspec archive <name> --yes',
      },
      {
        step: '6. Generate Documentation',
        actions: [
          'Generate product docs: heraspec make docs',
          'With specific agent: heraspec make docs --agent <name>',
          'Output: documentation/product-documentation.txt',
        ],
        prompt: 'heraspec make docs --agent chatgpt',
      },
    ];

    steps.forEach(({ step, actions, prompt }) => {
      console.log(chalk.cyan.bold(`  ${step}`));
      actions.forEach((action) => {
        console.log(chalk.white(`    • ${action}`));
      });
      console.log(chalk.gray(`    💬 ${prompt}\n`));
    });

    console.log('─'.repeat(70) + '\n');
  }

  private showTips(): void {
    console.log(chalk.yellow.bold('💡 Tips & Best Practices\n'));

    const tips = [
      'Always read heraspec/project.md before creating change',
      'Use Skills system when implementing (each task has skill tag)',
      'Validate specs before requesting approval',
      'One change should focus on one specific feature',
      'Name change: kebab-case, verb-led (add-, create-, implement-)',
      'Delta specs only change in change folder',
      'Do not edit source-of-truth specs directly',
      'Archive change after completion to merge specs',
      'Use heraspec skill list to view available skills',
      'UI/UX tasks: Use search scripts in skill ui-ux',
      'Generate product docs: heraspec make docs (default agent: chatgpt)',
      'Specify AI agent: heraspec make docs --agent <name> (chatgpt, claude, etc.)',
      'Generate tests: heraspec make test (default: unit)',
      'Test types: unit (individual functions), integration (components), e2e (user flows)',
      'Generate code: heraspec make code (generates code skeletons from specs)',
      'Validate with suggestions: heraspec validate <name> (includes fix suggestions)',
      'Get feature suggestions: heraspec suggest (analyzes project and suggests enhancements)',
      'Use test skills: unit-test, integration-test, e2e-test for test implementation',
    ];

    tips.forEach((tip) => {
      console.log(chalk.white(`  • ${tip}`));
    });

    console.log('');
  }
}
