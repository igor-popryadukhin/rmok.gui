<template>
  <Vueditor
    ref="editor"
    style="min-height: 600px"
  ></Vueditor>
</template>

<script lang="ts">
import Vue from 'vue'
import Vueditor from 'vueditor'
import 'vueditor/dist/style/vueditor.min.css'

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
    undo: { title: 'Назадо' },
    redo: { title: 'Вперед' }
  },
  fontSize: ['12px', '14px', '16px', '18px', '0.8rem', '1.0rem', '1.2rem', '1.5rem', '2.0rem'],
  uploadUrl: ''
})

export default Vue.extend({
  name: 'AppWysiwyg',

  props: {
    value: {
      type: String,
      default: () => ''
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  watch: {
    value (value) {
      this.$refs.editor.setContent(value)
    }
  },

  mounted () {
    const vEditor = this.$children[0]

    vEditor.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'UPDATE_CONTENT': {
          this.$emit('change', mutation.payload)
          break
        }
      }
    })
  },

  methods: {
    getContent () {
      return this.$refs.editor.getContent()
    },

    setContent (value) {
      return this.$refs.editor.setContent(value)
    }
  }
})
</script>

<style scoped>
.vueditor {
  min-height: 400px
}
</style>
