/**
 * HeraSpec View Command (Simple Implementation)
 * Displays an interactive dashboard
 */
import { ListCommand } from './list.js';

export class ViewCommand {
  async execute(targetPath: string = '.'): Promise<void> {
    const listCommand = new ListCommand();
    
    console.log('\n📊 HeraSpec Dashboard\n');
    console.log('═'.repeat(60));
    
    await listCommand.execute(targetPath, 'changes');
    await listCommand.execute(targetPath, 'specs');
  }
}

