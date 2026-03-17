<template>
  <div class="manager-employment-page">
    <manager-employment-tools class="mb-1" />
    <app-divider />
    <div class="manager-employment-page__box">
      <manager-employment-filters />
      <v-divider
        class="px-1"
        vertical
      />
      <div class="manager-employment-page__statistic">
        <div :style="{ height: apexchartHeight }">
          <app-chart-bar
            :series="series"
            :labels="labels"
            :colors="colors"
            :height="apexchartHeight"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppChartBar from '@/components/AppChartBar/AppChartBar.vue';
import $store from '@/store';
import ManagerEmploymentFilters from '@/views/Statistics/ManagerEmployment/ManagerEmploymentFilters.vue';
import ManagerEmploymentTools from '@/views/Statistics/ManagerEmployment/ManagerEmploymentTools.vue';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: { ManagerEmploymentTools, ManagerEmploymentFilters, AppChartBar },
  beforeRouteEnter (to, from, next) {
    $store.dispatch('statistics/manager_employment/fetch')
      .then(() => {
        next();
      });
  }
})
export default class ManagerEmployment extends Vue {
  get types () {
    return this.$store.getters['statistics/manager_employment/types'];
  }

  get series () {
    const series = [];
    this.$store.getters['statistics/manager_employment/items']
      .forEach((value: unknown & { series: any[]; }) => {
        value.series.forEach((value1: any) => {
          const index = series.findIndex((value) => value.name === value1.name);
          if (index > -1) {
            series[index].data.push(value1.seconds);
          } else {
            series.push({
              data: [value1.seconds],
              name: value1.name
            });
          }
        });
      });
    return series;
  }

  get labels () {
    return this.items.map((e) => e.user_full_name);
  }

  get colors () {
    return this.types.map((e) => e.color);
  }

  get items () {
    return (this.$store.getters['statistics/manager_employment/items'] || []);
  }

  get apexchartHeight () {
    if (this.items.length < 10) {
      return '100%';
    } else {
      return `${this.items.length * 30}px`;
    }
  }
}
</script>

<style lang="scss" scoped>
.manager-employment-page {
  height: 100%;
}

.manager-employment-page__box {
  display: flex;
  flex-wrap: nowrap;
  height: calc(100vh - 160px);
  padding-top: 10px;
}


.manager-employment-page__statistic {
  flex-grow: 1;
  height: inherit;
  overflow: auto;
  padding: 10px;
}
</style>
