<template>
  <div>
    <svg
      width="280px"
      height="400px"
      viewBox="0 0 837 1045"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
    >
      <g
        id="Page-1"
        stroke="none"
        stroke-width="10"
        fill="none"
        fill-rule="evenodd"
        sketch:type="MSPage"
      >
        <path
          id="Polygon-1"
          d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
          stroke="#3a70d4"
          stroke-width="10"
          sketch:type="MSShapeGroup"
        />
        <path
          id="Polygon-2"
          d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
          stroke="#3a70d4"
          stroke-width="10"
          sketch:type="MSShapeGroup"
        />
        <path
          id="Polygon-3"
          d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
          stroke="#3a70d4"
          stroke-width="10"
          sketch:type="MSShapeGroup"
        />
        <path
          id="Polygon-4"
          d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
          stroke="#3a70d4"
          stroke-width="10"
          sketch:type="MSShapeGroup"
        />
        <path
          id="Polygon-5"
          d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
          stroke="#3a70d4"
          stroke-width="10"
          sketch:type="MSShapeGroup"
        />
      </g>
    </svg>
    <div class="message-box">
      <h1>{{ title }}</h1>
      <p>{{ subTitle }}</p>
      <div class="buttons-con">
        <div class="action-link-wrap">
          <v-btn
            class="mr-3"
            color="primary"
            tile
            outlined
            @click="$router.back()"
          >
            {{ $tc('Go to back') }}
          </v-btn>
          <v-btn
            color="primary"
            tile
            outlined
          >
            {{ $tc('Go to Home Page') }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppError',

  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss" scoped>
svg {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -350px;
}
.message-box {
  user-select: none;
  height: 200px;
  min-width: 480px;
  max-width: 550px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: 0;
  color: #3a70d4;
  font-family: Roboto;
  font-weight: 300;
}
.message-box h1 {
  font-size: 32px;
  line-height: 46px;
  margin-bottom: 20px;
}

.buttons-con .action-link-wrap {
  margin-top: 40px;
}
.buttons-con .action-link-wrap a {
  background: #68c950;
  padding: 8px 25px;
  border-radius: 4px;
  color: #FFF;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s linear;
  cursor: pointer;
  text-decoration: none;
  margin-right: 10px
}
.buttons-con .action-link-wrap a:hover {
  background: #5A5C6C;
  color: #fff;
}

#Polygon-1 , #Polygon-2 , #Polygon-3 , #Polygon-4 , #Polygon-4, #Polygon-5 {
  animation: float 1s infinite ease-in-out alternate;
}
#Polygon-2 {
  animation-delay: .2s;
}
#Polygon-3 {
  animation-delay: .4s;
}
#Polygon-4 {
  animation-delay: .6s;
}
#Polygon-5 {
  animation-delay: .8s;
}

@keyframes float {
  100% {
    transform: translateY(20px);
  }
}
@media (max-width: 450px) {
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -190px;
  }
  .message-box {
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -190px;
    text-align: center;
  }
}
</style>
