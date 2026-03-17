import { makeAudioElement } from '@/utils/utils';
import Vue from 'vue';

// Instance
const htmlAudioElement: HTMLAudioElement = makeAudioElement(`html-audio-element-${new Date().getTime()}`);

class HTMLAudioElementPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $htmlAudioElement: {
        get () {
          return htmlAudioElement;
        }
      }
    });
  }
}

Vue.use(new HTMLAudioElementPlugin());
