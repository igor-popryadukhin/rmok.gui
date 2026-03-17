import Vue from 'vue';
import AudioPlayer from './src/AudioPlayer';

declare module 'vue/types/vue' {
  interface Vue {
    $audio: AudioPlayer;
  }

  interface VueConstructor {
    $audio: AudioPlayer;
  }
}
