import { core, flags, SfdxCommand } from '@salesforce/command';
import { some } from 'lodash';
import { join } from 'path';
import { type } from 'os';
import { Generator } from '../../../libs/generator';

// Convert fs.readFile into Promise version of same    

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('salesforce-to-types', 'sobject');



export default class Org extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    '$ sfdx types:sobject:create --sobject Account',
    '$ sfdx types:sobject:create --sobject MyCustomObject__c --directory types/ --targetusername myOrg@example.com'
  ];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    outputdir: {
      type: 'directory',
      char: 'o',
      description: messages.getMessage('directoryFlagDescription'),
      default: './src/types'
    },
    sobject: flags.string({
      char: 's',
      description: messages.getMessage('sobjectFlagDescription'),
      required: false
    }),
    config: flags.string({
      char: 'c',
      description: 'config file',
      required: false
    })

  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;


  public async run(): Promise<any> {
    const generator = new Generator({flags: this.flags, org: this.org, ux: this.ux });
    const {createdFiles} = await generator.generate();
    if (createdFiles.length > 0) {
      this.ux.styledHeader('Create types');
      this.ux.table(createdFiles.map(filePath => ({ file: filePath })), {
        columns: [{ key: 'file', label: 'Output file paths' }]
      });
    } else {
      this.ux.log('No types created.');
    }
    // Return an object to be displayed with --json
    return { files: createdFiles };
  }

}
