<template>
    <button @click="$emit('regenerate')" class="regen-btn">
        Перегенерировать точки
    </button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'regenerate'): void }>()
</script>

<style scoped>
.regen-btn {
    padding: 12px 28px;
    font-size: 16px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
}

.regen-btn:hover {
    background: #1d4ed8;
}
</style>