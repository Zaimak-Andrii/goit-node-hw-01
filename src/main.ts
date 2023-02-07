import { Command } from 'commander';
import { addContact, getContactById, listContacts, removeContact } from './contacts';
import 'colors';

const program = new Command();
program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

type InvokeType = {
  action?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

function invokeAction({ action, id, name, email, phone }: InvokeType): void {
  switch (action) {
    case 'list':
      listContacts();
      break;

    case 'get':
      if (!id) {
        console.warn('Unknown id value.'.red);
        break;
      }

      getContactById(id);
      break;

    case 'add':
      const errors = [];
      if (!name) errors.push('name');
      if (!email) errors.push('email');
      if (!phone) errors.push('phone');

      if (errors.length) {
        console.warn(`Unknown fields (${errors.join(', ')})`.red);
        break;
      }
      addContact(name!, email!, phone!);
      break;

    case 'remove':
      if (!id) {
        console.warn('Unknown id value.'.red);
        break;
      }
      removeContact(id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
