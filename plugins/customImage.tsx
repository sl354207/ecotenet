import ImageCaption from '@components/editorPlugins/ImageCaption';
import ImageCitation from '@components/editorPlugins/ImageCitation';
import ImageDescription from '@components/editorPlugins/ImageDescription';
import ImageHeight from '@components/editorPlugins/ImageHeight';
import ImageRender from '@components/editorPlugins/ImageRender';
import ImageUploadField from '@components/editorPlugins/ImageUploadField';
import ImageWidth from '@components/editorPlugins/ImageWidth';
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
  isInlineable: true,
  
   // the Renderer displays the output of the plugin.
  Renderer: ({ data, isPreviewMode }) => (
    // pass data down from plugin to ImageRender prop
    <ImageRender data={data} preview={isPreviewMode} />
  ),
  // set fields for plugin UI
  id: 'customImage',
  title: 'Image',
  description: 'Upload an image from a local file or an external url.',
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
            uniforms: {
              component: ImageWidth
            }
          },
          height: {
            type: 'number',
            uniforms: {
              component: ImageHeight
            },
          },
        },
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
            uniforms: {
              component: ImageCaption
            }
          },
          citation: {
            type: 'string',
            uniforms: {
              component: ImageCitation
            },
          },
          description: {
            type: 'string',
            uniforms: {
              component: ImageDescription
            },
          },
        },
        // required: ['citation'],
      },
    },
}]
};

export default customImage;