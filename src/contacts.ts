import fs from 'fs/promises';
import path from 'path';
import * as colors from 'colors';
import crypto from 'crypto';
import { ContactsType } from 'types/contacts';

const contactsPath = path.resolve(__dirname, 'db', 'contacts.json');

export async function listContacts(): Promise<ContactsType[]> {
  try {
    const file = await fs.readFile(contactsPath, 'utf8');
    const contacts: ContactsType[] = JSON.parse(file);

    // console.log('Contacts list: '.yellow);
    // console.log(contacts);

    return contacts;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(errorMessage.red);

    return [];
  }
}

export async function getContactById(contactId: string): Promise<ContactsType | void> {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === contactId);

    if (!contact) throw new Error('Contact not found.');

    console.log('Contact: '.yellow);
    console.log(contact);

    return contact;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(errorMessage.red);
  }
}

export async function removeContact(contactId: string): Promise<void> {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter((c) => c.id !== contactId);

    await fs.writeFile(contactsPath, JSON.stringify(newContacts), 'utf8');

    console.log('Contact removed success: '.yellow);
    console.log(newContacts);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(colors.red(errorMessage));
  }
}

export async function addContact(name: string, email: string, phone: string): Promise<ContactsType | undefined> {
  try {
    const contacts = await listContacts();
    const oldContact = contacts.find((c) => c.name.toLowerCase() === name.toLowerCase());

    if (oldContact) throw new Error(`Contact with name "${name}" already exist.`);

    const newContact: ContactsType = { id: crypto.randomUUID(), name, email, phone };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts), 'utf8');

    console.log('Contact added success: '.yellow);
    console.log(newContact);

    return newContact;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(colors.red(errorMessage));
    return;
  }
}
