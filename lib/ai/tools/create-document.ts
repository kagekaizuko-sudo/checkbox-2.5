import { generateUUID } from '@/lib/utils';
import { DataStreamWriter, tool } from 'ai';
import { z } from 'zod';
import { Session } from 'next-auth';
import {
  artifactKinds,
  documentHandlersByArtifactKind,
} from '@/lib/artifacts/server';

interface CreateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const createDocument = ({ session, dataStream }: CreateDocumentProps) =>
  tool({
    description:
      'Create a document for writing or content creation activities. Specify the title and document type.',
    parameters: z.object({
      title: z.string().min(1).describe('The title of the document'),
      kind: z.enum(artifactKinds).describe('The type of document to create'),
    }),
    execute: async ({ title, kind }) => {
      try {
        const id = generateUUID();

        // Validate inputs
        if (!title.trim()) {
          throw new Error('Title cannot be empty');
        }

        if (!artifactKinds.includes(kind)) {
          throw new Error(`Invalid document kind: ${kind}`);
        }

        dataStream.writeData({
          type: 'kind',
          content: kind,
        });

        dataStream.writeData({
          type: 'id',
          content: id,
        });

        dataStream.writeData({
          type: 'title',
          content: title.trim(),
        });

        dataStream.writeData({
          type: 'clear',
          content: '',
        });

        const documentHandler = documentHandlersByArtifactKind.find(
          (documentHandlerByArtifactKind) =>
            documentHandlerByArtifactKind.kind === kind,
        );

        if (!documentHandler) {
          throw new Error(`No document handler found for kind: ${kind}`);
        }

        await documentHandler.onCreateDocument({
          id,
          title: title.trim(),
          dataStream,
          session,
        });

        dataStream.writeData({ type: 'finish', content: '' });

        return {
          id,
          title: title.trim(),
          kind,
          content: 'Document created successfully and is now visible to the user.',
        };
      } catch (error) {
        console.error('Error creating document:', error);
        
        dataStream.writeData({ 
          type: 'error', 
          content: 'Failed to create document. Please try again.' 
        });

        return {
          error: error instanceof Error ? error.message : 'Failed to create document',
        };
      }
    },
  });
