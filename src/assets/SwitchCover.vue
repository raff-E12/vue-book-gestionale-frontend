<template lang="html">
    <div :class="['container-switch-cover ', toogleCover ? 'active' : '', location.path.includes('book') ? 'top-up' : '']">
        <div class="box-ham" @click="() => toogleCover = !toogleCover">
            <i class="pi pi-bars"></i>
        </div>
        <div class="box-content">
            <i class="pi pi-book"></i>
            <div class="label">Cambia Copertina</div>
            <div class="switch-cover">
                <div class="cover">
                    <ToggleSwitch v-model="checked" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ToggleSwitch from 'primevue/toggleswitch';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const emit = defineEmits(['toogleCover']);
const toogleCover = ref(false);
const location = useRoute();

const checked = ref(false);

watch(checked, (newValue) => {
    emit('toogleCover', newValue)
}, { immediate: true });
</script>

<style scoped lang="css">

.box-ham {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: -2px 0px 2px rgba(0, 0, 0, 0.08);
  z-index: 1001;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 0;
  cursor: pointer;
  border-bottom-right-radius: 0;
}

.container-switch-cover.top-up,
.container-switch-cover.active.top-up {
  top: 20px !important;
}

.box-ham:hover i{
  color: #000000;
  transition: color 0.3s ease-in-out;
}

.container-switch-cover.active{
  right: 0;
}

.container-switch-cover.active .box-content{
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.box-ham i{
    font-size: 20px;
    color: #5c5c5d;
}

.container-switch-cover {
  position: fixed;
  z-index: 1000;
  right: -120px;
  display: flex;
  top: 90px;
  flex-direction: row;
  transition: right 0.3s ease-in-out;
}

.box-content {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 109px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  border-top-left-radius: 0;
  border-bottom-left-radius: 10px;
  transition: border-radius 0.3s ease-in-out;
}

.label {
  font-size: 14px;
  color: #5c5c5d;
  margin-top: 5px;
  margin-bottom: 12px;
  font-weight: 900;
}

.switch-cover {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover{
    width: 100px;
    height: auto;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>