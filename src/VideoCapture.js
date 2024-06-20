import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BackgroundFetch from 'react-native-background-fetch';

const VideoCapture = () => {
  const [frameRate, setFrameRate] = useState(5);
  const [resolution, setResolution] = useState('1280x720');
  const [imageStabilization, setImageStabilization] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    BackgroundFetch.configure({
      minimumFetchInterval: 15, // Fetch interval in minutes
    }, async (taskId) => {
      console.log('[BackgroundFetch] taskId: ', taskId);
      // Implement background sync logic here
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log('[BackgroundFetch] failed to start');
    });
  }, []);

  const startRecording = async () => {
    if (cameraRef) {
      setIsRecording(true);
      const options = {
        quality: resolution === '1920x1080' ? RNCamera.Constants.VideoQuality['1080p'] : RNCamera.Constants.VideoQuality['720p'],
        videoStabilizationMode: imageStabilization ? RNCamera.Constants.VideoStabilization['auto'] : RNCamera.Constants.VideoStabilization['off'],
        fps: frameRate,
      };
      const data = await cameraRef.recordAsync(options);
      console.log('Video data: ', data);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef && isRecording) {
      cameraRef.stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={ref => setCameraRef(ref)}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={true}
      />
      <View style={styles.controlPanel}>
        <Button title="Start Recording" onPress={startRecording} disabled={isRecording} />
        <Button title="Stop Recording" onPress={stopRecording} disabled={!isRecording} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default VideoCapture;
