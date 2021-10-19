<template>
  <div class="table">
    <div class="table-caption">
      Заголовок таблицы
    </div>
    <div class="table-colgroup">
      <div
        class="table-col"
        width="10%"
      />
      <div
        class="table-col"
        width="30%"
      />
      <div
        class="table-col"
        width="30%"
      />
      <div
        class="table-col"
        width="30%"
      />
    </div>
    <div class="table-thead">
      <div class="table-tr">
        <div class="table-th">
          #
        </div>
        <div class="table-th">
          Имя
        </div>
        <div class="table-th">
          Фамилия
        </div>
        <div class="table-th">
          Ник
        </div>
      </div>
    </div>
    <div class="table-tbody">
      <div class="table-tr">
        <div class="table-th">
          1
        </div>
        <div class="table-td">
          Mark
        </div>
        <div class="table-td">
          Otto
        </div>
        <div class="table-td">
          @mdo
        </div>
      </div>
      <div class="table-tr">
        <div class="table-th">
          2
        </div>
        <div class="table-td">
          Jacob
        </div>
        <div class="table-td">
          Thornton
        </div>
        <div class="table-td">
          @fat
        </div>
      </div>
      <div class="table-tr">
        <div class="table-th">
          3
        </div>
        <div class="table-td">
          Larry
        </div>
        <div class="table-td">
          Bird
        </div>
        <div class="table-td">
          @twitter
        </div>
      </div>
    </div>
    <div class="table-tfoot">
      <div class="table-tr">
        <div class="table-th">
          #
        </div>
        <div class="table-th">
          Имя
        </div>
        <div class="table-th">
          Фамилия
        </div>
        <div class="table-th">
          Ник
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTable'
}
</script>

<style lang="scss" scoped>
.table {
  display: table;
  width: 100%;
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid #d3d3d3;
  empty-cells: show;
}
.table-caption {
  display: table-caption;
  padding: 10px;
  color: #828282;
  font-size: 16px;
  text-align: center;
}
.table-colgroup {
  display: table-column-group;
}
.table-col {
  display: table-column;
}
.table-thead {
  display: table-header-group;
}
.table-tbody {
  display: table-row-group;
}
.table-tfoot {
  display: table-footer-group;
}
.table-tr {
  display: table-row;
  padding: 0 0 0 0;
}
.table-th {
  display: table-cell;
  padding: 2px 10px 2px 10px;
  border: 1px solid #e2e2e2;
  font-weight: bold;
  text-align: left;
}
.table-td {
  display: table-cell;
  padding: 2px 10px 2px 10px;
  border: 1px solid #e2e2e2;
}
.table-thead .table-th, .table-thead .table-td {
  background: #f9f9f9;
}
.table-tbody .table-th, .table-tbody .table-td {
  background: #fff;
}
.table-tfoot .table-th, .table-tfoot .table-td {
  background: #f4f6ff;
}
</style>
