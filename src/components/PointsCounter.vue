<template>
    <div class="counter">
        Показано <strong>{{ visible }}</strong> из {{ total }} точек
    </div>
</template>

<script setup lang="ts">
defineProps<{ total: number; visible: number }>()
</script>

<style scoped>
.counter {
    text-align: center;
    margin: 16px 0;
    font-size: 1.1em;
    color: #444;
}
</style>