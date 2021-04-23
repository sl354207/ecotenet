import { CellPlugin } from '@react-page/editor';

import React from 'react';

import TestComponent from '../components/TestComponent';

import ImageUploadField from '../components/ImageUploadField'

// use a type here, not an interface. Set types for data for typescript.
type Data = {
  title: string,
  imageUrl: string,
  description: string
}

// plugin takes in Data/data input into plugin fields.
const testPlugin: CellPlugin<Data> = {
   // the Renderer displays the output of the plugin.
  Renderer: ({ data }) => (
    // pass data down from plugin to TestComponent prop
    <TestComponent data={data} />
  ),
  // set fields for plugin UI
  id: 'testPlugin',
  title: 'Image',
  description: 'Upload image from local file or external url',
  version: 1,
  // controls set the functionality and formatting of the plugin
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
          // pass in ImageUploadField component to perform functionality
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