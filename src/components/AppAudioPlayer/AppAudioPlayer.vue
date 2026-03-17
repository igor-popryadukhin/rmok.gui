<template>
  <div class="text-center">
    <v-bottom-sheet
      v-model="visibleSync"
      :max-width="breakpointWidth"
      hide-overlay
      no-click-animation
      persistent
    >
      <v-card tile>
        <v-progress-linear
          v-model="progress"
          class="my-0"
          height="8"
          style="cursor: pointer"
          tabindex="0"
          @click.native="onProgressClick(progress)"
        />

        <v-list>
          <v-list-item>
            <v-list-item-content style="overflow: initial!important;">
              <v-list-item-title>{{ author }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ displayString }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-spacer />

            <!-- Actions -->
            <!-- Скачать -->
            <v-list-item-icon class="mr-5">
              <v-tooltip
                open-delay="500"
                top
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    :disabled="!src"
                    :href="src"
                    target="_top"
                    icon
                    v-on="on"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
                <span>{{ tc('Download the audio file to your computer') }}</span>
              </v-tooltip>
            </v-list-item-icon>
            <!-- Скачать -->

            <v-list-item-action class="mr-5">
              <v-tooltip
                open-delay="500"
                top
              >
                <template #activator="{ on, attrs }">
                  <v-slider
                    v-model="audioPlayerVolume"
                    v-bind="attrs"
                    :max="1"
                    :min="0"
                    :step="0.001"
                    style="min-width: 150px"
                    prepend-icon="mdi-volume-high"
                    v-on="on"
                  />
                </template>
                <span>{{ tc('Audio file playback speed') }}</span>
              </v-tooltip>
            </v-list-item-action>

            <v-list-item-icon class="mr-5">
              <v-tooltip
                open-delay="500"
                top
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="onSpeedClick"
                  >
                    <v-icon>{{ stateSpeedIcon }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ tc('Audio file playback speed') }}</span>
              </v-tooltip>
            </v-list-item-icon>

            <v-list-item-icon>
              <v-btn
                icon
                @click="backward"
              >
                <v-icon>mdi-skip-backward</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
              <v-btn
                v-if="paused"
                icon
                @click="play"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                @click="pause"
              >
                <v-icon>mdi-pause</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon>
              <v-btn
                icon
                @click="close"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-icon>
            <!-- Actions -->
          </v-list-item>
        </v-list>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, PropSync, Watch } from 'vue-property-decorator';

@Component
export default class AppAudioPlayer extends Vue {
  @Prop({ required: true }) readonly src!: string
  @Prop({ default: () => true }) readonly autoCloseAfterEndPlay!: boolean
  @Prop({ default: () => '' }) readonly author!: string
  @PropSync('volume', { default: () => true }) volumeSync!: number
  @PropSync('visible', { default: () => true }) visibleSync!: boolean

  stateSpeed = 'x1'
  stateSpeedIcon = 'mdi-numeric-1-circle-outline'
  audioPlayer = new Audio()
  audioPlayerVolume = 1
  progress = 0
  paused = true
  playbackRate = 1.0
  processDownloading = false
  displayString = ''

  get breakpointWidth () {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return '100%';
      case 'sm':
        return '100%';
      case 'md':
        return '70%';
      case 'lg':
        return '60%';
      case 'xl':
        return '50%';

      default:
        return '100%';
    }
  }

  @Watch('volumeSync')
  volumeSyncWatch (value: number) {
    this.audioPlayerVolume = value;
  }

  @Watch('audioPlayerVolume')
  audioPlayerVolumeWatch (value: number) {
    this.volumeSync = value;
    this.audioPlayer.volume = value;
  }

  @Watch('visibleSync')
  srcVolumeWatch (value: boolean) {
    if (value) {
      this.play();
    }
  }

  public created () {
    this.audioPlayerVolume = this.volumeSync;
  }

  public mounted () {
    this.initializePlayer();
  }

  private tc (name: string) {
    return this?.$tc(name) || name;
  }

  private backward () {
    this.audioPlayer.currentTime = 0.0;
  }

  private play () {
    this.setSpeedNormal();
    this.audioPlayer.src = this.src;
    this.paused = false;
    this.audioPlayer.play();
  }

  private pause () {
    this.paused = true;
    this.audioPlayer.pause();
  }

  private stop () {
    this.audioPlayer.pause();
    this.progress = 0.0;
    this.audioPlayer.currentTime = 0.0;
    this.paused = this.audioPlayer.paused;
  }

  private show () {
    this.visibleSync = true;
  }

  private hide () {
    this.visibleSync = false;
  }

  private close () {
    this.stop();
    this.hide();
  }

  /**
   * При клике установить позицию
   * @param progress
   */
  private onProgressClick (progress: number) {
    this.audioPlayer.currentTime = (progress * this.audioPlayer.duration) / 100;
  }

  private onSpeedClick () {
    switch (this.stateSpeed) {
      case 'x1': {
        this.audioPlayer.playbackRate = 1.5;
        this.stateSpeed = 'x2';
        this.stateSpeedIcon = 'mdi-numeric-2-circle-outline';
        break;
      }

      case 'x2': {
        this.audioPlayer.playbackRate = 2.0;
        this.stateSpeed = 'x3';
        this.stateSpeedIcon = 'mdi-numeric-3-circle-outline';
        break;
      }

      case 'x3': {
        this.audioPlayer.playbackRate = 1.0;
        this.stateSpeed = 'x1';
        this.stateSpeedIcon = 'mdi-numeric-1-circle-outline';
        break;
      }
    }
  }

  private setSpeedNormal () {
    this.audioPlayer.playbackRate = 1.0;
    this.stateSpeed = 'x1';
    this.stateSpeedIcon = 'mdi-numeric-1-circle-outline';
  }

  private initializePlayer () {
    this.audioPlayer.currentTime = 0.0;
    this.audioPlayer.src = this.src;
    this.audioPlayer.loop = false;
    this.audioPlayer.volume = this.audioPlayerVolume;
    this.audioPlayer.autoplay = false;

    this.audioPlayer.onloadstart = () => {
      this.displayString = this.$tc('Loading media...');
      this.processDownloading = true;
    };

    this.audioPlayer.onloadeddata = () => {
      this.displayString = '00:00:00 / 00:00:00';
      this.processDownloading = false;
    };

    // Прогресс
    this.audioPlayer.ontimeupdate = (s) => {
      this.progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
      this.displayString = `${this.durationHms(this.audioPlayer.currentTime)} / ${ this.durationHms(this.audioPlayer.duration)}`;
    };

    // Конец
    this.audioPlayer.onended = () => {
      this.paused = this.audioPlayer.paused;
      this.audioPlayer.currentTime = 0.0;
      this.progress = 0;

      if (this.autoCloseAfterEndPlay) {
        setTimeout(() => {
          this.visibleSync = false;
        }, 1500);
      }
    };

    this.audioPlayer.onerror = () => {
      this.displayString = this.$tc('Media loading error');
    };
  }

  private durationHms (seconds: number) {
    const h: number = Math.floor(seconds / 3600);
    const m: number = Math.floor(seconds % 3600 / 60);
    const s: number = Math.floor(seconds % 3600 % 60);

    return String(h).padStart(2, '00') + ':' + String(m).padStart(2, '00') + ':' + String(s).padStart(2, '00');
  }
}
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "Loading media...": "Загрузка медиа...",
    "Media loading error": "Ошибка загрузки медиа"
  }
}
</i18n>
