<template>
  <div
    ref="editor"
    class="pell"
    style="white-space: nowrap"
    :style="cssVars"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Ref, VModel, Watch } from 'vue-property-decorator';

import pell, { PellElement } from 'pell';

@Component
export default class AppPellEditor extends Vue {
  pell: PellElement = null
  innerEdit = false

  @Ref('editor') readonly editor: HTMLElement

  @Prop({ default: 400 }) readonly height!: number
  @Prop({ default: 400 }) readonly width!: number

  @VModel({ type: String, default: () => '' }) content!: string

  @Watch('content')
  contentWatchHandler (val: string) {
    if (!this.innerEdit) {
      this.pell.content.innerHTML = val;
    }
  }

  get cssVars () {
    return {
      '--pell-content-height': typeof this.height === 'number' ? this.height + 'px' : this.height,
      '--height': this.height + 'px'
    };
  }

  public mounted () {
    this.initialize();
  }

  public beforeDestroy () {
    this.pell = undefined;
  }

  private initialize () {
    this.pell = pell.init({
      element: this.editor,
      onChange: (html: string) => {
        this.innerEdit = true;
        this.content = html;
        // TODO: Костыль
        setTimeout(() => (this.innerEdit = false), 0);
      },
      defaultParagraphSeparator: 'div',
      styleWithCSS: true,
      actions: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'heading1',
        'heading2',
        'paragraph',
        'quote',
        'olist',
        'ulist',
        'code',
        'line'
      ],
      classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
      }
    });
    this.pell.content.innerHTML = this.content;
  }
}
</script>

<style lang="scss" >
@import '~pell/src/pell';

.pell {
  border: 1px solid #bebebe;
  border-radius: 4px;
  box-shadow: none;
}

.pell:focus {
  border: 2px solid #11659d;
  user-focus: normal;
}

.pell-content {
  box-sizing: border-box;
  height: var(--pell-content-height);
  outline: 0;
  overflow-y: auto;
  padding: $pell-content-padding;
}
</style>
