<template>
  <Vueditor
    ref="editor"
    class="vueditor"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ModelSync, Ref, Watch } from 'vue-property-decorator';
import Vueditor from 'vueditor';
import 'vueditor/dist/style/vueditor.min.css';

Vue.use(Vueditor, {
  toolbar: [
    'removeFormat', 'undo', '|', 'elements', 'fontName', 'fontSize', 'foreColor', 'backColor'
  ],
  fontName: [
    { val: 'arial black' },
    { val: 'times new roman' },
    { val: 'Courier New' }
  ],
  lang: {
    app: {},

    removeFormat: { title: 'Убрать форматирование' },

    bold: { title: 'Жирный' },
    italic: { title: 'Курсив' },
    underline: { title: 'Подчеркнутый' },
    strikeThrough: { title: 'Перечеркнутый' },

    superscript: { title: 'Верхний индекс' },
    subscript: { title: 'Нижний индекс' },
    indent: { title: 'Отступ' },
    outdent: { title: 'Выступ' },

    justifyLeft: { title: 'По левому краю' },
    justifyCenter: { title: 'По центру' },
    justifyRight: { title: 'По правому краю' },
    justifyFull: { title: 'На всю ширину' },

    insertOrderedList: { title: 'Вставить нумерованный список' },
    insertUnorderedList: { title: 'Вставить ненумерованный список' },

    foreColor: {
      title: 'Цвет шрифта',
      ok: 'ok',
      colorCode: 'Цветовой режим',
      invalidColorCodeMsg: 'Пожалуйста введите корректный цветовой код'
    },
    backColor: {
      title: 'Цвет фона',
      ok: 'ok',
      colorCode: 'Цветовой режим',
      invalidColorCodeMsg: 'Пожалуйста введите корректный цветовой код'
    },

    fontName: {},
    fontSize: {},
    code: {},
    element: {},

    design: {
      ieMsg: 'Вы должны выбрать текст, чтобы использовать эту функцию в браузере IE'
    },
    link: {
      title: 'Добавить ссылку',
      ok: 'OK'
    },
    unLink: {
      title: 'Убрать ссылку'
    },
    markdown: {
      title: 'markdown'
    },
    picture: {
      title: 'Вставить изображение',
      ok: 'OK',
      cancel: 'Отмена',
      invalidFile: 'Выбранный файл не является изображением'
    },
    sourceCode: {
      title: 'Исходный код'
    },
    fullscreen: {
      title: 'полный экран'
    },
    table: { title: 'Таблица' },
    undo: { title: 'Назад' },
    redo: { title: 'Вперед' }
  },
  fontSize: ['12px', '14px', '16px', '18px', '0.8rem', '1.0rem', '1.2rem', '1.5rem', '2.0rem'],
  uploadUrl: ''
});

@Component
export default class AppWysiwyg extends Vue {
  @Ref('editor') readonly editor!: unknown
  @ModelSync('value', 'change', { type: String })
  readonly textValue!: string

  vEditor = null

  @Watch('value')
  valueWatchHandler (value) {
    this.vEditor.setContent(value);
  }

  mounted () {
    this.vEditor = this.$children[0];

    this.vEditor.setContent(this.textValue);

    setTimeout(() => {
      let oldContent = this.textValue;
      this.vEditor.$store.subscribe((mutation, state) => {
        switch (mutation.type) {
          case 'UPDATE_CONTENT': {
            if (oldContent !== mutation.payload) {
              oldContent = mutation.payload;
              this.$emit('change', mutation.payload);
            }
            break;
          }
        }
      });
    }, 1000);
  }

  private getContent () {
    return this.vEditor.getContent();
  }

  private setContent (value: string) {
    return this.vEditor.setContent(value);
  }
}
</script>

<style lang="scss" scoped>
.vueditor {
  min-height: 600px;
}
@media only screen and (min-height: 800px) {
  .vueditor {
    min-height: 70vh!important;
  }
}

</style>
