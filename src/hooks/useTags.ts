import { useState, useEffect } from 'react';
import { getTags, insertTag } from '../database/db';

export const useTags = () => {
    const [tags, setTags] = useState<{id: number; name: string}[]>([]);

    useEffect(() => {
        loadTags();
      }, []);

    const loadTags = async () => {
        try {
            const result = await getTags();
            setTags(result);
        } catch (error) {
            console.error('Failed to get tags: ', error);
        } 
    };

    const addTag = async (name: string) => {
        try {
            await insertTag(name);

        } catch(error) {
            console.error('Error adding tags: ', error);
        }
    };


    return { tags, addTag, loadTags };
};