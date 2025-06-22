import Dexie, { type EntityTable } from 'dexie';

interface BirthDetail {
    id: number;
    name: string;
    birthDateTime: Date;
    birthPlace: string;
    latitude: number;
    longitude: number;
    session_id: string;
}

interface Message {
    id: number;
    chat_id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
} 

interface Chat {
    id: number;
    birthDetailId: number;
    timestamp: Date;
}

const db = new Dexie('FortuneTellerDB') as Dexie & {
    BirthDetails: EntityTable<BirthDetail, 'id'>;
    Messages: EntityTable<Message, 'id'>;
    Chats: EntityTable<Chat, 'id'>;
};


db.version(1).stores({
    BirthDetails: '++id, name, birthDateTime, birthPlace, latitude, longitude',
    Messages: '++id, chat_id, role, message, timestamp',
    Chats: '++id, birthDetailId, timestamp',
});

export type { BirthDetail, Message, Chat };
export { db };
