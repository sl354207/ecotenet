import { CellPlugin } from '@react-page/editor';

import React from 'react';

import TestComponent from '../components/TestComponent';

import ImageUploadField from '../components/ImageUploadField'

// use a type here, not an interface
type Data = {
  title: string,
  imageUrl: string,
  description: string
}

const testPlugin: CellPlugin<Data> = {
  Renderer: ({ data }) => (
    <TestComponent data={data} />
  ),
  id: 'testPlugin',
  title: 'Image',
  description: 'Upload image from local file or external url',
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        title: {
          type: 'string',
          default: 'someDefaultValue',
        },
        imageUrl: {
          type: 'string',
          uniforms: { component: ImageUploadField },
        },
        description: {
          type: 'string',
          uniforms: {
            multiline: true,
            rows: 4,
          },
        },
      },
      required: ['title'],
    },
  },
};

export default testPlugin;