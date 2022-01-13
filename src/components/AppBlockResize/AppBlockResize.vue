<template>
  <div
    ref="main"
    class="main"
    :style="style"
  >
    <slot />
    <div
      ref="main_resize"
      class="resize"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, PropSync, Ref } from 'vue-property-decorator'

@Component
export default class AppBlockResize extends Vue {
  @PropSync('width', { default: () => 400 }) syncWidth: number
  @Prop({ default: () => 280 }) readonly minWidth: number
  @Prop({ default: () => 0 }) readonly maxWidth: number

  @Ref('main') readonly main: HTMLElement
  @Ref('main_resize') readonly main_resize: HTMLElement

  ie = 0
  op = 0
  ff = 0
  block // Основной блок
  block_r // Блок для изменения размеров
  delta_w = 0 // Изменение по ширине
  delta_h = 0 // Изменение по высоте

  get style () {
    return {
      width: `${this.syncWidth}px`,
      'min-width': `${this.minWidth}px`
    }
  }

  /* После загрузки страницы */
  public mounted () {
    /* Определяем браузер */
    const browser = navigator.userAgent
    if (browser.indexOf('Opera') !== -1) this.op = 1
    else {
      if (browser.indexOf('MSIE') !== -1) this.ie = 1
      else {
        if (browser.indexOf('Firefox') !== -1) this.ff = 1
      }
    }

    this.block = this.main // Получаем основной блок
    this.block_r = this.main_resize // Получаем блок для изменения размеров

    document.onmouseup = this.clearXY // Ставим обработку на отпускание кнопки мыши
    this.block_r.onmousedown = this.saveWH // Ставим обработку на нажатие кнопки мыши
  }

  /* Функция для получения текущих координат курсора мыши */
  private getXY (obj_event) {
    let x = 0
    let y = 0
    if (obj_event) {
      x = obj_event.pageX
      y = obj_event.pageY
    } else {
      // @ts-expect-error: x = window.event.clientX
      x = window.event.clientX
      // @ts-expect-error: y = window.event.clientY
      y = window.event.clientY
      if (this.ie) {
        y -= 2
        x -= 2
      }
    }
    return [x, y]
  }

  private saveWH (obj_event) {
    const point = this.getXY(obj_event)
    const w_block = this.block.clientWidth // Текущая ширина блока
    const h_block = this.block.clientHeight // Текущая высота блока
    this.delta_w = w_block - point[0] // Измеряем текущую разницу между шириной и x-координатой мыши
    this.delta_h = h_block - point[1] // Измеряем текущую разницу между высотой и y-координатой мыши
    /* Ставим обработку движения мыши для разных браузеров */
    document.onmousemove = this.resizeBlock
    if (this.op || this.ff) document.addEventListener('onmousemove', this.resizeBlock, false)
    return false // Отключаем стандартную обработку нажатия мыши
  }

  /* Функция для измерения ширины окна */
  private clientWidth () {
    return document.documentElement.clientWidth === 0 ? document.body.clientWidth : document.documentElement.clientWidth
  }

  /* Функция для измерения высоты окна */
  private clientHeight () {
    return document.documentElement.clientHeight === 0 ? document.body.clientHeight : document.documentElement.clientHeight
  }

  /* При отпускании кнопки мыши отключаем обработку движения курсора мыши */
  private clearXY () {
    document.onmousemove = null
  }

  private resizeBlock (obj_event) {
    const point = this.getXY(obj_event)
    const new_w = this.delta_w + point[0] // Изменяем новое приращение по ширине
    if (new_w < this.minWidth) {
      this.syncWidth = this.minWidth
      return
    }
    if (new_w > this.maxWidth && this.maxWidth > 0) {
      this.syncWidth = this.maxWidth
      return
    }
    this.syncWidth = new_w
    // const new_h = this.delta_h + point[1] // Изменяем новое приращение по высоте
    this.block.style.width = new_w + 'px' // Устанавливаем новую ширину блока
    // this.block.style.height = new_h + 'px' // Устанавливаем новую высоту блока
    /* Если блок выходит за пределы экрана, то устанавливаем максимальные значения для ширины и высоты */
    if (this.block.offsetLeft + this.block.clientWidth > this.clientWidth()) this.block.style.width = (this.clientWidth() - this.block.offsetLeft) + 'px'
    // if (this.block.offsetTop + this.block.clientHeight > this.clientHeight()) this.block.style.height = (this.clientHeight() - this.block.offsetTop) + 'px'
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  padding-right: 10px;
}

.resize {
  background-color: rgba(125, 125, 125, 0.98);
  cursor: ew-resize;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 2px;
}
</style>
