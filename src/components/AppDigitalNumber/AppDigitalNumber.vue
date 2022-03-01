<template>
  <div class="display">
    <div class="digits">
      <div class="zero">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="one">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="two">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="three">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="four">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="five">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="six">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="seven">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="eight">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
      <div class="nine">
        <span class="d1" />
        <span class="d2" />
        <span class="d3" />
        <span class="d4" />
        <span class="d5" />
        <span class="d6" />
        <span class="d7" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class AppDigitalNumber extends Vue {

}
</script>

<style lang="scss" scoped>
$bg-color: #000;
$digits-color: #767676;
$d-width: 2px;
$d-hight: 2px;
$d-hight-half: $d-hight / 2;
$extra-hight: -$d-hight;
$gap: $d-hight / 2;
$first-top: $gap + $d-hight;
$second-top: $first-top + $d-width + $d-hight + $first-top;
$third-top: $first-top + ($d-width*2) + $d-hight + $first-top + $gap;
$middle-top: $first-top + $d-width + ($first-top / 2);
$d-left: -($gap + $d-hight);
$d-right: $gap + $d-width;

@mixin extra {
  content: " ";
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
}

.display {}

.digits div {
  position: relative;
  //width: 75px;
  //height: 160px;
  display: inline-block;
  margin: 0 0.4em;
}

.digits .d1 {
  position: absolute;
  display: block;
  width: $d-width;
  height: $d-hight;
  background: $digits-color;
}

.digits .d1:before {
  @include extra;
  left: $extra-hight;
  border-width: 0 $d-hight $d-hight 0;
  border-color: transparent $digits-color transparent transparent;
}

.digits .d1:after {
  @include extra;
  right: $extra-hight;
  border-width: $d-hight $d-hight 0 0;
  border-color: $digits-color transparent transparent transparent;
}

.digits .d2 {
  left: $d-left;
  top: $first-top;
  position: absolute;
  display: block;
  width: $d-hight;
  height: $d-width;
  background: $digits-color;
}

.digits .d2:before {
  @include extra;
  top: $extra-hight;
  border-width: $d-hight 0 0 $d-hight;
  border-color: transparent transparent transparent $digits-color;
}

.digits .d2:after {
  @include extra;
  bottom: $extra-hight;
  border-width: $d-hight $d-hight 0 0;
  border-color: $digits-color transparent transparent transparent;
}

.digits .d3 {
  left: $d-right;
  top: $first-top;
  position: absolute;
  display: block;
  width: $d-hight;
  height: $d-width;
  background: $digits-color;
}

.digits .d3:before {
  @include extra;
  top: $extra-hight;
  border-width: 0 0 $d-hight $d-hight;
  border-color: transparent transparent $digits-color transparent;
}

.digits .d3:after {
  @include extra;
  bottom: $extra-hight;
  border-width: 0 $d-hight $d-hight 0;
  border-color: transparent $digits-color transparent transparent;
}

.digits .d4 {
  left: $d-left;
  top: $second-top;
  position: absolute;
  display: block;
  width: $d-hight;
  height: $d-width;
  background: $digits-color;
}

.digits .d4:before {
  @include extra;
  top: $extra-hight;
  border-width: $d-hight 0 0 $d-hight;
  border-color: transparent transparent transparent $digits-color;
}

.digits .d4:after {
  @include extra;
  bottom: $extra-hight;
  border-width: $d-hight $d-hight 0 0;
  border-color: $digits-color transparent transparent transparent;
}

.digits .d5 {
  left: $d-right;
  top: $second-top;
  position: absolute;
  display: block;
  width: $d-hight;
  height: $d-width;
  background: $digits-color;
}

.digits .d5:before {
  @include extra;
  top: $extra-hight;
  border-width: 0 0 $d-hight $d-hight;
  border-color: transparent transparent $digits-color transparent;
}

.digits .d5:after {
  @include extra;
  bottom: $extra-hight;
  border-width: 0 $d-hight $d-hight 0;
  border-color: transparent $digits-color transparent transparent;
}

.digits .d6 {
  position: absolute;
  display: block;
  top: $middle-top;
  width: $d-width;
  height: $d-hight;
  background: $digits-color;
}

.digits .d6:before {
  @include extra;
  left: $extra-hight;
  border-width: $d-hight-half $d-hight $d-hight-half 0;
  border-color: transparent $digits-color transparent transparent;
}

.digits .d6:after {
  @include extra;
  right: $extra-hight;
  border-width: $d-hight-half 0 $d-hight-half $d-hight;
  border-color: transparent transparent transparent $digits-color;
}

.digits .d7 {
  position: absolute;
  display: block;
  top: $third-top;
  width: $d-width;
  height: $d-hight;
  background: $digits-color;
}

.digits .d7:before {
  @include extra;
  left: $extra-hight;
  border-width: 0 0 $d-hight $d-hight;
  border-color: transparent transparent $digits-color transparent;
}

.digits .d7:after {
  @include extra;
  right: $extra-hight;
  border-width: $d-hight 0 0 $d-hight;
  border-color: transparent transparent transparent $digits-color;
}

/* 0 */
.digits div.zero .d6 { visibility: hidden; }

/* 1 */
.digits div.one .d1, .digits div.one .d2, .digits div.one .d4, .digits div.one .d6, .digits div.one .d7 { visibility: hidden; }

/* 2 */
.digits div.two .d2, .digits div.two .d5 { visibility: hidden; }

/* 3 */
.digits div.three .d2, .digits div.three .d4 { visibility: hidden; }

/* 4 */
.digits div.four .d1, .digits div.four .d4, .digits div.four .d7 { visibility: hidden; }

/* 5 */
.digits div.five .d3, .digits div.five .d4 { visibility: hidden; }

/* 6 */
.digits div.six .d1, .digits div.six .d3 { visibility: hidden; }

/* 7 */
.digits div.seven .d2, .digits div.seven .d4, .digits div.seven .d6, .digits div.seven .d7 { visibility: hidden; }

/* 8 */
.digits div.eight { }

/* 9 */
.digits div.nine .d4, .digits div.nine .d7 { visibility: hidden; }

</style>
