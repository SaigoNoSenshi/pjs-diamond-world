import { useLocalSearchParams } from 'expo-router';

import { lazyScreen } from '@/utils/lazyScreen';

// The craft player and the camera (expo-camera + image picker + manipulator) are the
// heaviest optional code in the app; they load on first use only.
const CraftPlayerWithCamera = lazyScreen(() =>
  Promise.all([
    import('@/features/crafts/CraftPlayerScreen'),
    import('@/features/crafts/components/CameraCapture'),
  ]).then(([player, camera]) => {
    const { CraftPlayerScreen } = player;
    const { CameraCapture } = camera;
    return function CraftPlayerWithCameraScreen({ craftId }: { craftId: string }) {
      return (
        <CraftPlayerScreen
          craftId={craftId}
          renderCamera={(props) => (
            <CameraCapture onCaptured={props.onCaptured} onCancel={props.onCancel} />
          )}
        />
      );
    };
  }),
);

export default function CraftRoute() {
  const { craftId } = useLocalSearchParams<{ craftId: string }>();
  return <CraftPlayerWithCamera craftId={craftId ?? ''} />;
}
