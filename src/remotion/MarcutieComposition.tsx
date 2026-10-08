import { Sequence } from "remotion";
import { RemotionCompositionProps, secondsToFrames } from "./types";
import { HookScene } from "./scenes/HookScene";
import { ProductRevealScene } from "./scenes/ProductRevealScene";

export function MarcutieComposition({ storyboard, fps = 30 }: RemotionCompositionProps) {
  const { scenes, aspectRatio, tone, imageUrl } = storyboard;

  // Calculate cumulative start frames
  let currentStartFrame = 0;
  const sequencedScenes = (scenes || []).map((scene) => {
    const durationInFrames = secondsToFrames(scene.duration, fps);
    const from = currentStartFrame;
    currentStartFrame += durationInFrames;
    return {
      scene,
      from,
      durationInFrames,
    };
  });

  return (
    <>
      {sequencedScenes.map(({ scene, from, durationInFrames }) => {
        return (
          <Sequence
            key={scene.id || `${scene.type}-${from}`}
            from={from}
            durationInFrames={durationInFrames}
          >
            {(() => {
              switch (scene.type) {
                case "hook":
                  return (
                    <HookScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      durationInFrames={durationInFrames}
                    />
                  );
                case "product_reveal":
                  return (
                    <ProductRevealScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      imageUrl={imageUrl}
                      durationInFrames={durationInFrames}
                    />
                  );
                default:
                  // Temporary fallback for highlight_beats and outro (until Plan 04-02 implements dedicated scenes)
                  return (
                    <HookScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      durationInFrames={durationInFrames}
                    />
                  );
              }
            })()}
          </Sequence>
        );
      })}
    </>
  );
}
