import ImageCaption from '@components/imagePlugin/ImageCaption';
import ImageCitation from '@components/imagePlugin/ImageCitation';
import ImageDescription from '@components/imagePlugin/ImageDescription';
import ImageHeight from '@components/imagePlugin/ImageHeight';
import ImageRender from '@components/imagePlugin/ImageRender';
import ImageUploadField from '@components/imagePlugin/ImageUploadField';
import ImageWidth from '@components/imagePlugin/ImageWidth';
import { CellPlugin, lazyLoad } from '@react-page/editor';

const Panorama = lazyLoad(() => import('@mui/icons-material/Panorama'));





// use a type here, not an interface. Set types for data for typescript.
type Data = {
  caption: string,
  image: {url: string, saved: boolean, file: object}
  description: string, 
  citation: string,
  width: number,
  height: number
  
}


// plugin takes in Data/data input into plugin fields.
const customImage: CellPlugin<Data> = {
  createInitialData: () => ({
    caption: undefined,
    image: {url: undefined, saved: false, file: {}},
    description: undefined,
    citation: undefined,
    width: undefined,
    height: undefined
  }),
  
   // the Renderer displays the output of the plugin.
  Renderer: ({ data, isPreviewMode }) => (
    // pass data down from plugin to ImageRender prop
    <ImageRender data={data} preview={isPreviewMode} />
  ),
  // set fields for plugin UI
  id: 'customImage',
  title: 'Image',
  description: 'Upload image from local file or external url',
  version: 1,
  icon: <Panorama />,

  // Provider: (props) => (
  //   <ImageProvider props={props}/>
  // ),
  // controls set the functionality and formatting of the plugin
  controls: [{
    title: 'Upload',
    controls: {
      type: 'autoform',
      columnCount: 1,
      schema: {
        properties: {
          image: {
            type: 'object',
            properties: {
              url: {
                type: 'string'
              },
              saved: {
                type: 'boolean'
              },
              
            },
            // pass in ImageUploadField component to perform functionality
            uniforms: { component: ImageUploadField  },
            
          },
          width: {
            type: 'number',
            // default: 'someDefaultValue',
            uniforms: {
              component: ImageWidth
            }
          },
          height: {
            type: 'number',
            uniforms: {
              component: ImageHeight
              
            },
            // default: 'someDefaultValue',
          },
          
        },
        // required: ['title'],
      },
    },
  },{
    title: 'Details',
    controls: {
      type: 'autoform',
      columnCount: 1,
      schema: {
        properties: {
          
          caption: {
            type: 'string',
            // default: 'someDefaultValue',
            uniforms: {
              component: ImageCaption
            }
          },
          citation: {
            type: 'string',
            uniforms: {
              component: ImageCitation
              
            },
            // default: 'someDefaultValue',
          },
          
          description: {
            type: 'string',
            uniforms: {
              component: ImageDescription
              // label: 'Alternate Description',
              
              // multiline: true,
              // rows: 4,
            },
          },
        },
        // required: ['title'],
      },
    },
    
}]
};

export default customImage;