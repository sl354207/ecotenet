import ImageCaption from '@components/imagePlugin/ImageCaption';
import ImageCitation from '@components/imagePlugin/ImageCitation';
import ImageDescription from '@components/imagePlugin/ImageDescription';
import ImageRender from '@components/imagePlugin/ImageRender';
import ImageUploadField from '@components/imagePlugin/ImageUploadField';
import { CellPlugin, lazyLoad } from '@react-page/editor';

const Panorama = lazyLoad(() => import('@mui/icons-material/Panorama'));





// use a type here, not an interface. Set types for data for typescript.
type Data = {
  caption: string,
  imageUrl: string,
  description: string, 
  citation: string
}

// plugin takes in Data/data input into plugin fields.
const customImage: CellPlugin<Data> = {
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
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        imageUrl: {
          type: 'string',
          // pass in ImageUploadField component to perform functionality
          uniforms: { component: ImageUploadField },
        },
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
};

export default customImage;