<template>
  <footer>
    <p>Created by Adam Gerhartz © {{ year }}</p>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    year: String
  }
})
export default class CustomFooter extends Vue {
  year!: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
footer p {
  font-family: 'courier new';
  font-size: 14px;
}
</style>
