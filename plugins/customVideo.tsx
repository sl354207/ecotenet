import VideoRender from '@components/editorPlugins/VideoRender';
import VideoUploadField from '@components/editorPlugins/VideoUploadField';
import { CellPlugin, lazyLoad } from '@react-page/editor';

const PlayArrow = lazyLoad(() => import('@mui/icons-material/PlayArrow'));

// use a type here, not an interface
type Data = {
  src: string
}

const customVideo: CellPlugin<Data> = {
  Renderer: ({ data, isPreviewMode }) => (
    <VideoRender data={data} preview={isPreviewMode}/>
  ),
  id: 'customVideo',
  title: 'Video',
  description: 'Include a video from Youtube or similar platforms.',
  version: 1,
  isInlineable: true,
  icon: <PlayArrow />,
  controls: {
    type: 'autoform',
    columnCount: 1,
    schema: {
      required: ['src'],
      type: 'object',
      properties: {
        src: {
          type: 'string',
          uniforms: {
            component: VideoUploadField
          },
          
        },
      },
    },
  },
};


export default customVideo;