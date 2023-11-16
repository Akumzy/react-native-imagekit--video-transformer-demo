import { StyleSheet, Text, View, TextInput, Pressable, Button, ScrollView } from "react-native";
import React, { useCallback } from 'react';
import { Video, ResizeMode } from 'expo-av';




const videoUrl = "https://ik.imagekit.io/rjxlixj7d/workers.mp4"

function generateImageKitTransformationURL (baseURL, transformationParams) {
  // Start with the base URL
  let imageURL = baseURL + '?';

  // Iterate through the transformation parameters
  for (const key in transformationParams) {
    if (transformationParams.hasOwnProperty(key)) {
      let delimater = '-'
      if (key === 'tr') delimater = '='
      // Append the parameter key and value to the URL
      imageURL += `${key}${delimater}${encodeURIComponent(transformationParams[key])},`;
    }
  }

  // Remove the trailing comma and return the final URL
  return imageURL.slice(0, -1);
}

export default function Page () {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [text, setText] = React.useState("We are going to have some food")
  const [computedUrl, setComputedUrl] = React.useState(videoUrl)

  const handlePlayAndPause = () => {
    if (status.isPlaying) {
      video.current.pauseAsync();
    } else {
      video.current.playAsync();
    }
  }
  const addTextToVideo = useCallback(() => {
    // https://ik.imagekit.io/rjxlixj7d/workers.mp4?tr=l-text,i-Let's%20GO!!,bg-yellow,pa-bw_mul_0.01,l-end
    // https://ik.imagekit.io/rjxlixj7d/workers.mp4?tr=l-text,i=Let's%20GO!!,bg=yellow,pa=bw_mul_0.01,l=end
    // https://ik.imagekit.io/rjxlixj7d/workers.mp4?tr=l-text,i-We%20need%20a%20better%20system%20plan%20,bg-yellow,pa-bw_mul_0.01,l-end
    return generateImageKitTransformationURL(videoUrl, {
      tr: 'l-text',
      i: encodeURIComponent(text),
      fs: 'bh_div_20',
      w: 'bh_div_2',
      bg: 'yellow',
      pa: 'bw_mul_0.01',
      l: 'end',
    })
  }, [text])
  const addTextImageToVideo = useCallback(() => {
    const imageId = 'default-image.jpg'
    // https://ik.imagekit.io/demo/base-video.mp4?tr=l-image,i-logo.png,l-end
    return generateImageKitTransformationURL(videoUrl, {
      tr: 'l-image',
      i: imageId,
      w: 'bh_div_2',
      l: 'end',
    })
  }, [])

  const addTextSubtitleToVideo = useCallback(() => {
    // https://ik.imagekit.io/demo/base-video.mp4?tr=l-subtitles,i-english.srt,l-end
    const subtitleId = 'worker-preview.srt'
    return generateImageKitTransformationURL(videoUrl, {
      tr: 'l-subtitles',
      i: subtitleId,
      l: 'end',
    })
  }, [])
  console.log(computedUrl);
  return (
    <ScrollView contentContainerStyle={ styles.container }>
      <View style={ styles.main }>
        <Text style={ styles.title }>Hello World</Text>

        <View>
          <TextInput
            multiline
            numberOfLines={ 4 }
            placeholder="Enter your text here"
            style={ { padding: 10, borderColor: 'gray', borderWidth: 1 } }
            onChangeText={ text => setText(text) }
            value={ text }
          />
          <View style={ { paddingVertical: 16 } } >
            <Pressable onPress={ () => setComputedUrl(addTextToVideo()) }
              style={ styles.button }
            >
              <Text style={ { color: 'white' } }>Add Text Overlay to Video</Text>
            </Pressable>
            <Pressable onPress={ () => setComputedUrl(addTextImageToVideo()) }
              style={ styles.button }
            >
              <Text style={ { color: 'white' } }>Add Image Overlay to Video</Text>
            </Pressable>
            <Pressable onPress={ () => setComputedUrl(addTextSubtitleToVideo()) }
              style={ styles.button }
            >
              <Text style={ { color: 'white' } }>Add Text Subtitle to Video</Text>
            </Pressable>

          </View>

        </View>
        <View>
          <Video
            ref={ video }
            style={ styles.video }
            source={ {
              uri: computedUrl
            } }
            useNativeControls
            resizeMode={ ResizeMode.CONTAIN }
            isLooping
            onPlaybackStatusUpdate={ status => setStatus(() => status) }
          />
          <View style={ styles.buttons }>
            <Button
              title={ status.isPlaying ? 'Pause' : 'Play' }
              onPress={ handlePlayAndPause }
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  button: {
    marginVertical: 8,
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  }
});
